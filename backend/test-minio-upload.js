const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Test the MinIO upload endpoint
async function testUpload() {
  try {
    console.log('Testing MinIO upload endpoint...\n');

    // Create form data
    const form = new FormData();
    
    // Check if test image exists
    const testImagePath = './test-image.jpeg';
    if (!fs.existsSync(testImagePath)) {
      console.error('❌ Test image not found. Please ensure test-image.jpeg exists in the backend directory.');
      return;
    }

    form.append('image', fs.createReadStream(testImagePath));

    // You'll need to replace this with a valid JWT token
    const authToken = 'YOUR_JWT_TOKEN_HERE';
    
    if (authToken === 'YOUR_JWT_TOKEN_HERE') {
      console.log('⚠️  Please replace YOUR_JWT_TOKEN_HERE with a valid JWT token');
      console.log('   You can get a token by logging in through your frontend application');
      return;
    }

    const response = await fetch('http://localhost:3000/recipes/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders()
      },
      body: form
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('\n📁 File details:');
      console.log(`   Filename: ${result.data.filename}`);
      console.log(`   Original name: ${result.data.originalName}`);
      console.log(`   Size: ${result.data.size} bytes`);
      console.log(`   MIME type: ${result.data.mimetype}`);
      console.log(`   URL: ${result.data.url}`);
    } else {
      console.log('❌ Upload failed!');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions
console.log('MinIO Upload Test Script');
console.log('========================\n');
console.log('Before running this test:');
console.log('1. Make sure your backend server is running on port 3000');
console.log('2. Make sure MinIO is running and accessible');
console.log('3. Replace YOUR_JWT_TOKEN_HERE with a valid JWT token');
console.log('4. Ensure test-image.jpeg exists in the backend directory\n');

testUpload();
