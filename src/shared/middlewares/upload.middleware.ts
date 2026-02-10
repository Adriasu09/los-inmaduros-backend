import multer from "multer";
import { Request } from "express";
import { BadRequestError } from "../errors/custom-errors";

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      ),
    );
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});
