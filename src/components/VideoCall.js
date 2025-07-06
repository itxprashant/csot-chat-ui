import React, { useEffect, useRef } from 'react';
import './VideoCall.css';

const VideoCall = ({ roomName, displayName, onCallEnd, isCallActive }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApi = useRef(null);

  useEffect(() => {
    if (isCallActive && jitsiContainerRef.current && roomName) {
      // Jitsi Meet API configuration - try meet.jit.si first, with fallback options
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
      console.log('Initializing Jitsi with domain:', domain);
      console.log('Room name:', options.roomName);
      console.log('Full options:', options);
      
      jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      jitsiApi.current.addEventListener('videoConferenceJoined', (event) => {
        console.log('Video conference joined successfully:', event);
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
          // Try to force join
          jitsiApi.current.executeCommand('toggleLobby', false);
        }
      });

      // Handle authentication events more aggressively
      jitsiApi.current.addEventListener('authenticationStatusChanged', (event) => {
        console.log('Authentication status changed:', event);
        // Force continue as guest regardless of auth status
        jitsiApi.current.executeCommand('displayName', displayName || 'Guest User');
      });

      // Add conference failed event handler
      jitsiApi.current.addEventListener('conferenceFailedEvent', (event) => {
        console.log('Conference failed:', event);
        if (event.error === 'conference.authenticationRequired') {
          console.log('Conference failed due to auth - attempting guest access');
          // Try to rejoin or bypass
          jitsiApi.current.executeCommand('displayName', displayName || 'Guest User');
        }
      });

      // Handle ready to close with potential auth bypass
      jitsiApi.current.addEventListener('readyToClose', () => {
        console.log('Ready to close');
        onCallEnd();
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