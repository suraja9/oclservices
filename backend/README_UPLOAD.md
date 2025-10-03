# Screenshot Upload System

This document describes the new screenshot upload system implemented for the OCL booking application.

## Features

- **Local File Storage**: Screenshots are stored locally in the `uploads/screenshots/` directory
- **Database Integration**: File paths are stored in the database for later retrieval
- **Image Preview**: Users can preview uploaded images before submission
- **File Validation**: Only image files are allowed with size limits
- **Multiple File Support**: Users can upload multiple package and invoice images

## Directory Structure

```
backend/
├── uploads/
│   └── screenshots/
│       ├── package-images/     # Package screenshots
│       └── invoice-images/     # Invoice screenshots
├── middleware/
│   └── upload.js              # Multer configuration
└── routes/
    └── upload.js              # Upload API endpoints
```

## API Endpoints

### Upload Package Images
- **POST** `/api/upload/package-images`
- **Body**: FormData with `packageImages` field
- **Response**: Array of uploaded file information

### Upload Invoice Images
- **POST** `/api/upload/invoice-images`
- **Body**: FormData with `invoiceImages` field
- **Response**: Array of uploaded file information

### Upload Both Types
- **POST** `/api/upload/screenshots`
- **Body**: FormData with both `packageImages` and `invoiceImages` fields
- **Response**: Object with both file arrays

### Serve Images
- **GET** `/api/upload/serve/:filename`
- **Response**: Image file

### Delete Image
- **DELETE** `/api/upload/delete/:filename`
- **Response**: Success/error message

### Upload Statistics
- **GET** `/api/upload/stats`
- **Response**: Upload statistics

## File Configuration

### Multer Settings
- **Max file size**: 10MB per file
- **Max files**: 10 files per upload
- **Allowed types**: Image files only
- **Storage**: Local disk storage with organized folders

### File Naming
Files are renamed with the pattern: `{fieldname}-{timestamp}-{random}.{extension}`

## Frontend Integration

The frontend uses the `ImageUploadWithPreview` component which provides:
- Drag and drop file selection
- Image preview functionality
- Upload progress indication
- File management (add/remove)
- Modal preview for full-size images

## Database Schema

The `FormData` model stores file paths in the `uploadData` section:
```javascript
uploadData: {
  packageImages: [String],  // Array of file paths
  invoiceImages: [String]   // Array of file paths
}
```

## Usage Example

```javascript
// Frontend usage
<ImageUploadWithPreview
  label="Package Images"
  files={uploadData.packageImages}
  onFilesChange={(files) => setUploadData(prev => ({ ...prev, packageImages: files }))}
  maxFiles={10}
  accept="image/*"
  uploadEndpoint={`${API_BASE}/api/upload/package-images`}
  fieldName="packageImages"
/>
```

## Security Considerations

- File type validation (images only)
- File size limits (10MB max)
- Organized storage structure
- No direct file access (served through API)

## Testing

Run the test script to verify the upload system:
```bash
node test-upload.js
```

## Troubleshooting

1. **Upload fails**: Check file size and type
2. **Images not displaying**: Verify server is running and file paths are correct
3. **Storage issues**: Ensure `uploads/` directory has write permissions
