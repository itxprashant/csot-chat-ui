import React, { useState, useRef } from 'react';
import CloudinaryService from '../services/cloudinaryService';
import './FileUpload.css';

const FileUpload = ({ onFileUploaded, onUploadStart, onUploadProgress, disabled = false, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // If Cloudinary is not configured, only allow images under 2MB
      if (!CloudinaryService.isConfigured()) {
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" requires Cloudinary setup. Please configure Cloudinary or use images only.`);
          return false;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64
          alert(`Image "${file.name}" is too large. Without Cloudinary, images must be under 2MB.`);
          return false;
        }
        return true;
      }
      
      // Normal validation with Cloudinary
      if (!CloudinaryService.isSupportedFileType(file)) {
        alert(`File "${file.name}" is not supported or exceeds the 10MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Upload files one by one
    validFiles.forEach(file => uploadFile(file));
  };

  const uploadFile = async (file) => {
    if (disabled || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    if (onUploadStart) {
      onUploadStart(file);
    }

    try {
      // Check if Cloudinary is configured
      if (!CloudinaryService.isConfigured()) {
        // Fallback to base64 for images if Cloudinary is not configured
        if (file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) { // 2MB limit for base64
          const base64Data = await convertToBase64(file);
          const fileData = {
            url: base64Data,
            fileName: file.name,
            fileType: CloudinaryService.getFileType(file.type),
            fileSize: file.size,
            format: file.type.split('/')[1],
            isBase64: true
          };
          
          setUploadProgress(100);
          
          if (onFileUploaded) {
            onFileUploaded(fileData);
          }
          
          setTimeout(() => {
            setUploadProgress(0);
            setIsUploading(false);
          }, 500);
          
          return;
        } else {
          throw new Error('Cloudinary not configured. Please set up Cloudinary for file uploads or use images under 2MB.');
        }
      }

      // Simulate upload progress (since we can't track real progress with Cloudinary's simple upload)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      if (onUploadProgress) {
        onUploadProgress(uploadProgress);
      }

      const result = await CloudinaryService.uploadFile(file);
      
      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Prepare file data for message
      const fileData = {
        url: result.url,
        fileName: result.originalFilename || file.name,
        fileType: CloudinaryService.getFileType(file.type),
        fileSize: result.bytes || file.size,
        format: result.format,
        width: result.width,
        height: result.height,
        publicId: result.publicId,
        resourceType: result.resourceType
      };

      // Call the callback with file data
      if (onFileUploaded) {
        onFileUploaded(fileData);
      }

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Failed to upload "${file.name}": ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleAttachClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`file-upload-container ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar"
      />

      {/* Attach button */}
      <button
        type="button"
        className={`attach-button ${disabled ? 'disabled' : ''} ${isUploading ? 'uploading' : ''}`}
        onClick={handleAttachClick}
        disabled={disabled || isUploading}
        title="Attach files"
      >
        {isUploading ? (
          <span className="upload-progress">
            📤 {Math.round(uploadProgress)}%
          </span>
        ) : (
          '📎'
        )}
      </button>

      {/* Drag and drop overlay */}
      {isDragOver && (
        <div
          className="drag-drop-overlay"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="drag-drop-content">
            <div className="drag-drop-icon">📁</div>
            <p>Drop files here to upload</p>
            <p className="drag-drop-details">
              {CloudinaryService.isConfigured() 
                ? "Supports images, videos, audio, documents, and more (max 10MB each)"
                : "Images only (max 2MB each) - Configure Cloudinary for more file types"
              }
            </p>
          </div>
        </div>
      )}

      {/* Upload progress bar */}
      {isUploading && (
        <div className="upload-progress-bar">
          <div 
            className="upload-progress-fill"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
