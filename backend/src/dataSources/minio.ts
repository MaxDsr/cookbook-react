import * as Minio from 'minio';

// Internal client for backend operations (uploads, deletions, checks)
// Uses Docker internal network for fast communication
const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT as string,
    port: parseInt(process.env.MINIO_PORT as string),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string
});

// Public client for presigned URL generation
// Only initialized in production to use public subdomain
// In development, reuses the internal client
const publicClient = process.env.NODE_ENV === 'production'
    ? new Minio.Client({
        endPoint: process.env.MINIO_PUBLIC_ENDPOINT as string,
        port: parseInt(process.env.MINIO_PUBLIC_PORT as string),
        useSSL: process.env.MINIO_PUBLIC_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY as string,
        secretKey: process.env.MINIO_SECRET_KEY as string
    })
    : client;

const bucketName = process.env.MINIO_BUCKET_NAME as string;

async function testInstance() {
    try {
        await client.listBuckets();
        await client.bucketExists(bucketName);
        console.log('Minio instance connected successfully');
    } catch (error) {
        console.log('Error testing minio instance');
        console.error(error);
    }
}

export const minio = {
    client,
    publicClient,
    bucketName,
    testInstance
}