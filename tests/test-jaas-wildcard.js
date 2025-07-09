// Test JaaS token with wildcard room
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'src', 'backend', '.env') });
const JaaSBackendService = require('../src/backend/services/jaasBackendService');

console.log('Testing JaaS Token with Wildcard Room:');
console.log('=====================================');

const jaasService = new JaaSBackendService();

if (jaasService.isConfigured()) {
    try {
        // Temporarily modify the service to use wildcard
        const originalGenerateToken = jaasService.generateToken;
        jaasService.generateToken = function(roomName, userDisplayName, userEmail, isModerator) {
            // Override room to use wildcard
            const fs = require('fs');
            const jwt = require('jsonwebtoken');
            
            const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
            const now = Math.floor(Date.now() / 1000);
            const exp = now + (24 * 60 * 60);

            const payload = {
                iss: 'chat',
                aud: 'jitsi',
                exp: exp,
                nbf: now,
                sub: this.appId,
                room: '*', // Wildcard room
                context: {
                    user: {
                        id: userEmail || `user_${Math.random().toString(36).substr(2, 9)}`,
                        name: userDisplayName,
                        email: userEmail || '',
                        moderator: isModerator
                    },
                    features: {
                        livestreaming: isModerator,
                        recording: isModerator,
                        transcription: isModerator,
                        'outbound-call': false
                    }
                }
            };

            return jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                keyid: this.keyId,
                header: {
                    typ: 'JWT',
                    alg: 'RS256',
                    kid: this.keyId
                }
            });
        };
        
        const token = jaasService.generateToken(
            'test-room',
            'Test User',
            'test@example.com',
            true
        );
        
        console.log('✅ Wildcard token generated');
        
        // Decode to verify
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token);
        console.log('🏠 Room in token:', decoded.room);
        console.log('👤 User:', decoded.context.user.name);
        console.log('🔑 Moderator:', decoded.context.user.moderator);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
} else {
    console.log('❌ JaaS not configured');
}

console.log('=====================================');
