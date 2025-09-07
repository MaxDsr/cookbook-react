# Image Upload Functionality

This document describes the image upload functionality implemented in the recipe controller.

## Overview

The `uploadImage` controller allows authenticated users to upload recipe images. Images are uploaded to MinIO object storage and accessible via presigned URLs.

## Features

- **File Type Validation**: Only image files (JPEG, PNG, GIF, WebP) are accepted
- **File Size Limit**: Maximum file size is 5MB
- **Unique Naming**: Files are renamed with unique timestamps and random strings to prevent conflicts
- **Authentication Required**: Users must be authenticated to upload images
- **MinIO Storage**: Images are stored in MinIO object storage with presigned URLs for access

## API Endpoint

```
POST /recipes/upload-image
```

### Headers
- `Authorization: Bearer <JWT_TOKEN>` (required)
- `Content-Type: multipart/form-data`

### Body
- `image`: The image file to upload (required)

### Response

#### Success (200 OK)
```json
{
  "message": "Image uploaded successfully",
  "status": 200,
  "data": {
    "filename": "recipe-1703123456789-a1b2c3d4.jpg",
    "originalName": "my-recipe.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "url": "http://cookbook-minio:9000/recipe-pictures/recipe-1703123456789-a1b2c3d4.jpg?X-Amz-Algorithm=..."
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "message": "User not authenticated",
  "status": 401
}
```

**400 Bad Request**
```json
{
  "message": "No image file provided",
  "status": 400
}
```

**500 Internal Server Error**
```json
{
  "message": "Failed to upload image",
  "status": 500
}
```

## File Storage

Images are stored in MinIO object storage in the `recipe-pictures` bucket. The bucket is automatically created if it doesn't exist. Files are stored with unique names to prevent conflicts.

### MinIO Configuration

The MinIO client is configured with the following settings:
- **Endpoint**: `cookbook-minio:9000`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`
- **SSL**: Disabled
- **Bucket**: `recipe-pictures`
- **Region**: `us-east-1`

## Configuration

The following environment variables are used:

- `STORAGE_PATH`: The path prefix for serving static files (defaults to 'storage')
- MinIO configuration is handled in `/src/dataSources/minio.ts`

## Usage Example

### Frontend (JavaScript)
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('/recipes/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log('Image URL:', result.data.url);
```

### cURL
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  http://localhost:3000/recipes/upload-image
```

## Security Considerations

1. **Authentication**: Only authenticated users can upload images
2. **File Type Validation**: Only image files are accepted
3. **File Size Limits**: Maximum file size is 5MB
4. **Unique Naming**: Prevents filename conflicts and path traversal attacks

## Dependencies

- `multer`: File upload middleware
- `minio`: MinIO client for object storage
- `sharp`: Image processing (available but not currently used)
- `fs`: File system operations
- `path`: Path manipulation utilities

## Future Enhancements

- Image resizing and optimization using Sharp
- Image metadata extraction
- Thumbnail generation
- Image compression
- Multiple file upload support
- Image format conversion
