import { minio } from '../dataSources';

/**
 * Generates a public presigned URL for a MinIO object.
 * Uses the publicClient which automatically generates URLs with the correct endpoint:
 * - In production: Uses public subdomain (minio.yourdomain.com)
 * - In development: Uses internal Docker endpoint
 * 
 * @param filename - The filename/key of the object in the MinIO bucket
 * @param expirySeconds - Expiry time in seconds (default: 300 = 5 minutes)
 * @returns Promise resolving to the presigned URL
 */
export async function getPublicPresignedUrl(
  filename: string, 
  expirySeconds: number = 300
): Promise<string> {
  return await minio.publicClient.presignedGetObject(
    minio.bucketName,
    filename,
    expirySeconds
  );
}

