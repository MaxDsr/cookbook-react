const Minio = require('minio');
const fs = require('fs');

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 3003,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

// Create a bucket
async function createBucket() {
  try {
    await minioClient.makeBucket('cookbook-images', 'us-east-1');
    console.log('Bucket created successfully');
  } catch (err) {
    console.error('Error creating bucket:', err);
  }
}

// Upload a file
async function uploadFile(filePath) {
  try {
    console.log('Uploading file:', filePath);
    const fileBuffer = fs.readFileSync(filePath);
    console.log('File buffer:', fileBuffer);
    const contentType = 'image/jpeg';
    minioClient.putObject
    await minioClient.fPutObject('recipe-pictures', `random-picture-${Math.random()}.jpg`, filePath, {
        'Content-Type': contentType,
    });
    console.log('File uploaded successfully');
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

// Get a presigned URL for file access
async function getPresignedUrl() {
  try {
    const url = await minioClient.presignedGetObject('cookbook-images', 'recipe-image.jpg', 24*60*60); // 24 hours
    console.log('Presigned URL:', url);
  } catch (err) {
    console.error('Error generating presigned URL:', err);
  }
}

uploadFile('./test-image.jpeg');