import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { templateAPI } from '../../services/fastapi';

const QATemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Simple form data matching backend schema
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

  // Fetch templates on mount
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
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.template_name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    setLoading(true);
    try {
      if (editingTemplate) {
        await templateAPI.updateTemplate(editingTemplate.template_id, formData);
        toast.success('Template updated successfully');
      } else {
        await templateAPI.createTemplate(formData);
        toast.success('Template created successfully');
      }

      await fetchTemplates();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      template_name: template.template_name,
      template_fields: template.template_fields || [
        { field_name: 'question', order_field: 1, field_type: 'text' },
        { field_name: 'answer', order_field: 2, field_type: 'textarea' }
      ]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await templateAPI.deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      await fetchTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  };

  const resetForm = () => {
    setFormData({
      template_name: '',
      template_fields: [
        { field_name: 'question', order_field: 1, field_type: 'text' },
        { field_name: 'answer', order_field: 2, field_type: 'textarea' }
      ]
    });
    setEditingTemplate(null);
  };

  const addField = () => {
    const newOrder = formData.template_fields.length + 1;
    setFormData({
      ...formData,
      template_fields: [
        ...formData.template_fields,
        {
          field_name: `field_${newOrder}`,
          order_field: newOrder,
          field_type: 'text'
        }
      ]
    });
  };

  const updateField = (index, property, value) => {
    const newFields = [...formData.template_fields];
    newFields[index][property] = value;
    
    // Update order when changing field position
    if (property === 'order_field') {
      newFields.sort((a, b) => a.order_field - b.order_field);
    }
    
    setFormData({ ...formData, template_fields: newFields });
  };

  const removeField = (index) => {
    if (formData.template_fields.length <= 1) {
      toast.error('Template must have at least one field');
      return;
    }
    
    const newFields = formData.template_fields.filter((_, i) => i !== index);
    // Reorder fields
    newFields.forEach((field, idx) => {
      field.order_field = idx + 1;
    });
    
    setFormData({ ...formData, template_fields: newFields });
  };

  const filteredTemplates = templates.filter(template =>
    template.template_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldTypeOptions = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'file', label: 'File Upload' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Q&A Template Manager</h2>
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Template
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Templates List */}
      {loading ? (
        <div className="text-center py-8">Loading templates...</div>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.template_id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{template.template_name}</h3>
                  <p className="text-gray-600">
                    {template.template_fields?.length || 0} field(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.template_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Show field names */}
              <div className="mt-2 flex flex-wrap gap-2">
                {template.template_fields?.map((field, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {field.field_name} ({field.field_type})
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No templates found
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingTemplate ? 'Edit Template' : 'Create Template'}
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Template Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.template_name}
                onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
              />
            </div>

            {/* Fields */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Template Fields
                </label>
                <button
                  onClick={addField}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Add Field
                </button>
              </div>

              {formData.template_fields.map((field, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    {/* Field Name */}
                    <div className="col-span-5">
                      <label className="block text-xs text-gray-600 mb-1">Field Name</label>
                      <input
                        type="text"
                        value={field.field_name}
                        onChange={(e) => updateField(index, 'field_name', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="field name"
                      />
                    </div>

                    {/* Field Type */}
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      <select
                        value={field.field_type}
                        onChange={(e) => updateField(index, 'field_type', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      >
                        {fieldTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Order */}
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Order</label>
                      <input
                        type="number"
                        value={field.order_field}
                        onChange={(e) => updateField(index, 'order_field', parseInt(e.target.value))}
                        className="w-full p-2 border rounded text-sm"
                        min="1"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1">
                      <button
                        onClick={() => removeField(index)}
                        className="w-full bg-red-500 text-white p-2 rounded text-sm hover:bg-red-600"
                        title="Remove field"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingTemplate ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QATemplateManager;