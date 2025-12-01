import { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Trash2, Edit } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { Textarea } from '../ui/system_users/textarea';
import { useAuth } from '../../contexts/Auth';
import { fastAPIClient } from '../../utils/fastapi-client';

interface TrainingQuestionPair {
  question_id: number;
  question: string;
  answer: string;
  intent_id: number;
  intent_name?: string;
}

interface CreateTrainingQuestionRequest {
  question: string;
  answer: string;
  intent_id: number;
}

interface CreateTrainingQuestionResponse {
  message: string;
  result: {
    postgre_question_id: number;
    qdrant_question_id: string;
  };
}

interface Intent {
  intent_id: number;
  intent_name: string;
  description: string;
}

interface TrainingQuestionManagementProps {
  prefilledQuestion?: string | null;
  onQuestionUsed?: () => void;
  templateAction?: 'edit' | 'add' | 'view' | null;
}

export function TrainingQuestionManagement({ prefilledQuestion, onQuestionUsed, templateAction }: TrainingQuestionManagementProps) {
  const { hasPermission, user } = useAuth();
  const [trainingQuestions, setTrainingQuestions] = useState<TrainingQuestionPair[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('All Intents');
  const [selectedQuestion, setSelectedQuestion] = useState<TrainingQuestionPair | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedIntentId, setEditedIntentId] = useState<number | null>(null);
  const [showDraftConfirmation, setShowDraftConfirmation] = useState(false);

  // Fetch training questions from API
  useEffect(() => {
    const fetchTrainingQuestions = async () => {
      try {
        setLoading(true);
        const data = await fastAPIClient.get<TrainingQuestionPair[]>('/knowledge/training_questions');
        
        // Sort by question_id in ascending order
        const sortedData = data.sort((a, b) => a.question_id - b.question_id);
        setTrainingQuestions(sortedData);
        
        // Set the first question as selected by default
        if (sortedData.length > 0) {
          setSelectedQuestion(sortedData[0]);
        }
      } catch (error) {
        console.error('Error fetching training questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingQuestions();
  }, []);

  // Fetch all intents for the dropdown
  useEffect(() => {
    const fetchIntents = async () => {
      try {
        setIntentLoading(true);
        const data = await fastAPIClient.get<Intent[]>('/intent');
        setIntents(data);
      } catch (error) {
        console.error('Error fetching intents:', error);
      } finally {
        setIntentLoading(false);
      }
    };

    fetchIntents();
  }, []);

  // Fetch intent names for training questions
  useEffect(() => {
    const fetchIntentNames = async () => {
      if (trainingQuestions.length === 0) return;
      
      const updatedQuestions = await Promise.all(
        trainingQuestions.map(async (question) => {
          if (!question.intent_name) {
            try {
              const intentData = await fastAPIClient.get<Intent>(`/intent/${question.intent_id}`);
              return { ...question, intent_name: intentData.intent_name };
            } catch (error) {
              console.error(`Error fetching intent ${question.intent_id}:`, error);
            }
          }
          return question;
        })
      );
      
      setTrainingQuestions(updatedQuestions);
    };

    fetchIntentNames();
  }, [trainingQuestions.length]);

  // Create intent categories for filtering
  const intentCategories = ['All Intents', ...intents.map(intent => intent.intent_name)];

  // Handle prefilled question from content optimization or analytics
  useEffect(() => {
    if (prefilledQuestion && templateAction) {
      if (templateAction === 'add') {
        // Add new training question with prefilled question
        setEditedQuestion(prefilledQuestion);
        setEditedAnswer('');
        setEditedIntentId(null);
        setShowAddDialog(true);
      } else if (templateAction === 'edit') {
        // Find and edit existing training question
        const existingQuestion = trainingQuestions.find(tq => tq.question === prefilledQuestion);
        if (existingQuestion) {
          setSelectedQuestion(existingQuestion);
          setEditedQuestion(existingQuestion.question);
          setEditedAnswer(existingQuestion.answer);
          setEditedIntentId(existingQuestion.intent_id);
          setIsEditing(true);
        }
      } else if (templateAction === 'view') {
        // Find and view existing training question
        const existingQuestion = trainingQuestions.find(tq => tq.question === prefilledQuestion);
        if (existingQuestion) {
          setSelectedQuestion(existingQuestion);
          setIsEditing(false);
        }
      }
      onQuestionUsed?.();
    }
  }, [prefilledQuestion, onQuestionUsed, templateAction, trainingQuestions]);

  const filteredTrainingQuestions = trainingQuestions.filter(tq => {
    const matchesSearch = tq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIntent = selectedIntent === 'All Intents' || tq.intent_name === selectedIntent;
    return matchesSearch && matchesIntent;
  });

  const handleEdit = () => {
    if (selectedQuestion) {
      setEditedQuestion(selectedQuestion.question);
      setEditedAnswer(selectedQuestion.answer);
      setEditedIntentId(selectedQuestion.intent_id);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    // Save logic would go here - API call to update training question
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCreateTrainingQuestion = async () => {
    if (!editedQuestion.trim() || !editedAnswer.trim() || !editedIntentId || !user?.id) {
      return;
    }

    try {
      setCreating(true);
      
      const requestBody: CreateTrainingQuestionRequest = {
        question: editedQuestion.trim(),
        answer: editedAnswer.trim(),
        intent_id: editedIntentId
      };

      const response = await fastAPIClient.post<CreateTrainingQuestionResponse>(
        `/knowledge/upload/training_question?current_user_id=${user.id}`,
        requestBody
      );

      // Create new training question object for local state
      const newTrainingQuestion: TrainingQuestionPair = {
        question_id: response.result.postgre_question_id,
        question: editedQuestion.trim(),
        answer: editedAnswer.trim(),
        intent_id: editedIntentId,
        intent_name: intents.find(intent => intent.intent_id === editedIntentId)?.intent_name
      };

      // Add to local state and maintain sorted order
      setTrainingQuestions(prev => {
        const updated = [...prev, newTrainingQuestion];
        return updated.sort((a, b) => a.question_id - b.question_id);
      });
      
      // Select the newly created question
      setSelectedQuestion(newTrainingQuestion);

      // Reset form and close dialog
      setEditedQuestion('');
      setEditedAnswer('');
      setEditedIntentId(null);
      setShowAddDialog(false);

      console.log('Training question created successfully:', response);
    } catch (error) {
      console.error('Error creating training question:', error);
      // You might want to show an error toast or alert here
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen h-full flex bg-[#F8FAFC]">
      {/* Left Panel - Training Questions List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Training Questions</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => {
              setEditedQuestion('');
              setEditedAnswer('');
              setEditedIntentId(null);
              setShowAddDialog(true);
            }}>
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search training questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedIntent} onValueChange={setSelectedIntent}>
            <SelectTrigger>
              <SelectValue placeholder="Select intent" />
            </SelectTrigger>
            <SelectContent>
              {intentCategories.map(intent => (
                <SelectItem key={intent} value={intent}>{intent}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filteredTrainingQuestions.length} training questions found`}
          </div>
        </div>

        {/* Training Questions List */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-2 space-y-1 min-w-0">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading training questions...</div>
            ) : filteredTrainingQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No training questions found</div>
            ) : (
              filteredTrainingQuestions.map(tq => (
                <button
                  key={tq.question_id}
                  onClick={() => setSelectedQuestion(tq)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left overflow-hidden ${
                    selectedQuestion?.question_id === tq.question_id
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium break-words">{tq.question}</div>
                    <div className={`text-sm break-words ${
                      selectedQuestion?.question_id === tq.question_id ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      Intent: {tq.intent_name || 'Loading...'}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Training Question Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedQuestion ? (
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">
                  {isEditing ? "Edit Training Question" : "Training Question Details"}
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
                    <label className="text-sm font-medium">Intent</label>
                    <Select value={editedIntentId?.toString() || ''} onValueChange={(value) => setEditedIntentId(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intent" />
                      </SelectTrigger>
                      <SelectContent>
                        {intentLoading ? (
                          <SelectItem value="loading" disabled>Loading intents...</SelectItem>
                        ) : (
                          intents.map((intent) => (
                            <SelectItem key={intent.intent_id} value={intent.intent_id.toString()}>
                              {intent.intent_name}
                            </SelectItem>
                          ))
                        )}
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
                      <div className="text-sm text-muted-foreground">Intent</div>
                      <div>{selectedQuestion.intent_name || 'Loading...'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Question ID</div>
                      <div>{selectedQuestion.question_id}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Question</h3>
                      <p className="text-gray-700">{selectedQuestion.question}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Answer</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium">No Training Question Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a training question from the list to view its details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this training question? This action cannot be undone.
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

      {/* Add New Training Question Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Training Question</DialogTitle>
            <DialogDescription>
              Create a new training question by filling out the form below.
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
              <label className="text-sm font-medium">Intent</label>
              <Select value={editedIntentId?.toString() || ''} onValueChange={(value) => setEditedIntentId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intent" />
                </SelectTrigger>
                <SelectContent>
                  {intentLoading ? (
                    <SelectItem value="loading" disabled>Loading intents...</SelectItem>
                  ) : (
                    intents.map((intent) => (
                      <SelectItem key={intent.intent_id} value={intent.intent_id.toString()}>
                        {intent.intent_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditedQuestion('');
              setEditedAnswer('');
              setEditedIntentId(null);
              setShowAddDialog(false);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTrainingQuestion}
              disabled={creating || !editedQuestion.trim() || !editedAnswer.trim() || !editedIntentId}
            >
              {creating ? "Creating..." : "Create Training Question"}
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
              Your training question draft has been submitted for review. A consultant will review and approve or reject your submission.
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