import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Textarea } from '../ui/system_users/textarea';

type RiasecType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface RiasecQuestion {
  id: number;
  question: string;
  type: RiasecType;
  weight: number;
  lastUpdated: string;
}

const RIASEC_TYPES = [
  { value: 'R', label: 'Realistic' },
  { value: 'I', label: 'Investigative' },
  { value: 'A', label: 'Artistic' },
  { value: 'S', label: 'Social' },
  { value: 'E', label: 'Enterprising' },
  { value: 'C', label: 'Conventional' }
];

// Sample data
const initialQuestions: RiasecQuestion[] = [
  {
    id: 1,
    question: 'I enjoy working with tools and machines',
    type: 'R',
    weight: 2,
    lastUpdated: '2025-11-04'
  },
  {
    id: 2,
    question: 'I like to solve complex problems',
    type: 'I',
    weight: 2,
    lastUpdated: '2025-11-04'
  },
  {
    id: 3,
    question: 'I enjoy creating art',
    type: 'A',
    weight: 2,
    lastUpdated: '2025-11-04'
  }
];

export function RiasecManagement() {
  const [questions, setQuestions] = useState<RiasecQuestion[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<RiasecQuestion | null>(null);
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Form states
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedType, setEditedType] = useState<RiasecType>('R');
  const [editedWeight, setEditedWeight] = useState<number>(2);

  // Filter questions based on search and type
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || q.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Handle adding new question
  const handleAdd = () => {
    const newQuestion: RiasecQuestion = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      question: editedQuestion,
      type: editedType,
      weight: editedWeight,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setQuestions([...questions, newQuestion]);
    setShowAddDialog(false);
    resetForm();
  };

  // Handle editing question
  const handleEdit = () => {
    if (!selectedQuestion) return;
    const updatedQuestions = questions.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          question: editedQuestion,
          type: editedType,
          weight: editedWeight,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    setShowEditDialog(false);
    resetForm();
  };

  // Handle deleting question
  const handleDelete = () => {
    if (!selectedQuestion) return;
    const updatedQuestions = questions.filter(q => q.id !== selectedQuestion.id);
    setQuestions(updatedQuestions);
    setShowDeleteDialog(false);
    setSelectedQuestion(null);
  };

  // Reset form
  const resetForm = () => {
    setEditedQuestion('');
    setEditedType('R');
    setEditedWeight(2);
    setSelectedQuestion(null);
  };

  return (
    <div className="min-h-screen h-full flex bg-[#F8FAFC]">
      {/* Left Panel - Question List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">RIASEC Questions</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {RIASEC_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} questions found
          </div>
        </div>

        {/* Question List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredQuestions.map(question => {
              return (
              <div
                key={question.id}
                onClick={() => setSelectedQuestion(question)}
                className={`w-full p-3 rounded-lg transition-colors cursor-pointer ${
                  selectedQuestion?.id === question.id
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{question.question}</div>
                <div className={`mt-1 text-sm flex items-center gap-2 ${
                  selectedQuestion?.id === question.id ? 'text-blue-100' : 'text-muted-foreground'
                }`}>
                  <span className="font-medium">Type: {question.type}</span>
                  <span>•</span>
                  <span>Weight: {question.weight}</span>
                </div>
              </div>
            )})}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Question Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedQuestion ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">Question Details</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    setEditedQuestion(selectedQuestion.question);
                    setEditedType(selectedQuestion.type);
                    setEditedWeight(selectedQuestion.weight);
                    setShowEditDialog(true);
                  }}
                >
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
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Type</div>
                <div>{RIASEC_TYPES.find(t => t.value === selectedQuestion.type)?.label} ({selectedQuestion.type})</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Weight</div>
                <div>{selectedQuestion.weight}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div>{selectedQuestion.lastUpdated}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Question</div>
              <div className="p-4 bg-gray-50 rounded-lg">{selectedQuestion.question}</div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-medium">No Question Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a question from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Question Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New RIASEC Question</DialogTitle>
            <DialogDescription>
              Create a new question for the RIASEC personality test.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                placeholder="Enter the question..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={editedType} onValueChange={(value) => setEditedType(value as RiasecType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RIASEC_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight</label>
                <Select 
                  value={editedWeight.toString()} 
                  onValueChange={(value) => setEditedWeight(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Low</SelectItem>
                    <SelectItem value="2">2 - Medium</SelectItem>
                    <SelectItem value="3">3 - High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAdd}
              disabled={!editedQuestion || !editedType}
            >
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit RIASEC Question</DialogTitle>
            <DialogDescription>
              Update the selected RIASEC question.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                placeholder="Enter the question..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={editedType} onValueChange={(value) => setEditedType(value as RiasecType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RIASEC_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight</label>
                <Select 
                  value={editedWeight.toString()} 
                  onValueChange={(value) => setEditedWeight(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Low</SelectItem>
                    <SelectItem value="2">2 - Medium</SelectItem>
                    <SelectItem value="3">3 - High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={!editedQuestion || !editedType}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}