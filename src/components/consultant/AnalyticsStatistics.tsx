import { useState } from 'react';
import { 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  BarChart3,
  Table as TableIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/system_users/tabs';

interface QuestionData {
  id: number;
  question: string;
  category: string;
  timesAsked: number;
  satisfaction: number | null;
  trending: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const questionData: QuestionData[] = [
  {
    id: 1,
    question: 'What are the application deadlines for Fall 2025?',
    category: 'Admission Requirements',
    timesAsked: 342,
    satisfaction: 4.5,
    trending: 'up',
    trendPercentage: 15,
  },
  {
    id: 2,
    question: 'How do I apply for financial aid?',
    category: 'Financial Aid',
    timesAsked: 289,
    satisfaction: 4.3,
    trending: 'up',
    trendPercentage: 22,
  },
  {
    id: 3,
    question: 'What GPA do I need for admission?',
    category: 'Admission Requirements',
    timesAsked: 256,
    satisfaction: 3.8,
    trending: 'down',
    trendPercentage: -5,
  },
  {
    id: 4,
    question: 'Can I schedule a campus tour?',
    category: 'Campus Life',
    timesAsked: 201,
    satisfaction: 4.7,
    trending: 'up',
    trendPercentage: 8,
  },
  {
    id: 5,
    question: 'What scholarships are available?',
    category: 'Financial Aid',
    timesAsked: 187,
    satisfaction: 4.1,
    trending: 'up',
    trendPercentage: 12,
  },
  {
    id: 6,
    question: 'What majors does the university offer?',
    category: 'Programs',
    timesAsked: 165,
    satisfaction: 4.6,
    trending: 'stable',
    trendPercentage: 0,
  },
  {
    id: 7,
    question: 'How long does the application review take?',
    category: 'Admission Requirements',
    timesAsked: 143,
    satisfaction: 3.9,
    trending: 'down',
    trendPercentage: -3,
  },
  {
    id: 8,
    question: 'What is the tuition cost?',
    category: 'Tuition Fees',
    timesAsked: 128,
    satisfaction: 4.4,
    trending: 'up',
    trendPercentage: 18,
  },
];

const keywords = [
  { word: 'deadline', size: 48 },
  { word: 'financial aid', size: 42 },
  { word: 'tuition', size: 38 },
  { word: 'GPA', size: 36 },
  { word: 'scholarships', size: 34 },
  { word: 'admission', size: 32 },
  { word: 'requirements', size: 30 },
  { word: 'campus tour', size: 28 },
  { word: 'application', size: 26 },
  { word: 'programs', size: 24 },
  { word: 'majors', size: 22 },
  { word: 'housing', size: 20 },
  { word: 'international', size: 18 },
  { word: 'transfer', size: 16 },
  { word: 'transcript', size: 14 },
];

export function AnalyticsStatistics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [viewMode, setViewMode] = useState<'table' | 'wordcloud'>('table');
  const [sortField, setSortField] = useState<keyof QuestionData>('timesAsked');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (field: keyof QuestionData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <ScrollArea className="h-full">
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

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredData.length}</span> questions
          </div>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'wordcloud')}>
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <TableIcon className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="wordcloud" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Word Cloud
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">
                      <button
                        onClick={() => handleSort('question')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Question Text
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button
                        onClick={() => handleSort('timesAsked')}
                        className="flex items-center gap-1 hover:text-foreground ml-auto"
                      >
                        Times Asked
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button
                        onClick={() => handleSort('satisfaction')}
                        className="flex items-center gap-1 hover:text-foreground ml-auto"
                      >
                        Satisfaction
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className="text-center">Trending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.question}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.timesAsked}</TableCell>
                      <TableCell className="text-right">
                        {item.satisfaction ? (
                          <div className="flex items-center justify-end gap-1">
                            <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#3B82F6]"
                                style={{ width: `${(item.satisfaction / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">{item.satisfaction.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.trending === 'up' && (
                          <Badge className="gap-1 bg-[#10B981] hover:bg-[#059669]">
                            <TrendingUp className="h-3 w-3" />
                            +{item.trendPercentage}%
                          </Badge>
                        )}
                        {item.trending === 'down' && (
                          <Badge variant="destructive" className="gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {item.trendPercentage}%
                          </Badge>
                        )}
                        {item.trending === 'stable' && (
                          <Badge variant="outline">Stable</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Keywords</CardTitle>
              <CardDescription>
                Visualization of common terms in user questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-center gap-4 p-8 min-h-[400px]">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                    style={{
                      fontSize: `${keyword.size}px`,
                      color: `hsl(${(index * 360) / keywords.length}, 70%, 50%)`,
                      fontWeight: 600,
                    }}
                  >
                    {keyword.word}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
