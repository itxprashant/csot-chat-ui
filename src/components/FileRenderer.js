import React, { useState } from 'react';
import CloudinaryService from '../services/cloudinaryService';
import './FileRenderer.css';

const FileRenderer = ({ fileData, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  if (!fileData) return null;

  const { url, fileName, fileType, fileSize, width, height } = fileData;

  // Render different file types
  const renderFile = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="file-renderer image-file">
            <div className="image-container">
              {!imageLoaded && <div className="loading-placeholder">Loading image...</div>}
              <img
                src={url}
                alt={fileName}
                className={`file-image ${imageLoaded ? 'loaded' : 'loading'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                onClick={() => window.open(url, '_blank')}
              />
            </div>
            <div className="file-info">
              <span className="file-name">{fileName}</span>
              <span className="file-details">
                {width && height && `${width}×${height} • `}
                {CloudinaryService.formatFileSize(fileSize)}
              </span>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="file-renderer video-file">
            <div className="video-container">
              {!videoLoaded && <div className="loading-placeholder">Loading video...</div>}
              <video
                src={url}
                controls
                className={`file-video ${videoLoaded ? 'loaded' : 'loading'}`}
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => setVideoLoaded(true)}
                preload="metadata"
              />
            </div>
            <div className="file-info">
              <span className="file-name">{fileName}</span>
              <span className="file-details">
                Video • {CloudinaryService.formatFileSize(fileSize)}
              </span>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="file-renderer audio-file">
            <div className="audio-container">
              <div className="audio-icon">🎵</div>
              <audio src={url} controls className="file-audio" />
            </div>
            <div className="file-info">
              <span className="file-name">{fileName}</span>
              <span className="file-details">
                Audio • {CloudinaryService.formatFileSize(fileSize)}
              </span>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="file-renderer document-file pdf-file">
            <div className="file-icon-container">
              <div className="file-icon pdf-icon">📄</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  PDF Document • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => window.open(url, '_blank')}
                  >
                    View
                  </button>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="file-renderer document-file">
            <div className="file-icon-container">
              <div className="file-icon doc-icon">📝</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  Document • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'spreadsheet':
        return (
          <div className="file-renderer document-file spreadsheet-file">
            <div className="file-icon-container">
              <div className="file-icon spreadsheet-icon">📊</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  Spreadsheet • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="file-renderer document-file presentation-file">
            <div className="file-icon-container">
              <div className="file-icon presentation-icon">📊</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  Presentation • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="file-renderer text-file">
            <div className="file-icon-container">
              <div className="file-icon text-icon">📃</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  Text File • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => window.open(url, '_blank')}
                  >
                    View
                  </button>
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'archive':
        return (
          <div className="file-renderer archive-file">
            <div className="file-icon-container">
              <div className="file-icon archive-icon">🗜️</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  Archive • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="file-renderer generic-file">
            <div className="file-icon-container">
              <div className="file-icon generic-icon">📎</div>
              <div className="file-content">
                <span className="file-name">{fileName}</span>
                <span className="file-details">
                  File • {CloudinaryService.formatFileSize(fileSize)}
                </span>
                <div className="file-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = fileName;
                      link.click();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`file-renderer-wrapper ${className}`}>
      {renderFile()}
    </div>
  );
};

export default FileRenderer;
