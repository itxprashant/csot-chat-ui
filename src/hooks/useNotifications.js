import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Custom hook for notifications
export const useNotifications = (currentUserEmail) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUserEmail) return;

    console.log('Setting up notifications for:', currentUserEmail);
    
    // Simple polling approach to avoid complex indexing issues
    const fetchNotifications = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const chatsQuery = query(
          chatsRef,
          where('participants', 'array-contains', currentUserEmail)
        );

        const chatSnapshot = await getDocs(chatsQuery);
        const allNotifications = [];
        
        // For each chat, check for unread messages
        for (const chatDoc of chatSnapshot.docs) {
          const chatData = chatDoc.data();
          const chatId = chatDoc.id;
          
          // Get all messages for this chat (we'll filter client-side to avoid complex indexing)
          const messagesRef = collection(db, 'chats', chatId, 'messages');
          const messagesQuery = query(
            messagesRef,
            orderBy('timestamp', 'desc')
          );

          const messagesSnapshot = await getDocs(messagesQuery);
          
          messagesSnapshot.forEach((messageDoc) => {
            const messageData = messageDoc.data();
            
            // Only include messages where current user is receiver and status is not 'read'
            if (messageData.receiverId === currentUserEmail && messageData.status !== 'read') {
              const otherParticipant = chatData.participants.find(p => p !== currentUserEmail);
              
              allNotifications.push({
                id: messageDoc.id,
                chatId: chatId,
                senderId: messageData.senderId,
                senderName: messageData.senderName,
                message: messageData.message,
                timestamp: messageData.timestamp,
                type: messageData.type || 'text',
                otherParticipant: otherParticipant
              });
            }
          });
        }

        // Sort notifications by timestamp (newest first)
        allNotifications.sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.toDate() - a.timestamp.toDate();
        });

        setNotifications(allNotifications);
        setUnreadCount(allNotifications.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchNotifications();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentUserEmail]);

  // Mark a specific notification as read
  const markNotificationAsRead = useCallback(async (notificationId, chatId) => {
    try {
      const messageRef = doc(db, 'chats', chatId, 'messages', notificationId);
      await updateDoc(messageRef, {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      
      notifications.forEach((notification) => {
        const messageRef = doc(db, 'chats', notification.chatId, 'messages', notification.id);
        batch.update(messageRef, { status: 'read' });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };
};
