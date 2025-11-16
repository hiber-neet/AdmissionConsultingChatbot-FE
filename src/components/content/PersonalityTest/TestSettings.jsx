import { Label } from '../../ui/system_users/label';
import { Card } from '../../ui/system_users/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/system_users/select';

export function TestSettings({ selectedTest, onUpdateTest }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Cài Đặt Bài Test</h3>
      <div className="space-y-4">
        <div>
          <Label>Danh Mục</Label>
          <Select 
            value={selectedTest.category}
            onValueChange={(value) => onUpdateTest({ category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Định Hướng Nghề Nghiệp">Định Hướng Nghề Nghiệp</SelectItem>
              <SelectItem value="Phong Cách Học Tập">Phong Cách Học Tập</SelectItem>
              <SelectItem value="Sở Thích & Năng Khiếu">Sở Thích & Năng Khiếu</SelectItem>
              <SelectItem value="Đánh Giá Chuẩn Bị">Đánh Giá Chuẩn Bị</SelectItem>
              <SelectItem value="Chung">Chung</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}