import multer from 'multer'
import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'

// Configure multer for memory storage (we'll upload directly to MinIO)
const storage = multer.memoryStorage()

// File filter to only allow image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limitw
    files: 1 // Only allow one file
  }
})

// Middleware for single file upload
export const uploadSingleImage = upload.single('image')

// Error handling middleware for multer
export const handleUploadError = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'File size too large. Maximum size is 5MB',
        status: StatusCodes.BAD_REQUEST
      })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Too many files. Only one file is allowed',
        status: StatusCodes.BAD_REQUEST
      })
    }
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Only image files are allowed',
      status: StatusCodes.BAD_REQUEST
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'File upload error',
    status: StatusCodes.INTERNAL_SERVER_ERROR
  })
}
