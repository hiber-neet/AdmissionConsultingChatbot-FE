import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import { liveChatAPI } from '../../../services/fastapi';
import { toast } from 'react-toastify';

// Import components
import { ActiveSessionsList } from './ActiveSessionsList';
import { ChatHeader } from './ChatHeader';
import { MessagesArea } from './MessagesArea';
import { MessageInput } from './MessageInput';
import { EmptyChat } from './EmptyChat';
import { LoadingView } from './LoadingView';
import { useWebSocket } from './useWebSocket';

export function LiveChatView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get session info from navigation state
  const { sessionId: initialSessionId, officialId, queueId } = location.state || {};
  
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);

  // Handle WebSocket messages
  const handleMessageReceived = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  // WebSocket connection
  const { isConnected, sendMessage: wsSendMessage, disconnect } = useWebSocket(selectedSessionId, handleMessageReceived);

  // Get active sessions for admission official
  const loadActiveSessions = async () => {
    if (!user?.id) return;
    
    setSessionsLoading(true);
    try {
      console.log('Loading active sessions for official:', user.id);
      
      const response = await liveChatAPI.getActiveSessions(parseInt(user.id));
      console.log('Active sessions response:', response);
      
      if (response && Array.isArray(response)) {
        setActiveSessions(response);
        console.log(`Loaded ${response.length} active sessions`);
        
        // If no specific session was passed, auto-select the first active session
        if (!initialSessionId && response.length > 0) {
          setSelectedSessionId(response[0].session_id);
        }
      } else {
        setActiveSessions([]);
        console.log('No active sessions found');
      }
    } catch (err) {
      console.error('Error loading active sessions:', err);
      setActiveSessions([]);
      
      // Only show error if it's not a 404 (which means no active sessions)
      if (err.response && err.response.status !== 404) {
        toast.error('Failed to load active sessions');
      }
    } finally {
      setSessionsLoading(false);
    }
  };

  // Load existing messages and customer info
  const loadSessionData = async () => {
    if (!selectedSessionId) return;
    
    try {
      console.log(`Loading messages for session ${selectedSessionId}`);
      const response = await liveChatAPI.getSessionMessages(selectedSessionId);
      console.log('Messages response:', response);
      
      if (response && Array.isArray(response)) {
        setMessages(response);
        console.log(`Loaded ${response.length} messages`);
        
        // Get customer info from first message if available
        const customerMessage = response.find(msg => msg.sender_id !== parseInt(user.id));
        if (customerMessage) {
          setCustomerInfo({
            id: customerMessage.sender_id,
            name: `Student ${customerMessage.sender_id}`,
            avatar: 'ST'
          });
        }
      } else {
        setMessages([]);
        console.log('No messages found for session');
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load message history');
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const success = wsSendMessage(user.id, newMessage);
    if (success) {
      setNewMessage('');
    } else {
      toast.error('Failed to send message');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // End session
  const handleEndSession = async () => {
    if (!selectedSessionId) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to end this chat session? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    try {
      await liveChatAPI.endSession(selectedSessionId, parseInt(user.id));
      
      disconnect();
      
      toast.success('Session ended successfully');
      
      // Remove ended session from active sessions
      setActiveSessions(prev => prev.filter(session => session.session_id !== selectedSessionId));
      
      // Select another session if available
      const remainingSessions = activeSessions.filter(session => session.session_id !== selectedSessionId);
      if (remainingSessions.length > 0) {
        setSelectedSessionId(remainingSessions[0].session_id);
      } else {
        setSelectedSessionId(null);
        setMessages([]);
        setCustomerInfo(null);
      }
    } catch (err) {
      console.error('Error ending session:', err);
      toast.error('Failed to end session');
    }
  };

  // Handle session selection
  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  // Go to queue
  const handleGoToQueue = () => {
    navigate('/admission/request-queue');
  };

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      if (!user?.id) {
        setError('User not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Initializing LiveChatView');
      await loadActiveSessions();
      setLoading(false);
    };

    initialize();
  }, [user]);

  // Refresh sessions when a new session is accepted
  useEffect(() => {
    if (initialSessionId && user?.id) {
      console.log('New session detected, refreshing active sessions...');
      loadActiveSessions();
    }
  }, [initialSessionId, user?.id]);

  // Effect for when selectedSessionId changes
  useEffect(() => {
    const setupSession = async () => {
      if (!selectedSessionId) {
        setMessages([]);
        setCustomerInfo(null);
        return;
      }

      console.log('[OFFICER] 🎯 Setting up session:', selectedSessionId);
      console.log('[OFFICER] 🎯 This is the session_id I will connect WebSocket to');
      await loadSessionData();
    };

    setupSession();
  }, [selectedSessionId]);

  // Listen for SSE queue updates to refresh active sessions
  useEffect(() => {
    const handleQueueUpdate = (event) => {
      console.log('📢 LiveChatView received queue update event:', event.detail);
      loadActiveSessions();
    };

    window.addEventListener('queueUpdate', handleQueueUpdate);

    return () => {
      window.removeEventListener('queueUpdate', handleQueueUpdate);
    };
  }, []);

  // Show loading or error states
  if (loading || error) {
    return (
      <LoadingView 
        isLoading={loading}
        error={error}
        onRetry={() => window.location.reload()}
        onGoToQueue={handleGoToQueue}
      />
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left Sidebar - Active Sessions */}
      <ActiveSessionsList
        activeSessions={activeSessions}
        selectedSessionId={selectedSessionId}
        onSessionSelect={handleSessionSelect}
        onRefresh={loadActiveSessions}
        onGoToQueue={handleGoToQueue}
        isLoading={sessionsLoading}
      />

      {/* Main Chat Area */}
      {selectedSessionId ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatHeader
            selectedSessionId={selectedSessionId}
            activeSessions={activeSessions}
            customerInfo={customerInfo}
            isConnected={isConnected}
            user={user}
            onEndSession={handleEndSession}
          />

          <div className="flex-1 flex flex-col min-h-0">
            <MessagesArea
              messages={messages}
              userId={user.id}
              userName={user.name}
            />

            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              isConnected={isConnected}
            />
          </div>
        </div>
      ) : (
        <EmptyChat onGoToQueue={handleGoToQueue} />
      )}
    </div>
  );
}