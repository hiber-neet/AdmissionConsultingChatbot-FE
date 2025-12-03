import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { templateAPI } from '../../services/fastapi';


const categories = ['All Categories', 'Admissions', 'Financial Aid', 'Campus Life', 'Academics', 'Student Services'];

export function QATemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [formData, setFormData] = useState({
    template_name: '',
    template_fields: [
      {
        field_name: 'question',
        order_field: 1,
        field_type: 'text'
      },
      {
        field_name: 'answer',
        order_field: 2,
        field_type: 'textarea'
      }
    ]
  });

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateAPI.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const templateName = template.template_name?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = templateName.includes(searchLower);
    
    // For now, show all templates regardless of category since backend doesn't have categories
    const matchesCategory = selectedCategory === 'All Categories';
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateOrUpdate = async () => {
    if (!formData.template_name) {
      toast.error('Please enter a template name');
      return;
    }

    setLoading(true);
    try {
      if (editingTemplate) {
        // Update existing template
        await templateAPI.updateTemplate(editingTemplate.template_id, formData);
        toast.success('Template updated successfully');
      } else {
        // Create new template
        await templateAPI.createTemplate(formData);
        toast.success('Template created successfully');
      }

      // Refresh templates list
      await fetchTemplates();
      
      // Reset form
      setFormData({
        template_name: '',
        template_fields: [
          {
            field_name: 'question',
            order_field: 1,
            field_type: 'text'
          },
          {
            field_name: 'answer',
            order_field: 2,
            field_type: 'textarea'
          }
        ]
      });
      setEditingTemplate(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error(`Failed to ${editingTemplate ? 'update' : 'create'} template. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      template_name: template.template_name,
      template_fields: template.template_fields || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setLoading(true);
    try {
      await templateAPI.deleteTemplates([templateId]);
      toast.success('Template deleted successfully');
      await fetchTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (template) => {
    const duplicatedTemplate = {
      template_name: `${template.template_name} (Copy)`,
      template_fields: template.template_fields || []
    };

    setLoading(true);
    try {
      await templateAPI.createTemplate(duplicatedTemplate);
      toast.success('Template duplicated successfully');
      await fetchTemplates();
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast.error('Failed to duplicate template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2>Template Manager</h2>
            <p className="text-muted-foreground">Create and manage form templates with custom fields</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTemplate(null);
                setFormData({
                  template_name: '',
                  template_fields: [
                    {
                      field_name: 'question',
                      order_field: 1,
                      field_type: 'text'
                    },
                    {
                      field_name: 'answer',
                      order_field: 2,
                      field_type: 'textarea'
                    }
                  ]
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                <DialogDescription>
                  {editingTemplate ? 'Update the template configuration' : 'Create a new template with custom fields'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template_name">Template Name</Label>
                  <Input
                    id="template_name"
                    value={formData.template_name}
                    onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    placeholder="Enter template name..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Template Fields</Label>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {formData.template_fields.map((field, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
                        <div className="col-span-4">
                          <Input
                            value={field.field_name}
                            onChange={(e) => {
                              const newFields = [...formData.template_fields];
                              newFields[index].field_name = e.target.value;
                              setFormData({ ...formData, template_fields: newFields });
                            }}
                            placeholder="Field name"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={field.order_field}
                            onChange={(e) => {
                              const newFields = [...formData.template_fields];
                              newFields[index].order_field = parseInt(e.target.value) || 1;
                              setFormData({ ...formData, template_fields: newFields });
                            }}
                            placeholder="Order"
                            min="1"
                          />
                        </div>
                        <div className="col-span-4">
                          <Select
                            value={field.field_type}
                            onValueChange={(value) => {
                              const newFields = [...formData.template_fields];
                              newFields[index].field_type = value;
                              setFormData({ ...formData, template_fields: newFields });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Field type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newFields = formData.template_fields.filter((_, i) => i !== index);
                              setFormData({ ...formData, template_fields: newFields });
                            }}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newField = {
                        field_name: '',
                        order_field: formData.template_fields.length + 1,
                        field_type: 'text'
                      };
                      setFormData({
                        ...formData,
                        template_fields: [...formData.template_fields, newField]
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate} disabled={loading}>
                  {loading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by name..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Total Templates: {templates.length}</span>
          <span>•</span>
          <span>Showing: {filteredTemplates.length}</span>
          <span>•</span>
          <span>Active: {templates.filter(t => t.is_active).length}</span>
        </div>
      </div>

      {/* Template List */}
      <ScrollArea className="flex-1">
        <div className="p-6 pb-8 space-y-4">
          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading templates...</p>
            </div>
          )}
          
          {!loading && filteredTemplates.map((template) => (
            <Card key={template.template_id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.template_name}</CardTitle>
                    <CardDescription className="mt-2">
                      {template.template_fields?.length || 0} fields configured
                    </CardDescription>
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
                        onClick={() => handleDelete(template.template_id)}
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
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {template.template_fields?.slice(0, 3).map((field, index) => (
                      <Badge key={index} variant="outline">
                        {field.field_name} ({field.field_type})
                      </Badge>
                    ))}
                    {template.template_fields?.length > 3 && (
                      <Badge variant="outline">
                        +{template.template_fields.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>ID: {template.template_id}</span>
                    {template.created_by && (
                      <>
                        <span>•</span>
                        <span>Created by: {template.created_by}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No templates found.</p>
              <p className="text-sm">Create your first template or adjust your search.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}