import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/uploads"),
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uuid = crypto.randomUUID();
    cb(
      null,
      uuid + file.originalname.substring(file.originalname.lastIndexOf("."))
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

  if (fileTypes.some((fileType) => fileType === file.mimetype)) {
    return cb(null, true);
  }

  return cb(null, false);
};

const maxSize = 5 * 1024 * 1024;

export const upload = (req: Request, res: Response, next: NextFunction) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json("Max file size 5MB allowed!");

    if (err) return res.status(400).json(err.message);

    if (!req.file)
      return res.status(400).json({
        msg: "No file has been uploaded, remember that you can only upload .jpeg, .jpg, .png and .gif formats.",
      });

    next();
  });
};
