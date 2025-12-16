import { useState } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { Intent } from '../../../utils/fastapi-client';

interface TrendingTopicsSectionProps {
  intents: Intent[];
  loading: boolean;
  error: string | null;
}

export function TrendingTopicsSection({ 
  intents, 
  loading, 
  error 
}: TrendingTopicsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#10B981]" />
              Chủ Đề Mới Đang Thịnh Hành
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải chủ đề thịnh hành...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>Lỗi: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Thử Lại
            </Button>
          </div>
        ) : !intents || intents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Không có danh mục nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {intents.slice(0, visibleCount).map((intent) => (
              <div
                key={intent.intent_id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{intent.intent_name}</h4>
                    </div>
                    {intent.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {intent.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">0 câu hỏi</span> được hỏi
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show More Button */}
            {intents && visibleCount < intents.length && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setVisibleCount(prev => Math.min(prev + 5, intents.length))}
                  className="flex items-center gap-2"
                >
                  Hiển Thị Thêm ({Math.min(5, intents.length - visibleCount)} mục khác)
                </Button>
              </div>
            )}
            
            {/* Show Less Button */}
            {visibleCount > 5 && (
              <div className="flex justify-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setVisibleCount(5)}
                  className="text-muted-foreground"
                >
                  Ẩn Bớt
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
