// Test backend API endpoint
const fetch = require('node-fetch');

async function testJaaSAPI() {
    console.log('Testing JaaS Backend API:');
    console.log('========================');
    
    try {
        const response = await fetch('http://localhost:8000/api/jaas/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName: 'test-api-room',
                displayName: 'API Test User',
                userEmail: 'test@example.com',
                isModerator: true
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', data);
            
            if (data.useJaaS && data.token) {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.decode(data.token);
                console.log('🔍 Token payload:', {
                    room: decoded.room,
                    user: decoded.context.user.name,
                    moderator: decoded.context.user.moderator,
                    exp: new Date(decoded.exp * 1000).toISOString()
                });
            }
        } else {
            console.log('❌ API Error:', response.status, response.statusText);
        }
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        console.log('💡 Make sure the backend server is running on port 8000');
    }
    
    console.log('========================');
}

testJaaSAPI();
