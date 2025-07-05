import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import VideoCall from './VideoCall';
import './ChatWindow.css';

const ChatWindow = ({ currentUserEmail, targetUserEmail, currentUserName, targetUserName }) => {
  const { messages, sendMessage, markAsRead, loading, error } = useChat(currentUserEmail, targetUserEmail);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [callRoomName, setCallRoomName] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message) => {
    const isVideoCallInvitation = message.message.includes('📹 Video call invitation:');
    
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
      <div className="chat-window">
        <div className="chat-header">
          <h3>Chat with {targetUserName}</h3>
          <button 
            className="video-call-btn"
            onClick={handleStartVideoCall}
            disabled={isVideoCallActive}
          >
            📹 Video Call
          </button>
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
        </form>
      </div>

      <VideoCall
        roomName={callRoomName}
        displayName={currentUserName}
        onCallEnd={handleEndVideoCall}
        isCallActive={isVideoCallActive}
      />
    </>
  );
};

export default ChatWindow;
