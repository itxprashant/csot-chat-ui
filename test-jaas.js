// Test script to verify JaaS backend configuration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'src', 'backend', '.env') });
const JaaSBackendService = require('./src/backend/services/jaasBackendService');

console.log('Testing JaaS Backend Configuration:');
console.log('====================================');

const jaasService = new JaaSBackendService();

console.log('🔧 JaaS Configured:', jaasService.isConfigured());
console.log('📱 App ID:', process.env.JAAS_APP_ID ? '✓ Set' : '✗ Missing');
console.log('🔑 Private Key Path:', process.env.JAAS_PRIVATE_KEY_PATH ? '✓ Set' : '✗ Missing');
console.log('🆔 Key ID:', process.env.JAAS_KEY_ID ? '✓ Set' : '✗ Missing');
console.log('🌐 Domain:', process.env.JAAS_DOMAIN ? '✓ Set' : '✗ Missing');

if (jaasService.isConfigured()) {
    try {
        const token = jaasService.generateToken(
            'test-room',
            'Test User',
            'test@example.com',
            true
        );
        console.log('🎯 Token Generation: ✓ Success');
        console.log('📝 Token preview:', token.substring(0, 50) + '...');
        
        // Decode token to verify contents (without verification)
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token, { complete: true });
        console.log('🔍 Token header:', decoded.header);
        console.log('🔍 Token payload subject:', decoded.payload.sub);
        console.log('🔍 Token payload room:', decoded.payload.room);
        console.log('🔍 Token payload user:', decoded.payload.context?.user?.name);
        console.log('🔍 Token expiry:', new Date(decoded.payload.exp * 1000).toISOString());
        
    } catch (error) {
        console.log('🎯 Token Generation: ✗ Failed');
        console.error('Error:', error.message);
    }
} else {
    console.log('⚠️  JaaS not configured - will fallback to free Jitsi Meet');
}

console.log('====================================');
