import 'express-serve-static-core';


declare module 'express-serve-static-core' {
  interface Request {
    userId: string
    file?: Express.Multer.File
  }
}

export declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number
      APP_URL: string
      CLIENT_URL: string
      MONGODB_URI: string
      MINIO_ENDPOINT: string
      MINIO_PORT: string
      STORAGE_PATH: string
      API_LOG_FILENAME: string
    }
  }
}
