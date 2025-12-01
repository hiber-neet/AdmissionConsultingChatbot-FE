import { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown,
  Loader2
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
import { analyticsAPI, CategoryStatistic } from '../../services/fastapi';

interface QuestionData {
  id: number;
  question: string;
  category: string;
  timesAsked: number;
  status: 'answered' | 'unanswered';
}

const questionData: QuestionData[] = [
  {
    id: 1,
    question: 'What are the application deadlines for Fall 2025?',
    category: 'Admission Requirements',
    timesAsked: 342,
    status: 'answered',
  },
  {
    id: 2,
    question: 'How do I apply for financial aid?',
    category: 'Financial Aid',
    timesAsked: 289,
    status: 'answered',
  },
  {
    id: 3,
    question: 'What GPA do I need for admission?',
    category: 'Admission Requirements',
    timesAsked: 256,
    status: 'answered',
  },
  {
    id: 4,
    question: 'Can I schedule a campus tour?',
    category: 'Campus Life',
    timesAsked: 201,
    status: 'unanswered',
  },
  {
    id: 5,
    question: 'What scholarships are available?',
    category: 'Financial Aid',
    timesAsked: 187,
    status: 'answered',
  },
  {
    id: 6,
    question: 'What majors does the university offer?',
    category: 'Programs',
    timesAsked: 165,
    status: 'answered',
  },
  {
    id: 7,
    question: 'How long does the application review take?',
    category: 'Admission Requirements',
    timesAsked: 143,
    status: 'unanswered',
  },
  {
    id: 8,
    question: 'What is the tuition cost?',
    category: 'Tuition Fees',
    timesAsked: 128,
    status: 'answered',
  },
];

interface AnalyticsStatisticsProps {
  onNavigateToTemplates?: (question?: string, action?: 'edit' | 'add' | 'view') => void;
}

export function AnalyticsStatistics({ onNavigateToTemplates }: AnalyticsStatisticsProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [sortField, setSortField] = useState<keyof QuestionData>('timesAsked');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categorySortField, setCategorySortField] = useState<'category' | 'total_questions'>('total_questions');
  const [categorySortDirection, setCategorySortDirection] = useState<'asc' | 'desc'>('desc');
  
  // API state
  const [categoryStats, setCategoryStats] = useState<CategoryStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get days based on date range
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case 'Last 7 Days': return 7;
      case 'Last 30 Days': return 30;
      case 'Last 90 Days': return 90;
      case 'All Time': return 365 * 10; // Large number for all time
      default: return 30;
    }
  };

  // Fetch category statistics
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const days = getDaysFromRange(dateRange);
        const response = await analyticsAPI.getCategoryStatistics(days);
        setCategoryStats(response || []);
      } catch (err: any) {
        console.error('Error fetching category statistics:', err);
        setError(err.response?.data?.detail || 'Failed to fetch category statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, [dateRange]);

  const filteredData = questionData
    .filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      return 0;
    });

  // Sort category data from API
  const sortedCategoryData = [...categoryStats].sort((a, b) => {
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

  const handleSort = (field: keyof QuestionData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleCategorySort = (field: 'category' | 'total_questions') => {
    if (categorySortField === field) {
      setCategorySortDirection(categorySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setCategorySortField(field);
      setCategorySortDirection('desc');
    }
  };

  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1>Analytics & Statistics</h1>
          <p className="text-muted-foreground">
            Deep dive into user questions and interaction patterns
          </p>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                  <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                  <SelectItem value="All Time">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Admission Requirements">Admission Requirements</SelectItem>
                  <SelectItem value="Financial Aid">Financial Aid</SelectItem>
                  <SelectItem value="Tuition Fees">Tuition Fees</SelectItem>
                  <SelectItem value="Programs">Programs</SelectItem>
                  <SelectItem value="Campus Life">Campus Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Category Interest Section */}
        <Card>
          <CardHeader>
            <CardTitle>Category Interest</CardTitle>
            <CardDescription>
              Overview of question distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading category statistics...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : sortedCategoryData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No category data available for the selected time period.</p>
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
                        Category
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right py-3">
                      <button
                        onClick={() => handleCategorySort('total_questions')}
                        className="flex items-center gap-1 hover:text-foreground ml-auto font-medium"
                      >
                        Total Questions
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right py-3">
                      <span className="font-medium">Total Times Asked</span>
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

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredData.length}</span> questions
          </div>
        </div>

        {/* Content Area */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Detail</CardTitle>
            <CardDescription>
              Individual questions with their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead className="w-[40%] py-3">
                      <button
                        onClick={() => handleSort('question')}
                        className="flex items-center gap-1 hover:text-foreground font-medium"
                      >
                        Question Text
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="py-3">
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1 hover:text-foreground font-medium"
                      >
                        Category
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right py-3">
                      <button
                        onClick={() => handleSort('timesAsked')}
                        className="flex items-center gap-1 hover:text-foreground ml-auto font-medium"
                      >
                        Times Asked
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-center py-3">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-1 hover:text-foreground mx-auto font-medium"
                      >
                        Status
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </button>
                    </TableHead>
                    <TableHead className="text-center py-3">
                      <span className="font-medium">Action</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="h-16">
                      <TableCell className="font-medium py-4 text-base">{item.question}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-sm px-2.5 py-1">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right py-4 text-base">{item.timesAsked}</TableCell>
                      <TableCell className="text-center py-4">
                        <Badge 
                          className={`text-sm px-2.5 py-1 ${
                            item.status === 'answered' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.status === 'answered' ? 'Answered' : 'Unanswered'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {item.status === 'answered' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs"
                            onClick={() => onNavigateToTemplates?.(item.question, 'view')}
                          >
                            View Details
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                            onClick={() => onNavigateToTemplates?.(item.question, 'add')}
                          >
                            Add to KB
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
    </ScrollArea>
  );
}
