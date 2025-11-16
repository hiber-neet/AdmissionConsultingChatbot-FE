import { Brain, Save, Eye, Settings, Play } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Input } from '../../ui/system_users/input';
import { Tabs, TabsList, TabsTrigger } from '../../ui/system_users/tabs';

export function TestHeader({ 
  selectedTest, 
  activeTab, 
  onUpdateTest, 
  onSaveTest, 
  onTabChange 
}) {
  return (
    <div className="bg-card border-b p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <Input
              value={selectedTest.title}
              onChange={(e) => onUpdateTest({ title: e.target.value })}
              className="text-xl border-0 p-0 h-auto focus-visible:ring-0"
              placeholder="Tiêu đề bài test..."
            />
            <Input
              value={selectedTest.description}
              onChange={(e) => onUpdateTest({ description: e.target.value })}
              className="text-sm text-muted-foreground border-0 p-0 h-auto focus-visible:ring-0 mt-1"
              placeholder="Mô tả ngắn..."
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onTabChange('preview')}>
            <Eye className="h-4 w-4 mr-2" />
            Xem Trước
          </Button>
          <Button onClick={onSaveTest}>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="builder">
            <Settings className="h-4 w-4 mr-2" />
            Chỉnh Sửa
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Play className="h-4 w-4 mr-2" />
            Xem Trước
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}