import React, { useState } from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ 
  notifications, 
  unreadCount, 
  onNotificationClick, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);
    onMarkAsRead(notification.id, notification.chatId);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="notification-panel">
      <button 
        className={`notification-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={onMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={`${notification.chatId}-${notification.id}`}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-avatar">
                    {notification.senderName ? 
                      notification.senderName.charAt(0).toUpperCase() : 
                      notification.senderId.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="notification-content">
                    <div className="notification-sender">
                      {notification.senderName || notification.senderId.split('@')[0]}
                    </div>
                    <div className="notification-message">
                      {notification.type === 'photo' ? 
                        '📷 Sent a photo' : 
                        truncateMessage(notification.message)
                      }
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  <div className="notification-indicator">
                    <span className="unread-dot"></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
