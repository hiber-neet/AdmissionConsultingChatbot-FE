import { useState } from 'react';
import { HelpCircle, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import { KnowledgeGap } from '../../../services/fastapi';

interface KnowledgeGapsSectionProps {
  knowledgeGaps: KnowledgeGap[];
  loading: boolean;
  error: string | null;
  onNavigateToKnowledgeBase?: (question: string) => void;
}

export function KnowledgeGapsSection({ 
  knowledgeGaps, 
  loading, 
  error, 
  onNavigateToKnowledgeBase 
}: KnowledgeGapsSectionProps) {
  const [gapsVisibleCount, setGapsVisibleCount] = useState(3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#EF4444]" />
              Khoảng Trống Trong Cơ Sở Tri Thức
            </CardTitle>
            <CardDescription className="mt-2">
              Các câu hỏi thường xuyên được hỏi nhưng không có câu trả lời - ưu tiên thêm những câu này
            </CardDescription>
          </div>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Cần Hành Động
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải khoảng trống tri thức...</span>
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
        ) : !knowledgeGaps || knowledgeGaps.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Không có khoảng trống tri thức nào được xác định tại thời điểm này</p>
            <p className="text-sm">Cơ sở tri thức của bạn có vẻ đã toàn diện!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {knowledgeGaps.slice(0, gapsVisibleCount).map((gap) => (
              <div
                key={gap.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{gap.question}</h4>
                      <Badge variant="outline" className="text-xs">
                        {gap.intent_name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Đã hỏi <span className="font-semibold">{gap.frequency} lần</span> trong 30 ngày qua
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-[#3B82F6] hover:bg-[#2563EB]"
                    onClick={() => onNavigateToKnowledgeBase?.(gap.question)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm vào Cơ Sở Tri Thức
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Show More Button for Knowledge Gaps */}
            {knowledgeGaps && gapsVisibleCount < knowledgeGaps.length && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setGapsVisibleCount(prev => Math.min(prev + 3, knowledgeGaps.length))}
                  className="flex items-center gap-2"
                >
                  Hiển Thị Thêm ({Math.min(3, knowledgeGaps.length - gapsVisibleCount)} mục khác)
                </Button>
              </div>
            )}
            
            {/* Show Less Button when showing more than 3 */}
            {gapsVisibleCount > 3 && (
              <div className="flex justify-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setGapsVisibleCount(3)}
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
