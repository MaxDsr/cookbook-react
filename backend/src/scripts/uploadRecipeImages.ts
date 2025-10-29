import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import * as Minio from 'minio'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create MinIO client for docker-compose setup
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 3003,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
})

interface ImageMapping {
  bucketFileName: string; // recipe-{{uuidv4}}.{{fileExtension}}
  recipeImage: string; // "burger" | "lasagna" etc.
  etag: string; // etag from minio bucket
}

const BUCKET_NAME = 'recipe-pictures'
const IMAGES_DIR = path.join(__dirname, '../../recipe-images')
const OUTPUT_FILE = path.join(__dirname, './image-mappings.json')

async function ensureBucketExists(): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'eu-west-1')
      console.log(`✅ Created bucket: ${BUCKET_NAME}`)
    } else {
      console.log(`✅ Bucket already exists: ${BUCKET_NAME}`)
    }
  } catch (error) {
    console.error('❌ Error ensuring bucket exists:', error)
    throw error
  }
}

function extractRecipeName(filename: string): string {
  // Remove file extension and extract recipe name
  const nameWithoutExt = path.parse(filename).name
  
  // Handle cases like "baker-soup" -> "baker-soup", "home-burger" -> "home-burger"
  // Or if we want just the main part: "bolognese-pasta" -> "bolognese"
  return nameWithoutExt
}

function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase()
}

async function uploadImage(imagePath: string, originalFilename: string, isDefault: boolean = false): Promise<ImageMapping> {
  try {
    const fileExtension = getFileExtension(originalFilename)
    const recipeImage = extractRecipeName(originalFilename)
    const bucketFileName = isDefault ? `recipe-default.jpg` : `recipe-${uuidv4()}${fileExtension}`

		console.log('imagePath', imagePath);
    
    console.log(`📤 Uploading ${originalFilename} as ${bucketFileName}...`)
    
    // Upload file to MinIO
    const result = await minioClient.fPutObject(BUCKET_NAME, bucketFileName, imagePath)
    
    console.log(`✅ Successfully uploaded ${bucketFileName} (etag: ${result.etag})`)
    
    return {
      bucketFileName,
      recipeImage,
      etag: result.etag
    }
  } catch (error) {
    console.error(`❌ Error uploading ${originalFilename}:`, error)
    throw error
  }
}

async function uploadRecipeImages(): Promise<void> {
  try {
    console.log('🚀 Starting recipe images upload...')
    
    // Test MinIO connection
    try {
      await minioClient.listBuckets()
      console.log('✅ MinIO connection successful')
    } catch (error) {
      console.error('❌ MinIO connection failed:', error)
      throw error
    }
    
    // Ensure bucket exists
    await ensureBucketExists()
    
    // Read images directory
    const files = fs.readdirSync(IMAGES_DIR)
    const imageFiles = files.filter(file => {
      const ext = getFileExtension(file)
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
    })
    
    console.log(`📁 Found ${imageFiles.length} image files:`, imageFiles)
    
    if (imageFiles.length === 0) {
      console.log('⚠️  No image files found in recipe-images directory')
      return
    }
    
    // Upload each image
    const mappings: ImageMapping[] = []
    
    for (const filename of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, filename)
      const mapping = await uploadImage(imagePath, filename)
      mappings.push(mapping)
    }

		const defaultImagePath = path.join(IMAGES_DIR, 'default', 'recipe-default.jpg');
		const defaultImage = await uploadImage(defaultImagePath, 'recipe-default.jpg', true);
		mappings.push(defaultImage)

		const imageDataByRecipeName = mappings.reduce((acc, mapping) => {
			acc[mapping.recipeImage] = mapping;
			return acc;
		}, {} as Record<string, ImageMapping>);
    
    // Write mappings to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageDataByRecipeName, null, 2))
    console.log(`📄 Image mappings saved to: ${OUTPUT_FILE}`)
    
    // Display summary
    console.log('\n📊 Upload Summary:')
    mappings.forEach((mapping, index) => {
      console.log(`${index + 1}. ${mapping.recipeImage} → ${mapping.bucketFileName} (${mapping.etag})`)
    })
    
    console.log(`\n🎉 Successfully uploaded ${mappings.length} images to MinIO bucket: ${BUCKET_NAME}`)
    
  } catch (error) {
    console.error('❌ Error uploading recipe images:', error)
    process.exit(1)
  }
}

// Run the upload function
uploadRecipeImages()
