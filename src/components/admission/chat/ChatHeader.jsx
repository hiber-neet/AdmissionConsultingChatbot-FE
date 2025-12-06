import React from 'react';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../../ui/system_users/avatar';

export function ChatHeader({ 
  selectedSessionId, 
  activeSessions, 
  customerInfo, 
  isConnected, 
  user, 
  onEndSession 
}) {
  const currentSession = activeSessions.find(s => s.session_id === selectedSessionId);
  
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback>
            {customerInfo?.avatar || currentSession?.customer_name?.slice(0, 2)?.toUpperCase() || 'ST'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">
            {customerInfo?.name || currentSession?.customer_name || 'Student'}
          </h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <Badge variant="outline">Session {selectedSessionId}</Badge>
            <span className="text-sm text-gray-500">
              {currentSession?.session_type || 'Live Chat'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onEndSession}
        >
          End Session
        </Button>
      </div>
    </div>
  );
}