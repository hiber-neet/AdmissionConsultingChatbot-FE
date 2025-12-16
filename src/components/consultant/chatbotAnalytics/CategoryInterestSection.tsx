import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Button } from '../../ui/system_users/button';
import { Badge } from '../../ui/system_users/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/system_users/table';
import { Intent } from '../../../utils/fastapi-client';

interface CategoryInterestSectionProps {
  intents: Intent[];
  loading: boolean;
  error: string | null;
}

export function CategoryInterestSection({ intents, loading, error }: CategoryInterestSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Mục</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải danh mục...</span>
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
        ) : intents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Không có danh mục nào.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="h-12">
                <TableHead className="py-3 font-medium">
                  Danh Mục
                </TableHead>
                <TableHead className="text-right py-3 font-medium">
                  Số Lần Được Hỏi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intents.map((intent) => (
                <TableRow key={intent.intent_id} className="h-14">
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-sm px-2.5 py-1">{intent.intent_name}</Badge>
                  </TableCell>
                  <TableCell className="text-right py-3 text-base font-medium">
                    0
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
