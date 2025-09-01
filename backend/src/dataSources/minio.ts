import Minio from 'minio';

export const minIoClient = new Minio.Client({
    endPoint: 'localhost',
    port: 3003,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});


export async function testMinIoInstance() {
    try {
        await minIoClient.listBuckets();
        await minIoClient.bucketExists('recipe-pictures');
        console.log('Minio instance connected successfully');
    } catch (error) {
        console.log('Error testing minio instance');
        console.error(error);
    }
}
