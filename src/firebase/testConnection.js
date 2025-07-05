// Simple Firebase connection test
import { db } from './config';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to read from a collection (this will create it if it doesn't exist)
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    
    console.log('Firebase connection successful!');
    console.log('Test collection size:', snapshot.size);
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
};
