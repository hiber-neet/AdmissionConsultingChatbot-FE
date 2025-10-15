import { useState } from 'react';
import { 
  Plus, 
  Search,
  Save,
  Trash2,
  History,
  ChevronRight,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Badge } from '../ui/system_users/badge';
import { Textarea } from '../ui/system_users/textarea';
import { Label } from '../ui/system_users/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';

interface QAPair {
  id: number;
  question: string;
  answer: string;
  category: string;
  lastUpdated: string;
  source?: string;
  relatedQuestions?: number[];
}

const qaPairs: QAPair[] = [
  {
    id: 1,
    question: 'What are the application deadlines for Fall 2025?',
    answer: 'For Fall 2025 admission: Early Decision - November 15, 2024, Regular Decision - January 15, 2025, Transfer Students - March 1, 2025. We recommend submitting applications at least two weeks before the deadline to ensure all materials are processed.',
    category: 'Admission Requirements',
    lastUpdated: '2024-10-01',
    source: 'Official Admissions Website',
    relatedQuestions: [2, 5],
  },
  {
    id: 2,
    question: 'What documents are required for admission?',
    answer: 'Required documents include: Official high school transcripts, SAT/ACT scores (optional for Fall 2025), Two letters of recommendation, Personal statement/essay, Application fee ($75, waiver available), and English proficiency scores for international students (TOEFL/IELTS).',
    category: 'Admission Requirements',
    lastUpdated: '2024-09-28',
    source: 'Admissions Office',
    relatedQuestions: [1, 3],
  },
  {
    id: 3,
    question: 'What is the average GPA for admitted students?',
    answer: 'The average GPA for admitted students is 3.7 on a 4.0 scale. However, we review applications holistically. Strong test scores, extracurricular activities, leadership experience, and compelling essays can compensate for a lower GPA.',
    category: 'Admission Requirements',
    lastUpdated: '2024-09-25',
    source: 'Admissions Statistics 2024',
    relatedQuestions: [2],
  },
  {
    id: 4,
    question: 'What financial aid options are available?',
    answer: 'We offer comprehensive financial aid including merit-based scholarships, need-based grants, federal student loans, and work-study programs. Financial aid packages are customized based on your academic profile and demonstrated financial need. Complete the FAFSA to be considered.',
    category: 'Financial Aid',
    lastUpdated: '2024-09-20',
    source: 'Financial Aid Office',
    relatedQuestions: [5, 6],
  },
  {
    id: 5,
    question: 'How do I apply for scholarships?',
    answer: 'Most merit scholarships are automatically considered when you apply for admission - no separate application needed. For need-based aid, complete the FAFSA by our priority deadline of February 1st. Additional department-specific scholarships may require separate applications.',
    category: 'Financial Aid',
    lastUpdated: '2024-09-18',
    source: 'Financial Aid Office',
    relatedQuestions: [4],
  },
  {
    id: 6,
    question: 'What is the estimated cost of attendance?',
    answer: 'For the 2024-2025 academic year: Tuition & Fees: $42,000, Room & Board: $14,000, Books & Supplies: $1,200, Personal Expenses: $2,800. Total estimated cost: $60,000. Financial aid is available to help cover these costs.',
    category: 'Tuition Fees',
    lastUpdated: '2024-09-15',
    source: 'Student Accounts Office',
    relatedQuestions: [4, 5],
  },
];

const categories = [
  'All Categories',
  'Admission Requirements',
  'Financial Aid',
  'Tuition Fees',
  'Programs',
  'Campus Life',
];

export function KnowledgeBaseManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedQA, setSelectedQA] = useState<QAPair | null>(qaPairs[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedCategory, setEditedCategory] = useState('');

  const filteredQAPairs = qaPairs.filter(qa => {
    const matchesSearch = qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qa.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || qa.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = () => {
    if (selectedQA) {
      setEditedQuestion(selectedQA.question);
      setEditedAnswer(selectedQA.answer);
      setEditedCategory(selectedQA.category);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving:', { editedQuestion, editedAnswer, editedCategory });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="h-full flex bg-[#F8FAFC]">
      {/* Left Panel - Q&A List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2>Knowledge Base</h2>
            <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Q&A pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {filteredQAPairs.length} Q&A pairs
          </div>
        </div>

        {/* Q&A List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredQAPairs.map(qa => (
              <button
                key={qa.id}
                onClick={() => setSelectedQA(qa)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedQA?.id === qa.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm mb-1">
                      {qa.question}
                    </div>
                    <Badge 
                      variant={selectedQA?.id === qa.id ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {qa.category}
                    </Badge>
                  </div>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 ${
                    selectedQA?.id === qa.id ? 'text-white' : 'text-muted-foreground'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedQA ? (
          <ScrollArea className="flex-1">
            <div className="p-6 pb-8 max-w-4xl">
              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <h1>Q&A Details</h1>
                {!isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <History className="h-4 w-4" />
                      Version History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                    >
                      Edit Q&A
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="bg-[#3B82F6] hover:bg-[#2563EB]"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              {/* Q&A Content */}
              <div className="space-y-6">
                {/* Question */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Question</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedQuestion}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                    ) : (
                      <p>{selectedQA.question}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Answer */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    ) : (
                      <p className="leading-relaxed">{selectedQA.answer}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4" />
                        Category
                      </Label>
                      {isEditing ? (
                        <Select value={editedCategory} onValueChange={setEditedCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(c => c !== 'All Categories').map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline">{selectedQA.category}</Badge>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        Last Updated
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedQA.lastUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {selectedQA.source && (
                      <div>
                        <Label className="mb-2 block">Source</Label>
                        <p className="text-sm text-muted-foreground">{selectedQA.source}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Related Questions */}
                {selectedQA.relatedQuestions && selectedQA.relatedQuestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Related Questions</CardTitle>
                      <CardDescription>
                        Other Q&A pairs that are commonly asked together
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedQA.relatedQuestions.map(relatedId => {
                          const related = qaPairs.find(q => q.id === relatedId);
                          return related ? (
                            <button
                              key={related.id}
                              onClick={() => setSelectedQA(related)}
                              className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm">{related.question}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </button>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a Q&A pair from the list to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Q&A Pair</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Q&A pair? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                // Delete logic would go here
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
