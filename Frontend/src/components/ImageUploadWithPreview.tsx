import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Eye, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  serverPath?: string;
}

interface ImageUploadWithPreviewProps {
  label: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  uploadEndpoint: string;
  fieldName: string;
}

const ImageUploadWithPreview: React.FC<ImageUploadWithPreviewProps> = ({
  label,
  files,
  onFilesChange,
  maxFiles = 10,
  accept = "image/*",
  className = "",
  uploadEndpoint,
  fieldName
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      
      // Check if we've reached max files
      if (files.length + newFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed.`);
        break;
      }

      const id = Date.now() + Math.random().toString(36);
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        id,
        file,
        preview,
        uploaded: false
      });
    }

    if (newFiles.length > 0) {
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      // Revoke object URL to free memory
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    // Add files to FormData
    files.forEach(fileObj => {
      if (!fileObj.uploaded) {
        formData.append(fieldName, fileObj.file);
      }
    });

    try {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update files with server paths
        const updatedFiles = files.map(fileObj => {
          if (!fileObj.uploaded) {
            const uploadedFile = result.files?.find((f: any) => f.originalName === fileObj.file.name);
            if (uploadedFile) {
              return {
                ...fileObj,
                uploaded: true,
                serverPath: uploadedFile.filename
              };
            }
          }
          return fileObj;
        });
        
        onFilesChange(updatedFiles);
        console.log('Files uploaded successfully:', result);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const openPreview = (previewUrl: string) => {
    setPreviewImage(previewUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const getImageUrl = (fileObj: UploadedFile) => {
    if (fileObj.uploaded && fileObj.serverPath) {
      return `http://localhost:5000/api/upload/serve/${fileObj.serverPath}`;
    }
    return fileObj.preview;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center min-h-[120px]"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {isUploading ? 'Uploading...' : 'Click to upload images'}
          </p>
          <p className="text-xs text-gray-500">
            Multiple images supported, max 10MB each
          </p>
        </div>
      </div>

      {/* Upload Button */}
      {files.length > 0 && files.some(f => !f.uploaded) && (
        <button
          onClick={uploadFiles}
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : `Upload ${files.filter(f => !f.uploaded).length} Image(s)`}
        </button>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Uploaded Images ({files.length})
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={getImageUrl(fileObj)}
                      alt={fileObj.file.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openPreview(getImageUrl(fileObj))}
                    />
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">
                      {fileObj.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileObj.file.size / 1024).toFixed(1)} KB
                      {fileObj.uploaded && (
                        <span className="ml-2 text-green-600 font-medium">✓ Uploaded</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openPreview(getImageUrl(fileObj))}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-100 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithPreview;
