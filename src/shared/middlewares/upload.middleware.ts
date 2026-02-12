import multer from "multer";
import { Request } from "express";
import { BadRequestError } from "../errors/custom-errors";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// File filter to only accept images with strict validation
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // 1. Validate MIME type
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new BadRequestError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      ),
    );
    return;
  }

  // 2. Sanitize filename - remove dangerous characters
  // Allow only: letters, numbers, dots, hyphens, underscores
  const sanitizedFilename = file.originalname
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace invalid chars with underscore
    .replace(/\.{2,}/g, ".") // Replace multiple dots with single dot
    .replace(/^\.+/, "") // Remove leading dots
    .slice(0, 255); // Limit filename length

  // 3. Validate sanitized filename is not empty
  if (!sanitizedFilename || sanitizedFilename.length === 0) {
    cb(new BadRequestError("Invalid filename"));
    return;
  }

  // 4. Validate file extension matches MIME type
  const extension = sanitizedFilename.split(".").pop()?.toLowerCase();
  const validExtensions: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/gif": ["gif"],
    "image/webp": ["webp"],
  };

  const expectedExtensions = validExtensions[file.mimetype];
  if (!extension || !expectedExtensions?.includes(extension)) {
    cb(
      new BadRequestError(
        "File extension does not match file type. Please use the correct extension.",
      ),
    );
    return;
  }

  // Store sanitized filename for later use
  file.originalname = sanitizedFilename;

  cb(null, true);
};

// Create multer instance with enhanced security
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1, // Only 1 file at a time
  },
});
