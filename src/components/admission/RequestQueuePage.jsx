import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';
import { fastAPILiveChat } from '../../services/fastapi';
import { RequestQueue } from './RequestQueue';
import { Card, CardContent } from '../ui/system_users/card';
import { toast } from 'react-toastify';

export function RequestQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingRequestId, setAcceptingRequestId] = useState(null);

  // Transform API data to match the RequestQueue component's expected format
  const transformQueueData = (apiData) => {
    return apiData.map(item => ({
      id: item.id.toString(),
      name: item.customer?.full_name || `Customer ${item.customer_id}`,
      email: item.customer?.email || 'N/A',
      phone: item.customer?.phone_number || 'N/A',
      studentType: 'domestic', // Default for now - we can enhance this later if customer profile data is needed
      topic: 'Tư vấn tuyển sinh', // Default topic since we don't have specific topic data
      message: 'Khách hàng yêu cầu tư vấn trực tiếp qua chat', // Default message since we don't have specific message content
      priority: 'normal', // Default priority - could be enhanced based on wait time or other business logic
      waitTime: Math.floor((new Date() - new Date(item.created_at)) / (1000 * 60)), // Calculate actual wait time in minutes
      requestedAt: item.created_at,
      avatar: item.customer?.full_name ? item.customer.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : `C${item.customer_id}`,
      // Remove location since it's not available in backend data
    }));
  };

  // Fetch queue data from API
  const fetchQueueData = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the user's ID as the official ID
      const response = await fastAPILiveChat.getQueueList(parseInt(user.id));
      
      // Handle both cases: direct array or response.data
      const apiData = Array.isArray(response) ? response : (response.data || []);
      
      const transformedData = transformQueueData(apiData);
      setQueueItems(transformedData);
    } catch (err) {
      console.error('Error fetching queue data:', err);
      setError('Failed to load queue data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Listen for SSE queue updates
  useEffect(() => {
    const handleQueueUpdate = (event) => {
      console.log('📢 Received queue update event:', event.detail);
      // Refresh the queue data when we receive an SSE notification
      fetchQueueData();
    };

    // Listen for custom events from the NotificationContext
    window.addEventListener('queueUpdate', handleQueueUpdate);

    return () => {
      window.removeEventListener('queueUpdate', handleQueueUpdate);
    };
  }, []);

  const handleTakeRequest = async (requestId) => {
    console.log('🔥 handleTakeRequest called with:', requestId);
    
    // Set loading state for this specific request
    setAcceptingRequestId(requestId);
    setError(null);
    
    try {
      console.log('🎯 Taking request:', requestId);
      
      if (!user?.id) {
        console.error('❌ No user ID available');
        toast.error('User not authenticated. Please login again.');
        return;
      }
      
      // Call accept API
      const queueId = parseInt(requestId);
      const officialId = parseInt(user.id);
      
      console.log('📞 Calling acceptRequest API with:', { officialId, queueId });
      
      const response = await fastAPILiveChat.acceptRequest(officialId, queueId);
      console.log('✅ Accept response:', response);
      
      // Handle different response types
      if (response && response.error) {
        // Handle specific error cases
        switch (response.error) {
          case 'max_sessions_reached':
            toast.error('🚫 Maximum sessions reached! You cannot accept more requests at this time. Please end some active sessions first.');
            break;
          case 'queue_not_found':
            toast.error('❌ Request not found. It may have been already taken by another official.');
            // Refresh the queue to show updated data
            await fetchQueueData();
            break;
          case 'official_not_found':
            toast.error('❌ Official profile not found. Please contact system administrator.');
            break;
          default:
            toast.error(`❌ Failed to accept request: ${response.error}`);
        }
        return;
      }
      
      // Success case - handle ChatSession object response
      if (response && response.chat_session_id) {
        // New response format: ChatSession object with chat_session_id
        console.log('🎉 Got chat_session_id, navigating to consultation:', response.chat_session_id);
        toast.success('✅ Request accepted successfully! Redirecting to consultation...');
        
        // Navigate to consultation page with session info
        navigate('/admission/consultation', { 
          state: { 
            sessionId: response.chat_session_id,
            officialId: officialId,
            queueId: queueId
          } 
        });
      } else if (response && response.session_id) {
        // Legacy response format: { session_id: number }
        console.log('🎉 Got session_id, navigating to consultation:', response.session_id);
        toast.success('✅ Request accepted successfully! Redirecting to consultation...');
        
        // Navigate to consultation page with session info
        navigate('/admission/consultation', { 
          state: { 
            sessionId: response.session_id,
            officialId: officialId,
            queueId: queueId
          } 
        });
      } else if (response && response.success) {
        // Some APIs return { success: true, session_id: ... }
        toast.success('✅ Request accepted successfully! Redirecting to consultation...');
        await fetchQueueData();
        navigate('/admission/consultation');
      } else {
        console.log('⚠️ Unexpected response format:', response);
        toast.warning('⚠️ Request might have been accepted, but received unexpected response. Please check your active sessions.');
        // Fallback: refresh queue and navigate
        await fetchQueueData();
        navigate('/admission/consultation');
      }
    } catch (err) {
      console.error('❌ Error accepting request:', err);
      
      // Handle different types of errors
      if (err.response && err.response.status === 500) {
        toast.error('🔧 Server error occurred. Please try again in a moment.');
      } else if (err.response && err.response.status === 401) {
        toast.error('🔐 Authentication failed. Please login again.');
      } else if (err.response && err.response.status === 403) {
        toast.error('🚫 Access denied. You don\'t have permission to accept requests.');
      } else if (err.message && err.message.includes('Network Error')) {
        toast.error('🌐 Network error. Please check your connection and try again.');
      } else {
        toast.error('❌ Failed to accept request. Please try again.');
      }
      
      setError('Failed to accept request. Please try again.');
    } finally {
      // Clear loading state
      setAcceptingRequestId(null);
    }
  };

  const handleRetry = () => {
    fetchQueueData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading queue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RequestQueue 
      requests={queueItems} 
      onTakeRequest={handleTakeRequest} 
      acceptingRequestId={acceptingRequestId}
    />
  );
}