import * as Minio from 'minio';

const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT as string,
    port: parseInt(process.env.MINIO_PORT as string),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string
});

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
    bucketName,
    testInstance
}