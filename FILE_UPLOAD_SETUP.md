# File Upload Setup Guide

This guide will help you set up file upload functionality using Cloudinary for your chat application.

## Prerequisites

- A Cloudinary account (free tier available)
- Basic knowledge of environment variables

## Step 1: Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. After logging in, go to your Dashboard
3. Note down the following credentials:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Create an Upload Preset

1. In your Cloudinary Dashboard, go to Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - Preset name: `chat_files`
   - Signing Mode: `Unsigned` (for frontend uploads)
   - Folder: `chat-files` (optional, for organization)
   - Resource type: `Auto`
   - Access mode: `Public`
5. Save the preset

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Cloudinary credentials:

```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
REACT_APP_CLOUDINARY_API_KEY=your-api-key-here
REACT_APP_CLOUDINARY_API_SECRET=your-api-secret-here
REACT_APP_CLOUDINARY_UPLOAD_PRESET=chat_files
```

## Step 4: Supported File Types

The application supports the following file types:

### Images
- JPEG, JPG, PNG, GIF, WebP, SVG
- Auto-optimized by Cloudinary
- Image thumbnails and previews

### Videos
- MP4, WebM, MOV, AVI
- Built-in video player
- Cloudinary video optimization

### Audio
- MP3, WAV, OGG, M4A
- Audio player controls

### Documents
- PDF (with inline preview)
- Word documents (.doc, .docx)
- Excel spreadsheets (.xls, .xlsx)
- PowerPoint presentations (.ppt, .pptx)
- Text files (.txt, .csv)

### Archives
- ZIP files
- RAR files

### File Size Limits
- Maximum file size: 10MB per file
- Multiple files can be uploaded simultaneously
- Progress indicators for all uploads

## Step 5: Features

### Drag and Drop
- Drag files directly onto the chat window
- Visual feedback during drag operations
- Multi-file upload support

### File Rendering
- Automatic file type detection
- Appropriate rendering for each file type
- Download and view options for documents
- Image zoom and fullscreen view
- Video and audio players

### Storage Management
- Files are stored on Cloudinary's CDN
- Automatic optimization and compression
- Global delivery network for fast access
- Secure file URLs

## Troubleshooting

### Upload Failures
1. Check your Cloudinary credentials in `.env`
2. Verify your upload preset is set to "Unsigned"
3. Ensure the file size is under 10MB
4. Check browser console for error messages

### File Not Displaying
1. Check if the file URL is accessible
2. Verify the file type is supported
3. Check network connectivity

### Permission Issues
1. Ensure your Cloudinary account has sufficient quota
2. Check upload preset permissions
3. Verify API key permissions

## Security Considerations

- Upload preset is set to unsigned for simplicity
- Consider implementing signed uploads for production
- Monitor your Cloudinary usage and quotas
- Consider implementing file type restrictions server-side

## Cost Optimization

- Free tier includes 25GB storage and 25GB bandwidth
- Cloudinary automatically optimizes files
- Consider implementing automatic file cleanup for old messages
- Monitor usage in Cloudinary dashboard

## Production Deployment

For production environments:

1. Use signed upload presets
2. Implement server-side validation
3. Set up webhook notifications
4. Monitor usage and costs
5. Consider implementing file retention policies

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [React Integration](https://cloudinary.com/documentation/react_integration)
