import { minio } from '../dataSources';

/**
 * Transforms a MinIO presigned URL from internal Docker hostname to public URL.
 * Only performs transformation in production environment.
 * 
 * @param presignedUrl - The presigned URL from MinIO with internal hostname
 * @returns Transformed URL with public hostname (in production) or original URL (in development)
 */
function transformMinioUrl(presignedUrl: string): string {
  // Only transform URLs in production
  if (process.env.NODE_ENV !== 'production') {
    return presignedUrl;
  }

  const internalEndpoint = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
  const publicBaseUrl = process.env.CLIENT_URL;

  if (!publicBaseUrl) {
    console.warn('CLIENT_URL not set in production environment, returning internal URL');
    return presignedUrl;
  }

  if (!presignedUrl.startsWith(internalEndpoint)) {
    console.warn('Presigned URL does not start with expected internal endpoint');
    return presignedUrl;
  }

  // Replace: http://cookbook-minio:9000/recipe-images/file.jpg?X-Amz...
  // With: https://your-domain.com/minio/recipe-images/file.jpg?X-Amz...
  return presignedUrl.replace(internalEndpoint, `${publicBaseUrl}/minio`);
}

/**
 * Generates a public presigned URL for a MinIO object.
 * In production, transforms the URL to use the public CLIENT_URL.
 * In development, returns the internal Docker URL.
 * 
 * @param filename - The filename/key of the object in the MinIO bucket
 * @param expirySeconds - Expiry time in seconds (default: 300 = 5 minutes)
 * @returns Promise resolving to the presigned URL
 */
export async function getPublicPresignedUrl(
  filename: string, 
  expirySeconds: number = 300
): Promise<string> {
  const presignedUrl = await minio.client.presignedGetObject(
    minio.bucketName,
    filename,
    expirySeconds
  );

  return transformMinioUrl(presignedUrl);
}

