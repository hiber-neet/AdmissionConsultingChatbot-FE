import { BookOpen, FileText, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/system_users/card';

export function StatsCards({ qaTemplatesCount, documentsCount, totalUsage, totalViews }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Mẫu Câu Hỏi
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{qaTemplatesCount}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Tài Liệu
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{documentsCount}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Lượt Sử Dụng
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{totalUsage.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Lượt Xem
            </CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl">{totalViews.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsCards;