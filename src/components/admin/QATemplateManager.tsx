import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, MoreVertical } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Label } from '../ui/system_users/label';
import { Textarea } from '../ui/system_users/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Badge } from '../ui/system_users/badge';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/system_users/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/system_users/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';

interface QATemplate {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  usageCount: number;
  lastModified: string;
}

const initialTemplates: QATemplate[] = [
  {
    id: '1',
    question: 'What are the application deadlines?',
    answer: 'For Fall 2025 admission: Early Decision - November 15, 2025, Regular Decision - January 15, 2025, Transfer Students - March 1, 2025',
    category: 'Admissions',
    tags: ['deadlines', 'important'],
    usageCount: 342,
    lastModified: '2024-10-01',
  },
  {
    id: '2',
    question: 'What financial aid options are available?',
    answer: 'We offer merit-based scholarships, need-based grants, federal student loans, and work-study programs. Financial aid packages are customized based on your academic profile and financial need.',
    category: 'Financial Aid',
    tags: ['scholarships', 'grants', 'popular'],
    usageCount: 289,
    lastModified: '2024-09-28',
  },
  {
    id: '3',
    question: 'How do I schedule a campus tour?',
    answer: 'You can schedule a campus tour through our virtual tour platform (available 24/7) or book an in-person tour Monday-Friday, 10am-4pm. Special open house events are held on select Saturdays.',
    category: 'Campus Life',
    tags: ['tours', 'visit'],
    usageCount: 201,
    lastModified: '2024-09-25',
  },
  {
    id: '4',
    question: 'What GPA do I need for admission?',
    answer: 'The average admitted student has a GPA of 3.7, but we review applications holistically. Strong test scores, extracurriculars, and essays can compensate for a lower GPA.',
    category: 'Admissions',
    tags: ['requirements', 'gpa'],
    usageCount: 412,
    lastModified: '2024-09-20',
  },
];

const categories = ['All Categories', 'Admissions', 'Financial Aid', 'Campus Life', 'Academics', 'Student Services'];

export function QATemplateManager() {
  const [templates, setTemplates] = useState<QATemplate[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QATemplate | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Admissions',
    tags: '',
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateOrUpdate = () => {
    if (!formData.question || !formData.answer) return;

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? {
              ...t,
              question: formData.question,
              answer: formData.answer,
              category: formData.category,
              tags,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : t
      ));
    } else {
      // Create new template
      const newTemplate: QATemplate = {
        id: Date.now().toString(),
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        tags,
        usageCount: 0,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setTemplates([newTemplate, ...templates]);
    }

    // Reset form
    setFormData({ question: '', answer: '', category: 'Admissions', tags: '' });
    setEditingTemplate(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (template: QATemplate) => {
    setEditingTemplate(template);
    setFormData({
      question: template.question,
      answer: template.answer,
      category: template.category,
      tags: template.tags.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleDuplicate = (template: QATemplate) => {
    const newTemplate: QATemplate = {
      ...template,
      id: Date.now().toString(),
      question: `${template.question} (Copy)`,
      usageCount: 0,
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTemplates([newTemplate, ...templates]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Q&A Template Manager</h2>
            <p className="text-muted-foreground">Create and manage response templates for common questions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTemplate(null);
                setFormData({ question: '', answer: '', category: 'Admissions', tags: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                <DialogDescription>
                  {editingTemplate ? 'Update the Q&A template' : 'Add a new Q&A template to the knowledge base'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the question..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Enter the answer..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== 'All Categories').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g., important, deadlines"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate}>
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total Templates: {templates.length}</span>
          <span>•</span>
          <span>Showing: {filteredTemplates.length}</span>
        </div>
      </div>

      {/* Template List */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8 space-y-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.question}</CardTitle>
                    <CardDescription className="mt-2">{template.answer}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(template)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Used {template.usageCount} times</span>
                    <span>•</span>
                    <span>Modified {template.lastModified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No templates found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}