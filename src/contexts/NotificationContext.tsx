import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './Auth';
import { toast } from 'react-toastify';
import { API_CONFIG } from '../config/api.js';

interface NotificationContextType {
  isConnected: boolean;
  lastEvent: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Start SSE for any logged-in user with an ID (backend will filter by official_id)
    if (user?.id) {
      startSSEConnection();
    } else {
      stopSSEConnection();
    }

    return () => {
      stopSSEConnection();
    };
  }, [user]);

  const startSSEConnection = () => {
    if (!user?.id) {
      return;
    }

    try {
      const eventSource = new EventSource(
        `${API_CONFIG.FASTAPI_BASE_URL}/live_chat/livechat/sse/official/${user.id}`
      );

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle new nested event format
          if (data.event && data.data) {
            // New format: { event: "queue_updated", data: {...} }
            setLastEvent({ ...data.data, event: data.event, timestamp: new Date().toISOString() });
            handleEvent({ event: data.event, ...data.data });
          } else if (data.event) {
            // Handle simple events like ping, connected
            if (data.event === 'connected') {
              // SSE Connection confirmed by server
            }
            setLastEvent({ ...data, timestamp: new Date().toISOString() });
          } else {
            // Old format - backward compatibility
            setLastEvent({ ...data, timestamp: new Date().toISOString() });
            handleEvent(data);
          }
        } catch (error) {
          // Fallback for unparseable data
          handleEvent({ event: 'raw_message', data: event.data });
        }
      };

      // Add event listeners for specific SSE events
      eventSource.addEventListener('queue_updated', (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastEvent({ ...data, timestamp: new Date().toISOString() });
          handleEvent(data);
        } catch (error) {
          // Handle parsing error silently
        }
      });

      eventSource.addEventListener('ping', (event) => {
        // Heartbeat event - no action needed
      });

      eventSource.onerror = (error) => {
        setIsConnected(false);
        
        // Only attempt to reconnect if the connection was closed
        if (eventSource.readyState === EventSource.CLOSED) {
          setTimeout(() => {
            if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
              startSSEConnection();
            }
          }, 5000);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      // Failed to establish SSE connection
    }
  };

  const stopSSEConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  const handleEvent = (data: any) => {
    if (data.event === 'queue_updated') {
      // Show notification toast
      toast.info('🔔 New consultation request received', {
        position: "top-right",
        autoClose: 4000,
      });
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('queueUpdate', { detail: data }));
    }
  };

  const value: NotificationContextType = {
    isConnected,
    lastEvent,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};