import { useRef, useEffect, useState } from 'react';

export function useWebSocket(selectedSessionId, onMessageReceived) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const connectWebSocket = () => {
    if (!selectedSessionId) {
      console.error('[OFFICER WS] ❌ No session ID available for WebSocket connection');
      setIsConnected(false);
      return;
    }

    try {
      const wsUrl = `ws://localhost:8000/live_chat/livechat/chat/${selectedSessionId}`;
      console.log('[OFFICER WS] 🔌 Connecting to WebSocket:', wsUrl);
      console.log('[OFFICER WS] 🔌 Session ID:', selectedSessionId);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[OFFICER WS] ✅ WebSocket connected for session', selectedSessionId);
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('[OFFICER WS] 📨 Received message:', data);
        
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
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
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
      console.log('Sent message:', messageData);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
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