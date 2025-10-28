import { useState } from 'react';
import { Search, Plus, MessageCircle, Trash2, Edit } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { Textarea } from '../ui/system_users/textarea';

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
  }
];

const categories = [
  'All Categories',
  'Admission Requirements',
  'Financial Aid',
  'Tuition Fees',
  'Programs',
  'Campus Life',
];

// Temporary role check - replace with actual role check from your auth system
const isConsultantLeader = false; // Set to true to test leader functionality

export function QATemplateManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedQA, setSelectedQA] = useState<QAPair | null>(qaPairs[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [showDraftConfirmation, setShowDraftConfirmation] = useState(false);

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
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen h-full flex bg-[#F8FAFC]">
      {/* Left Panel - Q&A List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Q&A Templates</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => {
              setEditedQuestion('');
              setEditedAnswer('');
              setEditedCategory('');
              setShowAddDialog(true);
            }}>
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Q&A pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {filteredQAPairs.length} Q&A templates found
          </div>
        </div>

        {/* Q&A List */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-2 space-y-1 min-w-0">
            {filteredQAPairs.map(qa => (
              <button
                key={qa.id}
                onClick={() => setSelectedQA(qa)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left overflow-hidden ${
                  selectedQA?.id === qa.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium break-words">{qa.question}</div>
                  <div className={`text-sm break-words ${
                    selectedQA?.id === qa.id ? 'text-blue-100' : 'text-muted-foreground'
                  }`}>
                    Updated {qa.lastUpdated}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Q&A Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedQA ? (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">
                  {isEditing ? "Edit Q&A Template" : "Q&A Template Details"}
                </h1>
                {!isEditing && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="gap-2"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question</label>
                    <Input
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Answer</label>
                    <Textarea
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={editedCategory} onValueChange={setEditedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div>{selectedQA.category}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div>{selectedQA.lastUpdated}</div>
                    </div>
                    {selectedQA.source && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Source</div>
                        <div>{selectedQA.source}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Question</h3>
                      <p className="text-gray-700">{selectedQA.question}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Answer</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedQA.answer}</p>
                    </div>

                    {selectedQA.relatedQuestions && selectedQA.relatedQuestions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Related Questions</h3>
                        <ul className="list-disc list-inside text-gray-700">
                          {selectedQA.relatedQuestions.map(id => {
                            const relatedQA = qaPairs.find(qa => qa.id === id);
                            return relatedQA && (
                              <li key={id} className="truncate">
                                <button
                                  className="hover:text-blue-600 hover:underline text-left"
                                  onClick={() => setSelectedQA(relatedQA)}
                                >
                                  {relatedQA.question}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No Template Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a Q&A template from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Q&A Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Q&A template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              // Delete logic would go here
              setShowDeleteDialog(false);
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Q&A Template Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Q&A Template</DialogTitle>
            <DialogDescription>
              Create a new Q&A template by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                placeholder="Enter the question..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                placeholder="Enter the answer..."
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={editedCategory} onValueChange={setEditedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditedQuestion('');
              setEditedAnswer('');
              setEditedCategory('');
              setShowAddDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (isConsultantLeader) {
                // Add logic for direct template creation
                setShowAddDialog(false);
              } else {
                // Add logic for creating draft request
                setShowAddDialog(false);
                setShowDraftConfirmation(true);
              }
            }}>
              {isConsultantLeader ? "Create Template" : "Submit for Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Confirmation Dialog */}
      <Dialog open={showDraftConfirmation} onOpenChange={setShowDraftConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draft Submitted for Review</DialogTitle>
            <DialogDescription>
              Your Q&A template draft has been submitted for review. A consultant leader will review and approve or reject your submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDraftConfirmation(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}