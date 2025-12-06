import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../ui/system_users/button';

export function EmptyChat({ onGoToQueue }) {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a session to start chatting</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={onGoToQueue}
        >
          Go to Request Queue
        </Button>
      </div>
    </div>
  );
}