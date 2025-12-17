import { useRef, useEffect, useState } from 'react';
import { API_CONFIG } from '../../../config/api.js';

export function useWebSocket(selectedSessionId, onMessageReceived) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const connectWebSocket = () => {
    if (!selectedSessionId) {
      setIsConnected(false);
      return;
    }

    try {
      // Convert http/https URL to ws/wss
      const wsBaseUrl = API_CONFIG.FASTAPI_BASE_URL.replace(/^http/, 'ws');
      const wsUrl = `${wsBaseUrl}/live_chat/livechat/chat/${selectedSessionId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.event === 'message') {
          const newMessage = {
            interaction_id: Date.now(),
            session_id: selectedSessionId,
            sender_id: data.sender_id,
            message_text: data.message,
            timestamp: data.timestamp,
            is_from_bot: false
          };
          
          onMessageReceived(newMessage);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        setIsConnected(false);
      };
    } catch (err) {
      setIsConnected(false);
    }
  };

  const sendMessage = (userId, message) => {
    if (!message.trim() || !wsRef.current || !isConnected) return false;

    const messageData = {
      sender_id: parseInt(userId),
      message: message.trim()
    };

    try {
      wsRef.current.send(JSON.stringify(messageData));
      return true;
    } catch (err) {
      return false;
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  useEffect(() => {
    if (selectedSessionId) {
      connectWebSocket();
    } else {
      disconnect();
      setIsConnected(false);
    }

    return () => {
      disconnect();
    };
  }, [selectedSessionId]);

  return {
    isConnected,
    sendMessage,
    disconnect
  };
}