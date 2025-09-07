import * as Minio from 'minio';

const client = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT as string,
    port: parseInt(process.env.MINIO_PORT as string),
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});


async function testInstance() {
    try {
        await client.listBuckets();
        await client.bucketExists('recipe-pictures');
        console.log('Minio instance connected successfully');
    } catch (error) {
        console.log('Error testing minio instance');
        console.error(error);
    }
}

export const minio = {
    client,
    testInstance
}