// Simple test script to verify upload endpoints
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000';

async function testUpload() {
  try {
    console.log('Testing upload endpoints...');
    
    // Test 1: Check if server is running
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not running');
      return;
    }
    
    // Test 2: Check upload stats
    const statsResponse = await fetch(`${API_BASE}/api/upload/stats`);
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Upload stats:', stats);
    } else {
      console.log('❌ Failed to get upload stats');
    }
    
    // Test 3: Test package images upload (if we have a test image)
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      const formData = new FormData();
      formData.append('packageImages', fs.createReadStream(testImagePath));
      
      const uploadResponse = await fetch(`${API_BASE}/api/upload/package-images`, {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('✅ Package images upload test passed:', result);
      } else {
        console.log('❌ Package images upload test failed');
      }
    } else {
      console.log('⚠️  No test image found, skipping upload test');
    }
    
    console.log('Upload system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUpload();
