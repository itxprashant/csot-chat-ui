// Test JaaS token with specific room format
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'src', 'backend', '.env') });
const JaaSBackendService = require('./src/backend/services/jaasBackendService');

console.log('Testing JaaS Token with Room Format:');
console.log('===================================');

const jaasService = new JaaSBackendService();

if (jaasService.isConfigured()) {
    try {
        // Test with different room name formats
        const testCases = [
            'test-room',
            'testroom123',
            'chat_room_1',
            'room-123'
        ];

        testCases.forEach(roomName => {
            console.log(`\n📍 Testing room: "${roomName}"`);
            try {
                const token = jaasService.generateToken(
                    roomName,
                    'Test User',
                    'test@example.com',
                    true
                );
                
                // Decode token to check room
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(token);
                
                console.log(`  ✅ Token generated`);
                console.log(`  🏠 Room in token: ${decoded.room}`);
                console.log(`  👤 User: ${decoded.context.user.name}`);
                console.log(`  🔑 Moderator: ${decoded.context.user.moderator}`);
                
            } catch (error) {
                console.log(`  ❌ Failed: ${error.message}`);
            }
        });
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
} else {
    console.log('❌ JaaS not configured');
}

console.log('\n===================================');
