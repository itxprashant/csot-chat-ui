import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.css';
import jaasTokenService from '../services/jaasTokenService';

const VideoCall = ({ roomName, displayName, onCallEnd, isCallActive, userEmail }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApi = useRef(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [isJaaSConfigured, setIsJaaSConfigured] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    if (isCallActive && jitsiContainerRef.current && roomName) {
      setIsInitializing(true);
      setError(null);
      initializeJitsiCall();
    }

    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
        jitsiApi.current = null;
      }
    };
  }, [isCallActive, roomName, displayName, userEmail]);

  const initializeJitsiCall = async () => {
    try {
      // Check if JaaS is configured, otherwise fallback to free Jitsi
      const useJaaS = await jaasTokenService.isConfigured();
      setIsJaaSConfigured(useJaaS);
      
      if (useJaaS) {
        await initializeJaaS();
      } else {
        console.log('JaaS not configured, falling back to free Jitsi Meet');
        initializeFreeJitsi();
      }
    } catch (error) {
      console.error('Error initializing video call:', error);
      setError('Failed to initialize video call. Please try again.');
      setIsInitializing(false);
      setIsJaaSConfigured(false);
    }
  };

  const initializeJaaS = async () => {
    try {
      console.log('🚀 Initializing JaaS with:', { roomName, displayName, userEmail });
      
      // Generate JWT token for JaaS authentication via backend
      const tokenResponse = await jaasTokenService.generateToken(
        roomName,
        displayName || 'Guest User',
        userEmail,
        true // Make user moderator
      );

      console.log('🎫 JaaS token received successfully');
      const domain = tokenResponse.domain;
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        jwt: tokenResponse.token,
        configOverwrite: {
          // JaaS specific configuration
          prejoinPageEnabled: false,
          requireDisplayName: false,
          enableLobbyChat: false,
          lobbyModeEnabled: false,
          startAudioOnly: false,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          enableInsecureRoomNameWarning: false,
          enableWelcomePage: false,
          // Disable authentication requirements
          enableUserRolesBasedOnToken: true,
          // JaaS specific settings
          disableDeepLinking: true,
          // Enhanced features available with JaaS
          fileRecordingsEnabled: true,
          liveStreamingEnabled: false,
          transcribingEnabled: false
        },
        interfaceConfigOverwrite: {
          // Custom branding for JaaS
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          DEFAULT_LANGUAGE: 'en',
          // JaaS specific interface settings
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ]
        },
        userInfo: {
          displayName: displayName || 'Guest User',
          email: userEmail
        }
      };

      console.log('🔧 JaaS options configured for domain:', domain);
      await loadJitsiScript(domain, options);
    } catch (error) {
      console.error('JaaS initialization failed:', error);
      // Fallback to free Jitsi if JaaS fails
      console.log('Falling back to free Jitsi Meet');
      initializeFreeJitsi();
    }
  };

  const initializeFreeJitsi = () => {
    // Original free Jitsi Meet configuration as fallback
    const domain = 'meet.jit.si';
    
    // Create a unique room name with timestamp and random suffix to avoid auth requirements
    const uniqueRoomName = `guest_${roomName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const options = {
      roomName: uniqueRoomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        // Disable pre-join page completely
        prejoinPageEnabled: false,
        
        // Disable authentication requirements
        requireDisplayName: false,
        
        // Disable lobby/waiting room
        enableLobbyChat: false,
        lobbyModeEnabled: false,
        
        // Basic audio/video settings
        startAudioOnly: false,
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        
        // Disable security warnings
        enableInsecureRoomNameWarning: false,
        enableWelcomePage: false
      },
      interfaceConfigOverwrite: {
        // Minimal interface overrides
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_LANGUAGE: 'en'
      },
      userInfo: {
        displayName: displayName || 'Guest User'
      }
    };

    loadJitsiScript(domain, options);
  };

  const loadJitsiScript = (domain, options) => {
    // Load Jitsi Meet API script
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = `https://${domain}/external_api.js`;
      script.async = true;
      script.onload = () => initializeJitsi(domain, options);
      script.onerror = () => {
        setError('Failed to load Jitsi Meet. Please check your internet connection.');
        setIsInitializing(false);
      };
      document.head.appendChild(script);
    } else {
      initializeJitsi(domain, options);
    }
  };






  const initializeJitsi = (domain, options) => {
    try {
      console.log('Initializing Jitsi with domain:', domain);
      console.log('Room name:', options.roomName);
      console.log('Using JaaS:', !!options.jwt);
      
      jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);
      setIsInitializing(false);

      // Event listeners
      jitsiApi.current.addEventListener('videoConferenceJoined', (event) => {
        console.log('Video conference joined successfully:', event);
        setError(null);
        // Ensure display name is set
        if (displayName) {
          jitsiApi.current.executeCommand('displayName', displayName);
        }
      });

      jitsiApi.current.addEventListener('videoConferenceLeft', (event) => {
        console.log('Video conference left:', event);
        onCallEnd();
      });

      jitsiApi.current.addEventListener('participantJoined', (event) => {
        console.log('Participant joined:', event);
      });

      jitsiApi.current.addEventListener('participantLeft', (event) => {
        console.log('Participant left:', event);
      });

      // Handle errors
      jitsiApi.current.addEventListener('errorOccurred', (event) => {
        console.error('Jitsi error:', event);
        setError('An error occurred during the video call. Please try refreshing.');
      });

      // Handle conference failures
      jitsiApi.current.addEventListener('conferenceFailedEvent', (event) => {
        console.log('Conference failed:', event);
        setError('Failed to join the conference. Please try again.');
      });

      // Handle ready to close
      jitsiApi.current.addEventListener('readyToClose', () => {
        console.log('Ready to close');
        onCallEnd();
      });

    } catch (error) {
      console.error('Error initializing Jitsi:', error);
      setError('Failed to initialize video call. Please try again.');
      setIsInitializing(false);
    }
  };

  if (!isCallActive) {
    return null;
  }

  return (
    <div className="video-call-container">
      <div className="video-call-header">
        <div className="video-call-info">
          <h3>Video Call - {roomName}</h3>
          {isJaaSConfigured === true && (
            <span className="jaas-badge">JaaS Powered</span>
          )}
          {isJaaSConfigured === false && (
            <span className="free-jitsi-badge">Free Jitsi</span>
          )}
        </div>
        <button className="end-call-btn" onClick={onCallEnd}>
          End Call
        </button>
      </div>
      
      {error && (
        <div className="video-call-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      )}
      
      {isInitializing && (
        <div className="video-call-loading">
          <div className="loading-spinner"></div>
          <p>Initializing video call...</p>
        </div>
      )}
      
      <div 
        ref={jitsiContainerRef} 
        className="jitsi-container"
        style={{ display: isInitializing ? 'none' : 'block' }}
      />
    </div>
  );
};

export default VideoCall;