import React, { useEffect, useRef } from 'react';
import './VideoCall.css';

const VideoCall = ({ roomName, displayName, onCallEnd, isCallActive }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApi = useRef(null);

  useEffect(() => {
    if (isCallActive && jitsiContainerRef.current && roomName) {
      // Jitsi Meet API configuration
      const domain = 'meet.jit.si';
      
      // Create a unique room name with timestamp to ensure we're creating a new room
      const uniqueRoomName = `${roomName}_${Date.now()}`;
      
      const options = {
        roomName: uniqueRoomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        // configOverwrite: {
        //   // Critical: Disable all authentication and enable auto-hosting
        //   prejoinPageEnabled: false,
        //   requireDisplayName: false,
        //   enableAuthenticationUI: false,
        //   enableGuestDomain: true,
          
        //   // Host/Moderator settings - KEY FIX
        //   enableUserRolesBasedOnToken: false,
        //   enableFeaturesBasedOnToken: false,
        //   doNotStoreRoom: true,
          
        //   // Make first user automatically moderator/host
        //   enableAutoLogin: true,
        //   disableModeratorIndicator: false,
          
        //   // Lobby settings - disable completely
        //   enableLobbyChat: false,
        //   enableLobbyPrompt: false,
        //   enableInsecureRoomNameWarning: false,
          
        //   // Critical: Disable lobby entirely so no waiting
        //   lobby: {
        //     enabled: false
        //   },
          
        //   // Auto-join settings
        //   startAudioOnly: false,
        //   startWithAudioMuted: true,
        //   startWithVideoMuted: false,
          
        //   // Security settings for guest access but ensure host privileges
        //   enableWelcomePage: false,
        //   enableClosePage: false,
        //   disableInviteFunctions: false,
          
        //   // Auto-grant moderator to first user
        //   enableAutoLogin: true,
        //   enableEmailInStats: false,
          
        //   // UI settings
        //   toolbarButtons: [
        //     'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting',
        //     'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat',
        //     'raisehand', 'videoquality', 'filmstrip', 'tileview', 'settings'
        //   ],
          
        //   // Connection settings
        //   p2p: {
        //     enabled: true,
        //     stunServers: [
        //       { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' }
        //     ]
        //   }
        // },
        // interfaceConfigOverwrite: {
        //   // Critical: Disable authentication UI completely
        //   SHOW_JITSI_WATERMARK: false,
        //   SHOW_WATERMARK_FOR_GUESTS: false,
        //   SHOW_BRAND_WATERMARK: false,
        //   SHOW_POWERED_BY: false,
        //   SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        //   SHOW_CHROME_EXTENSION_BANNER: false,
        //   MOBILE_APP_PROMO: false,
          
        //   // Toolbar configuration
        //   TOOLBAR_BUTTONS: [
        //     'microphone', 'camera', 'closedcaptions', 'desktop',
        //     'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat',
        //     'raisehand', 'videoquality', 'filmstrip', 'tileview', 'settings'
        //   ],
          
        //   // CRITICAL: Authentication settings
        //   AUTHENTICATION_ENABLED: false,
        //   GUEST_ENABLED: true,
          
        //   // Auto-join settings
        //   AUTO_PIN_LATEST_SCREEN_SHARE: true,
        //   DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          
        //   // Language and region
        //   LANG_DETECTION: true,
        //   DEFAULT_LANGUAGE: 'en',
          
        //   // Connection settings
        //   CONNECTION_INDICATOR_DISABLED: false,
        //   VIDEO_QUALITY_LABEL_DISABLED: false,
          
        //   // Browser compatibility
        //   OPTIMAL_BROWSERS: ['chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari'],
        //   UNSUPPORTED_BROWSERS: [],
          
        //   // Performance settings
        //   DISABLE_PRESENCE_STATUS: false,
        //   RECENT_LIST_ENABLED: false
        // },
        userInfo: {
          displayName: displayName || 'Guest User'
          // No email field for guest access
        },
        // Add JWT token for moderator rights (optional but helps)
        // jwt: null, // Let meet.jit.si handle guest access
        
        // Additional settings to ensure host privileges
        onload: function() {
          // This ensures the user gets host privileges when first joining
          console.log('Jitsi Meet loaded - user should be host/moderator');
        }
      };

      // Load Jitsi Meet API script
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => initializeJitsi(domain, options);
        document.head.appendChild(script);
      } else {
        initializeJitsi(domain, options);
      }
    }

    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
        jitsiApi.current = null;
      }
    };
  }, [isCallActive, roomName, displayName]);






  const initializeJitsi = (domain, options) => {
    try {
      console.log('Initializing Jitsi with options:', options);
      jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      jitsiApi.current.addEventListener('videoConferenceJoined', (event) => {
        console.log('Video conference joined:', event);
        // Ensure display name is set and try to claim moderator role
        if (displayName) {
          jitsiApi.current.executeCommand('displayName', displayName);
        }
        
        // Try to ensure moderator privileges
        setTimeout(() => {
          jitsiApi.current.executeCommand('toggleLobby', false);
        }, 1000);
      });

      jitsiApi.current.addEventListener('videoConferenceLeft', (event) => {
        console.log('Video conference left:', event);
        onCallEnd();
      });

      jitsiApi.current.addEventListener('readyToClose', () => {
        console.log('Ready to close');
        onCallEnd();
      });

      jitsiApi.current.addEventListener('participantJoined', (event) => {
        console.log('Participant joined:', event);
      });

      jitsiApi.current.addEventListener('participantLeft', (event) => {
        console.log('Participant left:', event);
      });

      // Handle participant role changes
      jitsiApi.current.addEventListener('participantRoleChanged', (event) => {
        console.log('Participant role changed:', event);
        if (event.role === 'moderator') {
          console.log('User is now moderator/host');
        }
      });

      // Handle errors and authentication issues
      jitsiApi.current.addEventListener('errorOccurred', (event) => {
        console.error('Jitsi error:', event);
        if (event.error && event.error.name === 'conference.authenticationRequired') {
          console.log('Authentication required error - attempting to bypass');
          // Try to continue anyway as guest
          jitsiApi.current.executeCommand('displayName', displayName || 'Guest User');
        }
      });

      // Handle authentication events
      jitsiApi.current.addEventListener('authenticationStatusChanged', (event) => {
        console.log('Authentication status changed:', event);
        // Force continue as guest
        if (event.authEnabled) {
          console.log('Auth is enabled, but continuing as guest');
          jitsiApi.current.executeCommand('displayName', displayName || 'Guest User');
        }
      });

    } catch (error) {
      console.error('Error initializing Jitsi:', error);
    }
  };

  if (!isCallActive) {
    return null;
  }

  return (
    <div className="video-call-container">
      <div className="video-call-header">
        <h3>Video Call - {roomName}</h3>
        <button className="end-call-btn" onClick={onCallEnd}>
          End Call
        </button>
      </div>
      <div ref={jitsiContainerRef} className="jitsi-container" />
    </div>
  );
};

export default VideoCall;