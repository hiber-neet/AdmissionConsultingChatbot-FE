import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  User,
  Clock,
  Send,
  X,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Input } from '../../ui/system_users/input';
import { Badge } from '../../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../../ui/system_users/avatar';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/system_users/card';
import { useAuth } from '../../../contexts/Auth';
import { liveChatAPI } from '../../../services/fastapi';
import { toast } from 'react-toastify';

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
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Get active sessions for admission official
  const loadActiveSessions = async () => {
    if (!user?.id) return;
    
    setSessionsLoading(true);
    try {
      console.log('Loading active sessions for official:', user.id);
      
      // Call real API to get active sessions
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
      
      // Fallback to empty array on error, don't show error to user
      // as having no active sessions is a valid state
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

  // Initialize WebSocket connection
  const connectWebSocket = () => {
    if (!selectedSessionId) {
      console.error('No session ID available for WebSocket connection');
      setIsConnected(false);
      return;
    }

    try {
      const wsUrl = `ws://localhost:8000/live_chat/livechat/chat/${selectedSessionId}`;
      console.log('Connecting to WebSocket:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError('');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        
        if (data.event === 'message') {
          const newMessage = {
            interaction_id: Date.now(),
            session_id: selectedSessionId,
            sender_id: data.sender_id,
            message_text: data.message,
            timestamp: data.timestamp,
            is_from_bot: false
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setError('Connection error. Please try refreshing the page.');
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to establish connection');
    }
  };

  // Send message via WebSocket
  const sendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !isConnected) return;

    const messageData = {
      sender_id: parseInt(user.id),
      message: newMessage.trim()
    };

    try {
      wsRef.current.send(JSON.stringify(messageData));
      console.log('Sent message:', messageData);
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // End session
  const handleEndSession = async () => {
    if (!selectedSessionId) return;
    
    try {
      await liveChatAPI.endSession(selectedSessionId, parseInt(user.id));
      
      if (wsRef.current) {
        wsRef.current.close();
      }
      
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

      // First load active sessions
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
        // Close existing WebSocket if any
        if (wsRef.current) {
          wsRef.current.close();
        }
        setIsConnected(false);
        setMessages([]);
        setCustomerInfo(null);
        return;
      }

      console.log('Setting up session:', selectedSessionId);

      // Load messages for the selected session
      await loadSessionData();
      
      // Connect WebSocket
      connectWebSocket();
    };

    setupSession();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedSessionId]);

  // Listen for SSE queue updates to refresh active sessions
  useEffect(() => {
    const handleQueueUpdate = (event) => {
      console.log('📢 LiveChatView received queue update event:', event.detail);
      // Refresh active sessions when queue updates (new session might be created)
      loadActiveSessions();
    };

    // Listen for custom events from the NotificationContext
    window.addEventListener('queueUpdate', handleQueueUpdate);

    return () => {
      window.removeEventListener('queueUpdate', handleQueueUpdate);
    };
  }, []);

  if (loading || sessionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{loading ? 'Loading chat sessions...' : 'Loading active sessions...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-2">
              <Button onClick={() => navigate('/admission/request-queue')}>
                Go to Request Queue
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Active Sessions */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Active Sessions</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadActiveSessions}
                disabled={sessionsLoading}
              >
                {sessionsLoading ? '...' : '🔄'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admission/request-queue')}
              >
                Queue
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {activeSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active sessions</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate('/admission/request-queue')}
                >
                  Go to Queue
                </Button>
              </div>
            ) : (
              activeSessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => setSelectedSessionId(session.session_id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    selectedSessionId === session.session_id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {session.customer_name?.slice(0, 2)?.toUpperCase() || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{session.customer_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(() => {
                          try {
                            const date = new Date(session.start_time);
                            if (isNaN(date.getTime())) {
                              return 'Today';
                            }
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          } catch {
                            return 'Today';
                          }
                        })()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{session.session_type || 'Live Chat'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        Session {session.session_id}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedSessionId ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {customerInfo?.avatar || activeSessions.find(s => s.session_id === selectedSessionId)?.customer_name?.slice(0, 2)?.toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">
                  {customerInfo?.name || activeSessions.find(s => s.session_id === selectedSessionId)?.customer_name || 'Student'}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-500">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  <Badge variant="outline">Session {selectedSessionId}</Badge>
                  <span className="text-sm text-gray-500">
                    {activeSessions.find(s => s.session_id === selectedSessionId)?.session_type || 'Live Chat'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleEndSession}
              >
                End Session
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.interaction_id || index}
                      className={`flex ${
                        message.sender_id === parseInt(user.id) 
                          ? 'justify-end' 
                          : 'justify-start'
                      }`}
                    >
                      <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                        {message.sender_id !== parseInt(user.id) && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>ST</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`rounded-lg px-3 py-2 ${
                          message.sender_id === parseInt(user.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border'
                        }`}>
                          <p className="text-sm">{message.message_text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === parseInt(user.id)
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {message.sender_id === parseInt(user.id) && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!isConnected || !newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-1">
                  Connection lost. Please refresh the page.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a session to start chatting</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/admission/request-queue')}
            >
              Go to Request Queue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}