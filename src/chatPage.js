import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import { useChatList } from './hooks/useChat';
import { testFirebaseConnection } from './firebase/testConnection';
import './ChatPage.css';

export const ChatPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const { chats, loading: chatsLoading } = useChatList(currentUser?.email);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // Test Firebase connection
    testFirebaseConnection();
    
    // Fetch all users from the backend
    fetchAllUsers();
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const users = await response.json();
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Chat App</h2>
          <div className="user-info">
            <span>Welcome, {currentUser.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        
        <div className="user-list">
          <h3>Users</h3>
          {allUsers
            .filter(user => user.email !== currentUser.email)
            .map(user => (
              <div 
                key={user.id || user.email}
                className={`user-item ${selectedUser?.email === user.email ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name || user.email.split('@')[0]}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
            ))}
        </div>

        {chats.length > 0 && (
          <div className="recent-chats">
            <h3>Recent Chats</h3>
            {chats.map(chat => (
              <div 
                key={chat.id}
                className={`chat-item ${selectedUser?.email === chat.otherUserEmail ? 'selected' : ''}`}
                onClick={() => handleUserSelect({
                  email: chat.otherUserEmail,
                  name: chat.otherUserName
                })}
              >
                <div className="chat-avatar">
                  {chat.otherUserName ? chat.otherUserName.charAt(0).toUpperCase() : chat.otherUserEmail.charAt(0).toUpperCase()}
                </div>
                <div className="chat-details">
                  <span className="chat-name">{chat.otherUserName || chat.otherUserEmail.split('@')[0]}</span>
                  <span className="chat-last-message">{chat.lastMessage}</span>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="unread-count">{chat.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <div className="chat-container">
            <button onClick={handleBackToUserList} className="back-btn">← Back to Users</button>
            <ChatWindow
              currentUserEmail={currentUser.email}
              targetUserEmail={selectedUser.email}
              currentUserName={currentUser.name}
              targetUserName={selectedUser.name || selectedUser.email.split('@')[0]}
            />
          </div>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a user to start chatting</h3>
            <p>Choose a user from the list to begin a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};
