import { useState } from 'react';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
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
import { CategoryStatistic } from '../../../services/fastapi';

interface CategoryInterestSectionProps {
  categoryStats: CategoryStatistic[];
  loading: boolean;
  error: string | null;
}

export function CategoryInterestSection({ categoryStats, loading, error }: CategoryInterestSectionProps) {
  const [categorySortField, setCategorySortField] = useState<'category' | 'total_questions'>('total_questions');
  const [categorySortDirection, setCategorySortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort category data
  const sortedCategoryData = [...(categoryStats || [])].sort((a, b) => {
    const aVal = a[categorySortField];
    const bVal = b[categorySortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return categorySortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return categorySortDirection === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    
    return 0;
  });

  const handleCategorySort = (field: 'category' | 'total_questions') => {
    if (categorySortField === field) {
      setCategorySortDirection(categorySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setCategorySortField(field);
      setCategorySortDirection('desc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Mục Quan Tâm</CardTitle>
        <CardDescription>
          Tổng quan về phân phối câu hỏi theo danh mục
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải thống kê danh mục...</span>
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
        ) : sortedCategoryData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Không có dữ liệu danh mục.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="h-12">
                <TableHead className="py-3">
                  <button
                    onClick={() => handleCategorySort('category')}
                    className="flex items-center gap-1 hover:text-foreground font-medium"
                  >
                    Danh Mục
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead className="text-right py-3">
                  <button
                    onClick={() => handleCategorySort('total_questions')}
                    className="flex items-center gap-1 hover:text-foreground ml-auto font-medium"
                  >
                    Tổng Câu Hỏi
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead className="text-right py-3">
                  <span className="font-medium">Tổng Lần Hỏi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategoryData.map((category) => (
                <TableRow key={category.category} className="h-14">
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-sm px-2.5 py-1">{category.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right py-3 text-base font-medium">
                    {category.total_questions}
                  </TableCell>
                  <TableCell className="text-right py-3 text-base">
                    {category.total_times_asked}
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
