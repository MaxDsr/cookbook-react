import * as Minio from 'minio';

const client = new Minio.Client({
    endPoint: 'cookbook-minio',
    port: 9000,
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