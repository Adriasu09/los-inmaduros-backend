import { supabase } from "../../config/supabase.config";
import { BadRequestError } from "../errors/custom-errors";

export class StorageService {
  private bucketName = "photos"; // Nombre del bucket en Supabase

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new BadRequestError(`Failed to upload file: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(this.bucketName).getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new BadRequestError(
        error.message || "Failed to upload file to storage",
      );
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      // URL format: https://{project}.supabase.co/storage/v1/object/public/photos/{folder}/{filename}
      const urlParts = fileUrl.split("/storage/v1/object/public/photos/");
      if (urlParts.length < 2) {
        console.warn("Invalid file URL format, skipping deletion");
        return;
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error("Supabase delete error:", error);
        // Don't throw error, just log it
        // The photo record will still be deleted from DB
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      // Don't throw error, just log it
    }
  }

  /**
   * Validate file type (only images)
   */
  validateImageFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      );
    }

    // Max file size: 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new BadRequestError("File too large. Maximum file size is 5MB.");
    }
  }

  /**
   * Get folder name based on photo context
   */
  getFolderByContext(context: string): string {
    switch (context) {
      case "ROUTE_GALLERY":
        return "routes";
      case "ROUTE_CALL_COVER":
        return "route-calls/covers";
      case "ROUTE_CALL_GALLERY":
        return "route-calls/gallery";
      default:
        return "general";
    }
  }
}
