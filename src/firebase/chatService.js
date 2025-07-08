import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Chat service for real-time messaging
export class ChatService {
  
  // Send a message
  static async sendMessage(chatId, senderId, receiverId, message, senderName, messageType = 'text') {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId,
        receiverId,
        senderName,
        message,
        timestamp: serverTimestamp(),
        status: 'sent',
        type: messageType
      });
      
      // Update last message in chat metadata
      const chatRef = doc(db, 'chats', chatId);
      let lastMessageText = message;
      
      // Set appropriate last message text based on message type
      if (messageType === 'photo') {
        lastMessageText = '📷 Photo';
      } else if (messageType === 'file') {
        try {
          const fileData = JSON.parse(message);
          const fileTypeEmoji = {
            'image': '🖼️',
            'video': '🎬',
            'audio': '🎵',
            'pdf': '📄',
            'document': '📝',
            'spreadsheet': '📊',
            'presentation': '📊',
            'text': '📃',
            'archive': '🗜️'
          };
          const emoji = fileTypeEmoji[fileData.fileType] || '📎';
          lastMessageText = `${emoji} ${fileData.fileName}`;
        } catch (error) {
          lastMessageText = '📎 File';
        }
      }
      
      await updateDoc(chatRef, {
        lastMessage: lastMessageText,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Listen to real-time messages for a specific chat
  static subscribeToMessages(chatId, callback) {
    console.log('Setting up message subscription for chat:', chatId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    // Return unsubscribe function
    return onSnapshot(q, (snapshot) => {
      console.log('Messages snapshot received, size:', snapshot.size);
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp
        });
      });
      console.log('Processed messages:', messages);
      callback(messages);
    }, (error) => {
      console.error('Error in message subscription:', error);
    });
  }

  // Get or create a chat between two users
  static async getOrCreateChat(user1Email, user2Email) {
    const chatId = [user1Email, user2Email].sort().join('_');
    console.log('Getting or creating chat with ID:', chatId);
    
    try {
      const chatRef = doc(db, 'chats', chatId);
      console.log('Chat reference created:', chatRef);
      
      // Create chat metadata if it doesn't exist
      await setDoc(chatRef, {
        participants: [user1Email, user2Email],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: null
      }, { merge: true });
      
      console.log('Chat document created/updated successfully');
      return chatId;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Listen to user's chat list
  static subscribeToUserChats(userEmail, callback) {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', userEmail),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(chats);
    });
  }

  // Mark messages as read
  static async markMessagesAsRead(chatId, userId) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef, 
        where('receiverId', '==', userId),
        where('status', '!=', 'read')
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 'read' });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
}

export default ChatService;
