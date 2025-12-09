import { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Trash2, Edit, CheckCircle, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/system_users/dialog';
import { Textarea } from '../ui/system_users/textarea';
import { useAuth } from '../../contexts/Auth';
import { fastAPIClient } from '../../utils/fastapi-client';
import { templateAPI } from '../../services/fastapi';
import { Template } from '../../types/template.types';
import { toast } from 'react-toastify';

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
  
  // Template-related state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedQAPairIndex, setSelectedQAPairIndex] = useState<string>('');

  // Fetch training questions and intents on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIntentLoading(true);
        
        // Fetch both training questions and intents in parallel
        const [questionsData, intentsData] = await Promise.all([
          fastAPIClient.get<TrainingQuestionPair[]>('/knowledge/training_questions'),
          fastAPIClient.get<Intent[]>('/intent')
        ]);
        
        // Set intents
        setIntents(intentsData);
        
        // Sort questions by question_id in ascending order
        const sortedData = questionsData.sort((a, b) => a.question_id - b.question_id);
        
        // Map intent names to questions immediately
        const questionsWithIntentNames = sortedData.map(question => {
          const intent = intentsData.find(i => i.intent_id === question.intent_id);
          return {
            ...question,
            intent_name: intent?.intent_name || 'Unknown Intent'
          };
        });
        
        setTrainingQuestions(questionsWithIntentNames);
        
        // Set the first question as selected by default
        if (questionsWithIntentNames.length > 0) {
          setSelectedQuestion(questionsWithIntentNames[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load training questions or intents');
      } finally {
        setLoading(false);
        setIntentLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch templates when add dialog opens
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!showAddDialog) return;
      
      try {
        setTemplatesLoading(true);
        const data = await templateAPI.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();
  }, [showAddDialog]);

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

  const handleSave = async () => {
    if (!selectedQuestion || !editedQuestion.trim() || !editedAnswer.trim() || !editedIntentId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // TODO: Implement update API call when backend endpoint is ready
      // const response = await fastAPIClient.put(`/knowledge/training_question/${selectedQuestion.question_id}`, {
      //   question: editedQuestion.trim(),
      //   answer: editedAnswer.trim(),
      //   intent_id: editedIntentId
      // });

      // For now, update local state
      setTrainingQuestions(prev => 
        prev.map(tq => 
          tq.question_id === selectedQuestion.question_id
            ? {
                ...tq,
                question: editedQuestion.trim(),
                answer: editedAnswer.trim(),
                intent_id: editedIntentId,
                intent_name: intents.find(intent => intent.intent_id === editedIntentId)?.intent_name
              }
            : tq
        )
      );

      // Update selected question
      const updatedQuestion = {
        ...selectedQuestion,
        question: editedQuestion.trim(),
        answer: editedAnswer.trim(),
        intent_id: editedIntentId,
        intent_name: intents.find(intent => intent.intent_id === editedIntentId)?.intent_name
      };
      setSelectedQuestion(updatedQuestion);

      setIsEditing(false);
      toast.success('Training question updated successfully!');
    } catch (error) {
      console.error('Error updating training question:', error);
      toast.error('Failed to update training question. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      // TODO: Implement delete API call when backend endpoint is ready
      // await fastAPIClient.delete(`/knowledge/training_question/${selectedQuestion.question_id}`);

      // For now, update local state
      setTrainingQuestions(prev => 
        prev.filter(tq => tq.question_id !== selectedQuestion.question_id)
      );

      // Select the first question if available, or clear selection
      const remaining = trainingQuestions.filter(tq => tq.question_id !== selectedQuestion.question_id);
      setSelectedQuestion(remaining.length > 0 ? remaining[0] : null);

      setShowDeleteDialog(false);
      toast.success('Training question deleted successfully!');
    } catch (error) {
      console.error('Error deleting training question:', error);
      toast.error('Failed to delete training question. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplateId || !selectedQAPairIndex) return;
    
    const template = templates.find(t => t.template_id?.toString() === selectedTemplateId);
    if (!template) return;
    
    const qaPairIndex = parseInt(selectedQAPairIndex);
    const qaPair = template.qa_pairs[qaPairIndex];
    
    if (qaPair) {
      setEditedQuestion(qaPair.question);
      setEditedAnswer(qaPair.answer);
      toast.success('Template loaded! You can now edit and submit.');
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedQAPairIndex(''); // Reset QA pair selection when template changes
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
      setSelectedTemplateId('');
      setSelectedQAPairIndex('');
      setShowAddDialog(false);

      // Show success message
      toast.success('Training question created successfully!');
      console.log('Training question created successfully:', response);
    } catch (error) {
      console.error('Error creating training question:', error);
      toast.error('Failed to create training question. Please try again.');
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
            <h2 className="text-lg font-semibold">Câu Hỏi Huấn Luyện</h2>
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
            {loading ? 'Đang tải...' : `${filteredTrainingQuestions.length} training questions found`}
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
                      Intent: {tq.intent_name || 'Đang tải...'}
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
                      <Edit className="h-4 w-4" />Chỉnh Sửa</Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="gap-2"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4" />Xóa</Button>
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
                    <label className="text-sm font-medium">Câu Trả Lời</label>
                    <Textarea
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ý Định</label>
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
                    <Button variant="outline" onClick={handleCancel}>Hủy</Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Ý Định</div>
                      <div>{selectedQuestion.intent_name || 'Đang tải...'}</div>
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
                      <h3 className="text-lg font-medium mb-2">Câu Trả Lời</h3>
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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Training Question Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-6xl w-[1200px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add New Training Question</DialogTitle>
            <DialogDescription>
              Create a new training question pair. You can use templates or create from scratch.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto -mx-6 px-6">
            <div className="grid grid-cols-1 gap-6 py-4">
            {/* Templates Section */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-sm">Use Template (Optional)</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {templates.length} template(s) available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Template Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Template</label>
                  <Select 
                    value={selectedTemplateId} 
                    onValueChange={handleTemplateChange}
                    disabled={templatesLoading || templates.length === 0}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder={templatesLoading ? "Loading..." : "Choose a template"} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.template_id} value={template.template_id!.toString()}>
                          {template.template_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* QA Pair Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Q&A Pair</label>
                  <Select 
                    value={selectedQAPairIndex} 
                    onValueChange={setSelectedQAPairIndex}
                    disabled={!selectedTemplateId}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Choose Q&A pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTemplateId && templates
                        .find(t => t.template_id?.toString() === selectedTemplateId)
                        ?.qa_pairs
                        .sort((a, b) => a.order_position - b.order_position)
                        .map((qa, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {qa.question.substring(0, 50)}{qa.question.length > 50 ? '...' : ''}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Use Template Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium opacity-0">Action</label>
                  <Button
                    onClick={handleUseTemplate}
                    disabled={!selectedTemplateId || !selectedQAPairIndex}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    Load Template
                  </Button>
                </div>
              </div>

              {/* Preview Selected QA Pair */}
              {selectedTemplateId && selectedQAPairIndex && (
                <div className="p-3 bg-white rounded-md border border-blue-200 text-sm">
                  <div className="font-medium text-gray-700 mb-1">Preview:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><span className="font-semibold">Q:</span> {templates.find(t => t.template_id?.toString() === selectedTemplateId)?.qa_pairs[parseInt(selectedQAPairIndex)]?.question}</div>
                    <div className="line-clamp-2"><span className="font-semibold">A:</span> {templates.find(t => t.template_id?.toString() === selectedTemplateId)?.qa_pairs[parseInt(selectedQAPairIndex)]?.answer}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Question
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  placeholder="Enter the training question..."
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Câu Trả Lời
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  className="min-h-[180px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Ý Định (Intent)
                  <span className="text-red-500">*</span>
                </label>
                <Select value={editedIntentId?.toString() || ''} onValueChange={(value) => setEditedIntentId(Number(value))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select an intent for this question" />
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
            </div>
          </ScrollArea>

          <DialogFooter className="flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditedQuestion('');
                setEditedAnswer('');
                setEditedIntentId(null);
                setSelectedTemplateId('');
                setSelectedQAPairIndex('');
                setShowAddDialog(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateTrainingQuestion}
              disabled={creating || !editedQuestion.trim() || !editedAnswer.trim() || !editedIntentId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {creating ? "Creating..." : "Create Training Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}