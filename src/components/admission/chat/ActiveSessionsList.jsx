import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../../ui/system_users/avatar';
import { ScrollArea } from '../../ui/system_users/scroll-area';

export function ActiveSessionsList({ 
  activeSessions, 
  selectedSessionId, 
  onSessionSelect, 
  onRefresh, 
  onGoToQueue, 
  isLoading 
}) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Hôm Nay';
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return 'Hôm Nay';
    }
  };

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Phiên hoạt động</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? '...' : '🔄'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToQueue}
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
              <p className="text-sm">Không có phiên hoạt động</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onGoToQueue}
              >Đến Hàng Đợi</Button>
            </div>
          ) : (
            activeSessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => onSessionSelect(session.session_id)}
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
                      {formatDate(session.start_time)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{session.session_type || 'Live Chat'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      Session {session.session_id}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600">Đang Hoạt Động</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}