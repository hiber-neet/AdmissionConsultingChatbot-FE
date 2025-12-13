import { useState } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { Progress } from '../../ui/system_users/progress';
import { TrendingTopic } from '../../../services/fastapi';

interface TrendingTopicsSectionProps {
  trendingTopics: TrendingTopic[];
  loading: boolean;
  error: string | null;
}

export function TrendingTopicsSection({ 
  trendingTopics, 
  loading, 
  error 
}: TrendingTopicsSectionProps) {
  const [topicsVisibleCount, setTopicsVisibleCount] = useState(3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#10B981]" />
              Chủ Đề Mới Đang Thịnh Hành
            </CardTitle>
            <CardDescription className="mt-2">
              Các chủ đề câu hỏi mới nổi có thể cần các mục hỏi-đáp mới
            </CardDescription>
          </div>
          <Badge className="bg-[#10B981] hover:bg-[#059669] gap-1">
            <TrendingUp className="h-3 w-3" />
            Cơ Hội
          </Badge>
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
        ) : !trendingTopics || trendingTopics.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Không phát hiện chủ đề thịnh hành</p>
            <p className="text-sm">Hãy quay lại sau để xem các mẫu câu hỏi mới nổi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingTopics.slice(0, topicsVisibleCount).map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{topic.topic}</h4>
                      <Badge className="bg-[#10B981] hover:bg-[#059669] gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{topic.growthRate}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm text-muted-foreground">Tỷ Lệ Tăng Trưởng:</div>
                      <Progress value={Math.min(topic.growthRate, 100)} className="flex-1 h-2" />
                      <div className="text-sm font-semibold text-[#10B981]">
                        {topic.growthRate}%
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">{topic.questionsCount} câu hỏi</span> được hỏi trong {topic.timeframe || "14 ngày qua"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show More Button for Trending Topics */}
            {trendingTopics && topicsVisibleCount < trendingTopics.length && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setTopicsVisibleCount(prev => Math.min(prev + 3, trendingTopics.length))}
                  className="flex items-center gap-2"
                >
                  Hiển Thị Thêm ({Math.min(3, trendingTopics.length - topicsVisibleCount)} mục khác)
                </Button>
              </div>
            )}
            
            {/* Show Less Button when showing more than 3 */}
            {topicsVisibleCount > 3 && (
              <div className="flex justify-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setTopicsVisibleCount(3)}
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
