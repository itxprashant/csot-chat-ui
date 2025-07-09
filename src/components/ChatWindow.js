import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import VideoCall from './VideoCall';
import TranslationComponent from './TranslationComponent';
import TranslationSettings from './TranslationSettings';
import FileRenderer from './FileRenderer';
import FileUpload from './FileUpload';
import translationService from '../services/translationService';
import CloudinaryService from '../services/cloudinaryService';
import './ChatWindow.css';

const ChatWindow = ({ currentUserEmail, targetUserEmail, currentUserName, targetUserName, translationEnabled = false }) => {
  const { messages, sendMessage, markAsRead, loading, error } = useChat(currentUserEmail, targetUserEmail);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [callRoomName, setCallRoomName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTranslationSettings, setShowTranslationSettings] = useState(false);
  const [translationSettings, setTranslationSettings] = useState({
    autoTranslate: false,
    preferredLanguage: 'en',
    showOriginalText: true,
    autoDetectLanguage: true
  });
  const [messageTranslations, setMessageTranslations] = useState({});
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load translation settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('translationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTranslationSettings(parsed);
      } catch (error) {
        console.error('Error loading translation settings:', error);
      }
    }
  }, []);

  // Auto-translate messages if enabled
  useEffect(() => {
    if (translationEnabled && translationSettings.autoTranslate && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== currentUserEmail && !messageTranslations[lastMessage.id]) {
        handleAutoTranslate(lastMessage);
      }
    }
  }, [messages, translationSettings.autoTranslate, currentUserEmail, translationEnabled]);

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages, markAsRead]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage, currentUserName);
    setNewMessage('');
  };

  const handleSendFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await CloudinaryService.uploadFile(file);
      
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

      // Send file message
      await sendMessage(JSON.stringify(fileData), currentUserName, 'file');
      setIsUploading(false);
    } catch (error) {
      console.error('Error sending file:', error);
      alert(`Failed to send file "${file.name}": ${error.message}`);
      setIsUploading(false);
    }
  };

  const handleFileUploaded = async (fileData) => {
    try {
      // Send file message
      await sendMessage(JSON.stringify(fileData), currentUserName, 'file');
    } catch (error) {
      console.error('Error sending file message:', error);
      alert('Failed to send file message');
    }
  };

  const handleUploadStart = (file) => {
    setIsUploading(true);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragOver to false if we're leaving the chat window entirely
    if (!chatWindowRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (!CloudinaryService.isSupportedFileType(file)) {
        alert(`File "${file.name}" is not supported or exceeds the 10MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Handle multiple files
    validFiles.forEach(file => {
      handleSendFile(file);
    });
  };

  const handleStartVideoCall = async () => {
    // Generate a unique room name to ensure we're creating a new room
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const roomName = `chatroom${timestamp}${randomId}`;
    
    console.log('Starting video call with room:', roomName);
    setCallRoomName(roomName);
    
    // Send a video call invitation message
    await sendMessage(`📹 Video call invitation: Join at ${roomName}`, currentUserName);
    
    // Start the video call immediately
    setIsVideoCallActive(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setCallRoomName('');
  };

  const handleJoinVideoCall = (messageText) => {
    // Extract room name from the message
    const roomMatch = messageText.match(/Join at (\w+)/);
    if (roomMatch) {
      const roomName = roomMatch[1];
      setCallRoomName(roomName);
      setIsVideoCallActive(true);
    }
  };

  const handleAutoTranslate = async (message) => {
    // Skip translation for non-text messages
    if (!message.message || 
        message.type === 'photo' || 
        message.type === 'file' ||
        message.message.includes('📹 Video call invitation:') ||
        message.message.startsWith('{') || // Skip JSON messages
        typeof message.message !== 'string' ||
        message.message.trim() === '') {
      return;
    }
    
    try {
      const result = await translationService.translateText(
        message.message,
        translationSettings.preferredLanguage,
        translationSettings.autoDetectLanguage ? 'auto' : 'en'
      );
      
      setMessageTranslations(prev => ({
        ...prev,
        [message.id]: result
      }));
    } catch (error) {
      console.error('Auto-translation failed:', error);
    }
  };

  const handleTranslationUpdate = (messageId, translationData) => {
    setMessageTranslations(prev => ({
      ...prev,
      [messageId]: translationData
    }));
  };

  const handleTranslationSettingsChange = (newSettings) => {
    setTranslationSettings(newSettings);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message) => {
    const isVideoCallInvitation = message.message.includes('📹 Video call invitation:');
    const translation = messageTranslations[message.id];
    const isTextMessage = message.type !== 'photo' && 
                          message.type !== 'file' &&
                          !isVideoCallInvitation && 
                          message.message && 
                          typeof message.message === 'string' && 
                          !message.message.startsWith('{') && 
                          message.message.trim() !== '';
    
    if (isVideoCallInvitation) {
      const isOwnMessage = message.senderId === currentUserEmail;
      
      return (
        <div className="video-call-message">
          <p>{isOwnMessage ? 'You started a video call' : `${message.senderName} started a video call`}</p>
          {!isOwnMessage && (
            <button 
              className="join-call-btn"
              onClick={() => handleJoinVideoCall(message.message)}
            >
              Join Call
            </button>
          )}
        </div>
      );
    }

    // Handle photo messages (legacy support)
    if (message.type === 'photo') {
      try {
        const photoData = JSON.parse(message.message);
        return (
          <div className="photo-message">
            <img 
              src={photoData.photoData} 
              alt={photoData.fileName}
              className="message-photo"
              onClick={() => window.open(photoData.photoData, '_blank')}
            />
            <p className="photo-filename">{photoData.fileName}</p>
          </div>
        );
      } catch (error) {
        return <p>Error loading photo</p>;
      }
    }

    // Handle file messages
    if (message.type === 'file') {
      try {
        const fileData = JSON.parse(message.message);
        return <FileRenderer fileData={fileData} />;
      } catch (error) {
        console.error('Error parsing file data:', error);
        return <p>Error loading file</p>;
      }
    }
    
    // Handle text messages with potential translation
    if (isTextMessage) {
      return (
        <div className="message-text-content">
          {/* Show auto-translation if enabled and available */}
          {translationEnabled && translationSettings.autoTranslate && translation && (
            <div className="auto-translation">
              {translationSettings.showOriginalText && (
                <div className="original-text-small">
                  <strong>Original:</strong> {message.message}
                </div>
              )}
              <div className="translated-text-main">
                {translation.translatedText}
              </div>
            </div>
          )}
          
          {/* Show original message if no auto-translation or if showing original is enabled */}
          {(!translationEnabled || !translationSettings.autoTranslate || !translation || translationSettings.showOriginalText) && (
            <p className={translationEnabled && translationSettings.autoTranslate && translation ? 'original-message-dimmed' : ''}>
              {message.message}
            </p>
          )}
        </div>
      );
    }
    
    // Fallback for any other message types
    return <p>{message.message}</p>;
  };

  if (loading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  if (error) {
    return <div className="chat-error">Error: {error}</div>;
  }

  return (
    <>
      <div 
        className={`chat-window ${isDragOver ? 'drag-over' : ''}`}
        ref={chatWindowRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="chat-header">
          <h3>Chat with {targetUserName}</h3>
          <div className="chat-header-actions">
            {translationEnabled && (
              <button 
                className="translation-settings-btn"
                onClick={() => setShowTranslationSettings(true)}
                title="Translation Settings"
              >
                🌐 Settings
              </button>
            )}
            <button 
              className="video-call-btn"
              onClick={handleStartVideoCall}
              disabled={isVideoCallActive}
            >
              📹 Video Call
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.senderId === currentUserEmail ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {renderMessage(message)}
                <span className="message-time">
                  {formatTime(message.timestamp)}
                  {message.senderId === currentUserEmail && (
                    <span className={`status ${message.status}`}>
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </span>
                
                {/* Add translation component for text messages only when translation is enabled */}
                {translationEnabled && 
                 message.type !== 'photo' && 
                 message.type !== 'file' &&
                 !message.message.includes('📹 Video call invitation:') && 
                 message.message && 
                 typeof message.message === 'string' && 
                 message.message.trim() !== '' && 
                 !message.message.startsWith('{') && // Exclude JSON messages
                 (
                  <TranslationComponent 
                    message={message}
                    onTranslationUpdate={handleTranslationUpdate}
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
          <FileUpload
            onFileUploaded={handleFileUploaded}
            onUploadStart={handleUploadStart}
            disabled={isUploading}
          />
        </form>

        {/* Drag and drop overlay */}
        {isDragOver && (
          <div className="drag-drop-overlay">
            <div className="drag-drop-content">
              <div className="drag-drop-icon">�</div>
              <p>Drop files here to send</p>
              <p className="drag-drop-details">
                Supports images, videos, audio, documents, and more
              </p>
            </div>
          </div>
        )}
      </div>

      <VideoCall
        roomName={callRoomName}
        displayName={currentUserName}
        userEmail={currentUserEmail}
        onCallEnd={handleEndVideoCall}
        isCallActive={isVideoCallActive}
      />

      <TranslationSettings
        isVisible={translationEnabled && showTranslationSettings}
        onClose={() => setShowTranslationSettings(false)}
        onSettingsChange={handleTranslationSettingsChange}
      />
    </>
  );
};

export default ChatWindow;
