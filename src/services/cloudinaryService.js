// Cloudinary service for frontend file uploads
// Uses Cloudinary's unsigned upload for frontend applications

class CloudinaryService {
  // Upload file to Cloudinary using the frontend upload API
  static async uploadFile(file, options = {}) {
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'chat_files');
      
      // Determine resource type based on file type
      let resourceType = 'auto';
      if (file.type.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.type.startsWith('video/')) {
        resourceType = 'video';
      } else {
        resourceType = 'raw';
      }
      
      formData.append('resource_type', resourceType);
      
      // Add folder for organization
      formData.append('folder', 'chat-files');
      
      // Upload to Cloudinary
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured. Please set REACT_APP_CLOUDINARY_CLOUD_NAME in your .env file.');
      }
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        originalFilename: result.original_filename || file.name
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  // Delete file from Cloudinary (requires backend endpoint)
  static async deleteFile(publicId, resourceType = 'image') {
    try {
      // Note: This would need to be implemented on the backend
      // as deletion requires API credentials which shouldn't be exposed in frontend
      console.warn('File deletion should be implemented on the backend for security reasons');
      return { success: false, message: 'Deletion not implemented in frontend' };
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  }

  // Get file type from MIME type
  static getFileType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('text/')) return 'text';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'archive';
    return 'file';
  }

  // Format file size for display
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file type is supported
  static isSupportedFileType(file) {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const supportedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/mov', 'video/avi',
      // Audio
      'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Text
      'text/plain', 'text/csv',
      // Archives
      'application/zip', 'application/x-rar-compressed'
    ];

    return file.size <= maxFileSize && supportedTypes.includes(file.type);
  }

  // Check if Cloudinary is configured
  static isConfigured() {
    return !!(process.env.REACT_APP_CLOUDINARY_CLOUD_NAME && process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  }

  // Get configuration status
  static getConfigStatus() {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    
    return {
      isConfigured: !!(cloudName && uploadPreset),
      cloudName: cloudName ? '✓ Configured' : '✗ Missing REACT_APP_CLOUDINARY_CLOUD_NAME',
      uploadPreset: uploadPreset ? '✓ Configured' : '✗ Missing REACT_APP_CLOUDINARY_UPLOAD_PRESET'
    };
  }
}

export default CloudinaryService;
