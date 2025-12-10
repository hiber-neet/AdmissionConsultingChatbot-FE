import { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Badge } from '../ui/system_users/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/system_users/table';
import { consultantAnalyticsAPI, CategoryStatistic, UserQuestion } from '../../services/fastapi';

interface AnalyticsStatisticsProps {
  onNavigateToTemplates?: (question?: string, action?: 'edit' | 'add' | 'view') => void;
}

export function AnalyticsStatistics({ onNavigateToTemplates }: AnalyticsStatisticsProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<number>(30);
  const [categorySortField, setCategorySortField] = useState<'category' | 'total_questions'>('total_questions');
  const [categorySortDirection, setCategorySortDirection] = useState<'asc' | 'desc'>('desc');
  
  // API state for category stats
  const [categoryStats, setCategoryStats] = useState<CategoryStatistic[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  
  // API state for questions
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch category statistics (not affected by date range filter)
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError(null);
        const response = await consultantAnalyticsAPI.getCategoryStatistics(30); // Always 30 days for categories
        setCategoryStats(Array.isArray(response) ? response : response?.data || []);
      } catch (err: any) {
        console.error('Error fetching category statistics:', err);
        setCategoryError(err.response?.data?.detail || 'Failed to fetch category statistics');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  // Fetch user questions (affected by date range and search filter)
  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError(null);
        const response = await consultantAnalyticsAPI.getUserQuestions(
          dateRange,
          currentPage,
          pageSize,
          searchQuery || undefined
        );
        
        setQuestions(response?.data || []);
        setTotalPages(response?.pagination?.total_pages || 1);
        setTotalCount(response?.pagination?.total_count || 0);
      } catch (err: any) {
        console.error('Error fetching user questions:', err);
        setQuestionsError(err.response?.data?.detail || 'Failed to fetch user questions');
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchUserQuestions();
  }, [dateRange, currentPage, searchQuery]);

  // Reset to page 1 when search query or date range changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateRange]);

  // Sort category data from API
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(parseInt(value));
  };

  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1>Phân Tích & Thống Kê</h1>
          <p className="text-muted-foreground">
            Phân tích sâu về câu hỏi của người dùng và các mẫu tương tác
          </p>
        </div>

        {/* Category Interest Section */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Mục Quan Tâm</CardTitle>
            <CardDescription>
              Tổng quan về phân phối câu hỏi theo danh mục
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {categoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Đang tải thống kê danh mục...</span>
              </div>
            ) : categoryError ? (
              <div className="text-center py-8 text-red-600">
                <p>Lỗi: {categoryError}</p>
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

        {/* Filters Section - Moved Below Category Interest */}
        <Card>
          <CardHeader>
            <CardTitle>Lọc Câu Hỏi</CardTitle>
            <CardDescription>
              Lọc câu hỏi theo khoảng thời gian và truy vấn tìm kiếm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateRange.toString()} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Ngày Qua</SelectItem>
                  <SelectItem value="14">14 Ngày Qua</SelectItem>
                  <SelectItem value="30">30 Ngày Qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Hiển thị <span className="font-semibold text-foreground">{questions.length}</span> trong{' '}
            <span className="font-semibold text-foreground">{totalCount}</span> câu hỏi
          </div>
        </div>

        {/* Questions Detail Section */}
        <Card>
          <CardHeader>
            <CardTitle>Chi Tiết Câu Hỏi</CardTitle>
            <CardDescription>
              Các câu hỏi riêng lẻ từ phiên chatbot với số liệu của chúng
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {questionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Đang tải câu hỏi...</span>
              </div>
            ) : questionsError ? (
              <div className="text-center py-8 text-red-600">
                <p>Lỗi: {questionsError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Thử Lại
                </Button>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Không tìm thấy câu hỏi nào phù hợp với bộ lọc của bạn.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="h-12">
                      <TableHead className="w-[50%] py-3">
                        <span className="font-medium">Nội Dung Câu Hỏi</span>
                      </TableHead>
                      <TableHead className="py-3">
                        <span className="font-medium">Danh Mục</span>
                      </TableHead>
                      <TableHead className="text-center py-3">
                        <span className="font-medium">Trạng Thái</span>
                      </TableHead>
                      <TableHead className="text-center py-3">
                        <span className="font-medium">Hành Động</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((item) => (
                      <TableRow key={item.id} className="h-16">
                        <TableCell className="font-medium py-4 text-base">{item.question}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-sm px-2.5 py-1">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <Badge 
                            className={`text-sm px-2.5 py-1 ${
                              item.status === 'answered' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {item.status === 'answered' ? 'Đã Trả Lời' : 'Chưa Trả Lời'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          {item.status === 'unanswered' && (
                            <Button
                              size="sm"
                              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => onNavigateToTemplates?.(item.question, 'add')}
                            >
                              Thêm vào KB
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />Trước</Button>
                      
                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >Tiếp Theo<ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
