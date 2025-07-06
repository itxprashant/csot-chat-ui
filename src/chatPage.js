import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './components/ChatWindow';
import NotificationPanel from './components/NotificationPanel';
import { useChatList } from './hooks/useChat';
import { useNotifications } from './hooks/useNotifications';
import { testFirebaseConnection } from './firebase/testConnection';
import './ChatPage.css';

export const ChatPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const { chats, loading: chatsLoading } = useChatList(currentUser?.email);
  const { 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useNotifications(currentUser?.email);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // Load translation preference
    const translationPref = localStorage.getItem('translationEnabled');
    setTranslationEnabled(translationPref === 'true');
    
    // Test Firebase connection
    testFirebaseConnection();
    
    // Fetch all users from the backend
    fetchAllUsers();
  }, [navigate]);

  // Periodically refresh user status
  useEffect(() => {
    if (!currentUser) return;
    
    const interval = setInterval(() => {
      fetchAllUsers();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [currentUser]);

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

  const getUserStatus = (email) => {
    const user = allUsers.find(u => u.email === email);
    return user?.status || 'offline';
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    const username = currentUser.email;

    // Set user status to online
    fetch(`http://localhost:8000/api/users/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
          },
          body: JSON.stringify({ email: username, status: 'offline' }),
        });
    navigate('/');
  };

  const handleBackToUserList = () => {
    setSelectedUser(null);
  };

  const handleTranslationToggle = () => {
    const newState = !translationEnabled;
    setTranslationEnabled(newState);
    localStorage.setItem('translationEnabled', newState.toString());
  };

  const handleNotificationClick = (notification) => {
    // Find the user from the notification
    const user = allUsers.find(u => u.email === notification.senderId);
    if (user) {
      setSelectedUser(user);
    } else {
      // If user not found in allUsers, create a temporary user object
      setSelectedUser({
        email: notification.senderId,
        name: notification.senderName || notification.senderId.split('@')[0]
      });
    }
  };

  const handleMarkNotificationAsRead = (notificationId, chatId) => {
    markNotificationAsRead(notificationId, chatId);
  };

  const handleMarkAllNotificationsAsRead = () => {
    markAllNotificationsAsRead();
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
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
            <button 
              onClick={handleTranslationToggle}
              className={`translation-toggle-btn ${translationEnabled ? 'active' : ''}`}
              title={translationEnabled ? 'Disable Translation' : 'Enable Translation'}
            >
              🌐 {translationEnabled ? 'ON' : 'OFF'}
            </button>
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
                <div className={`user-status ${user.status || 'offline'}`}>
                  <span className="status-indicator"></span>
                  <span className="status-text">{user.status || 'offline'}</span>
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
                <div className="chat-status-container">
                  <div className={`user-status ${getUserStatus(chat.otherUserEmail)}`}>
                    <span className="status-indicator"></span>
                    <span className="status-text">{getUserStatus(chat.otherUserEmail)}</span>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="unread-count">{chat.unreadCount}</span>
                  )}
                </div>
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
              translationEnabled={translationEnabled}
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
