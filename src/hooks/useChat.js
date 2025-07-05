import { useState, useEffect, useCallback } from 'react';
import ChatService from '../firebase/chatService';

// Custom hook for real-time chat functionality
export const useChat = (currentUserEmail, targetUserEmail) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize chat
  useEffect(() => {
    if (currentUserEmail && targetUserEmail) {
      const initializeChat = async () => {
        try {
          console.log('Initializing chat between:', currentUserEmail, 'and', targetUserEmail);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Chat initialization timeout')), 10000);
          });
          
          const chatPromise = ChatService.getOrCreateChat(currentUserEmail, targetUserEmail);
          
          const id = await Promise.race([chatPromise, timeoutPromise]);
          console.log('Chat initialized with ID:', id);
          setChatId(id);
        } catch (err) {
          console.error('Failed to initialize chat:', err);
          setError(`Failed to initialize chat: ${err.message}`);
          setLoading(false);
        }
      };
      
      initializeChat();
    }
  }, [currentUserEmail, targetUserEmail]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatId) return;

    console.log('Subscribing to messages for chat:', chatId);
    setLoading(true);
    
    // Add timeout for subscription
    const subscriptionTimeout = setTimeout(() => {
      console.error('Message subscription timeout');
      setError('Failed to load messages - connection timeout');
      setLoading(false);
    }, 8000);
    
    const unsubscribe = ChatService.subscribeToMessages(chatId, (newMessages) => {
      console.log('Received messages:', newMessages);
      clearTimeout(subscriptionTimeout);
      setMessages(newMessages);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription on unmount
    return () => {
      clearTimeout(subscriptionTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, [chatId]);

  // Send message function
  const sendMessage = useCallback(async (messageText, senderName, messageType = 'text') => {
    if (!chatId || !messageText.trim()) return;

    try {
      await ChatService.sendMessage(
        chatId,
        currentUserEmail,
        targetUserEmail,
        messageText.trim(),
        senderName,
        messageType
      );
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  }, [chatId, currentUserEmail, targetUserEmail]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!chatId) return;
    
    try {
      await ChatService.markMessagesAsRead(chatId, currentUserEmail);
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [chatId, currentUserEmail]);

  return {
    messages,
    sendMessage,
    markAsRead,
    loading,
    error,
    chatId
  };
};

// Custom hook for user's chat list
export const useChatList = (userEmail) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const unsubscribe = ChatService.subscribeToUserChats(userEmail, (userChats) => {
      setChats(userChats);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userEmail]);

  return { chats, loading };
};
