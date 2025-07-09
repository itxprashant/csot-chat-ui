/**
 * JaaS (Jitsi as a Service) Token Service
 * Requests JWT tokens from backend for authentication with JaaS
 */

class JaaSTokenService {
  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    this.fallbackDomain = 'meet.jit.si';
  }

  /**
   * Generate JWT token for JaaS authentication via backend
   * @param {string} roomName - The room name for the meeting
   * @param {string} userDisplayName - Display name for the user
   * @param {string} userEmail - User's email (optional)
   * @param {boolean} isModerator - Whether user should be moderator
   * @returns {Promise<object>} Token response object
   */
  async generateToken(roomName, userDisplayName, userEmail = null, isModerator = true) {
    try {
      const response = await fetch(`${this.backendUrl}/api/jaas/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          displayName: userDisplayName,
          userEmail,
          isModerator
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.useJaaS) {
        throw new Error('JaaS not configured on backend');
      }

      return {
        token: data.token,
        domain: data.domain,
        useJaaS: true
      };
    } catch (error) {
      console.error('Error generating JaaS token:', error);
      throw new Error('Failed to generate JaaS authentication token');
    }
  }

  /**
   * Check if JaaS is available by testing the backend endpoint
   * @returns {Promise<boolean>} True if JaaS is configured
   */
  async isConfigured() {
    try {
      const response = await fetch(`${this.backendUrl}/api/jaas/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: 'test',
          displayName: 'test'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.useJaaS || false;
      }
      
      return false;
    } catch (error) {
      console.warn('Cannot reach backend for JaaS configuration check:', error);
      return false;
    }
  }

  /**
   * Get JaaS domain from environment or default
   * @returns {string} JaaS domain
   */
  getDomain() {
    return process.env.REACT_APP_JAAS_DOMAIN || 'vpaas-magic-cookie-your-app-id.8x8.vc';
  }

  /**
   * Fallback to free Jitsi Meet if JaaS is not configured
   * @returns {object} Fallback configuration
   */
  getFallbackConfig() {
    return {
      domain: this.fallbackDomain,
      useJaaS: false
    };
  }
}

export default new JaaSTokenService();
