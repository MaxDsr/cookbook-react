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
      NODE_ENV: string
      APP_PORT: number
      APP_URL: string
      CLIENT_URL: string
      MONGODB_URI: string
      MINIO_ENDPOINT: string
      MINIO_PORT: string
      MINIO_ACCESS_KEY: string
      MINIO_SECRET_KEY: string
      MINIO_USE_SSL: string
      MINIO_BUCKET_NAME: string
      AUTH0_DOMAIN: string
      AUTH0_CLIENT_ID: string
      AUTH0_AUDIENCE: string
    }
  }
}
