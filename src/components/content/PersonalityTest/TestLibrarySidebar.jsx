import { Plus } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Card } from '../../ui/system_users/card';
import { Badge } from '../../ui/system_users/badge';
import { ScrollArea } from '../../ui/system_users/scroll-area';

export function TestLibrarySidebar({ tests, selectedTest, onSelectTest, onCreateTest }) {
  return (
    <div className="w-80 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <Button onClick={onCreateTest} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Tạo Bài Test Mới
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {tests.map(test => (
            <Card 
              key={test.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                selectedTest?.id === test.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectTest(test)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="line-clamp-1">{test.title || 'Chưa có tiêu đề'}</h4>
                <Badge variant={test.status === 'published' ? 'default' : 'secondary'}>
                  {test.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {test.description || 'Chưa có mô tả'}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{test.questions.length} câu hỏi</span>
                <span>{test.results.length} kết quả</span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}