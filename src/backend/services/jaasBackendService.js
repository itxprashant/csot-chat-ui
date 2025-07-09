/**
 * JaaS Token Generation Service (Backend)
 * This should be moved to your backend server for production
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');

class JaaSBackendService {
  constructor() {
    this.appId = process.env.JAAS_APP_ID;
    this.privateKeyPath = process.env.JAAS_PRIVATE_KEY_PATH;
    this.keyId = process.env.JAAS_KEY_ID;
  }

  /**
   * Generate JWT token for JaaS authentication
   * @param {string} roomName - The room name for the meeting
   * @param {string} userDisplayName - Display name for the user
   * @param {string} userEmail - User's email (optional)
   * @param {boolean} isModerator - Whether user should be moderator
   * @returns {string} JWT token
   */
  generateToken(roomName, userDisplayName, userEmail = null, isModerator = true) {
    if (!this.appId || !this.privateKeyPath || !this.keyId) {
      throw new Error('JaaS credentials not configured. Please check your environment variables.');
    }

    try {
      // Read private key from file
      const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');

      const now = Math.floor(Date.now() / 1000);
      const exp = now + (24 * 60 * 60); // Token expires in 24 hours

      // JWT payload for JaaS - using wildcard for room access
      const payload = {
        iss: 'chat',
        aud: 'jitsi',
        exp: exp,
        nbf: now,
        sub: this.appId,
        room: '*', // Wildcard allows access to any room
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

      // Create and sign JWT with correct header
      const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        keyid: this.keyId,
        header: {
          typ: 'JWT',
          alg: 'RS256',
          kid: this.keyId
        }
      });

      return token;
    } catch (error) {
      console.error('Error generating JaaS token:', error);
      throw new Error('Failed to generate JaaS authentication token');
    }
  }

  /**
   * Check if JaaS is properly configured
   * @returns {boolean} True if all required config is present
   */
  isConfigured() {
    return !!(this.appId && this.privateKeyPath && this.keyId);
  }
}

module.exports = JaaSBackendService;
