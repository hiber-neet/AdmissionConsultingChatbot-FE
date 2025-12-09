import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { templateAPI } from '../../services/fastapi';

const QATemplateManagerNew = () => {
  console.log('✅ NEW QATemplateManager loaded - Q&A PAIRS VERSION');
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Form state with Q&A pairs structure
  const [formData, setFormData] = useState({
    template_name: '',
    description: '',
    qa_pairs: [
      {
        question: '',
        answer: '',
        order_position: 1
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
      console.log('📥 Fetched templates:', data);
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Không thể tải danh sách mẫu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    // Validation
    if (!formData.template_name.trim()) {
      toast.error('Vui lòng nhập tên mẫu');
      return;
    }

    if (!formData.qa_pairs || formData.qa_pairs.length === 0) {
      toast.error('Vui lòng thêm ít nhất một cặp câu hỏi-trả lời');
      return;
    }

    // Validate each Q&A pair
    for (let i = 0; i < formData.qa_pairs.length; i++) {
      const qa = formData.qa_pairs[i];
      if (!qa.question.trim()) {
        toast.error(`Vui lòng nhập câu hỏi cho cặp Q&A #${i + 1}`);
        return;
      }
      if (!qa.answer.trim()) {
        toast.error(`Vui lòng nhập câu trả lời cho cặp Q&A #${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      console.log('📤 Sending template data:', JSON.stringify(formData, null, 2));
      
      if (editingTemplate) {
        await templateAPI.updateTemplate(editingTemplate.template_id, formData);
        toast.success('Cập nhật mẫu thành công!');
      } else {
        await templateAPI.createTemplate(formData);
        toast.success('Tạo mẫu mới thành công!');
      }

      await fetchTemplates();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error(editingTemplate ? 'Không thể cập nhật mẫu' : 'Không thể tạo mẫu mới');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      template_name: template.template_name,
      description: template.description || '',
      qa_pairs: template.qa_pairs?.length > 0 
        ? template.qa_pairs.map(qa => ({
            question: qa.question,
            answer: qa.answer,
            order_position: qa.order_position
          }))
        : [{ question: '', answer: '', order_position: 1 }]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mẫu này không?')) return;

    try {
      await templateAPI.deleteTemplates([templateId]);
      toast.success('Xóa mẫu thành công!');
      await fetchTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Không thể xóa mẫu');
    }
  };

  const resetForm = () => {
    setFormData({
      template_name: '',
      description: '',
      qa_pairs: [{ question: '', answer: '', order_position: 1 }]
    });
    setEditingTemplate(null);
  };

  const addQAPair = () => {
    const newOrder = formData.qa_pairs.length + 1;
    setFormData({
      ...formData,
      qa_pairs: [
        ...formData.qa_pairs,
        { question: '', answer: '', order_position: newOrder }
      ]
    });
  };

  const updateQAPair = (index, property, value) => {
    const newQAPairs = [...formData.qa_pairs];
    newQAPairs[index][property] = value;
    
    if (property === 'order_position') {
      newQAPairs.sort((a, b) => a.order_position - b.order_position);
    }
    
    setFormData({ ...formData, qa_pairs: newQAPairs });
  };

  const removeQAPair = (index) => {
    if (formData.qa_pairs.length <= 1) {
      toast.error('Mẫu phải có ít nhất một cặp câu hỏi-trả lời');
      return;
    }
    
    const newQAPairs = formData.qa_pairs.filter((_, i) => i !== index);
    newQAPairs.forEach((pair, idx) => {
      pair.order_position = idx + 1;
    });
    
    setFormData({ ...formData, qa_pairs: newQAPairs });
  };

  const filteredTemplates = templates.filter(template =>
    template.template_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản Lý Mẫu Q&A</h2>
        <button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Tạo Mẫu Mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm mẫu..."
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
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{template.template_name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-2">
                    {template.qa_pairs?.length || 0} Q&A pair(s)
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
              
              {/* Q&A Preview */}
              {template.qa_pairs && template.qa_pairs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {template.qa_pairs.slice(0, 2).map((qa, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded text-sm border-l-2 border-blue-400">
                      <p className="font-medium text-gray-700">Q: {qa.question.substring(0, 100)}{qa.question.length > 100 ? '...' : ''}</p>
                      <p className="text-gray-600 mt-1">A: {qa.answer.substring(0, 100)}{qa.answer.length > 100 ? '...' : ''}</p>
                    </div>
                  ))}
                  {template.qa_pairs.length > 2 && (
                    <p className="text-xs text-gray-500 italic">...and {template.qa_pairs.length - 2} more</p>
                  )}
                </div>
              )}
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
            {/* Dialog Header */}
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
                placeholder="e.g., Admission Requirements"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of this template"
                rows="2"
              />
            </div>

            {/* Q&A Pairs */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Q&A Pairs
                </label>
                <button
                  onClick={addQAPair}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Add Q&A
                </button>
              </div>

              {formData.qa_pairs.map((qa, index) => (
                <div key={index} className="border-2 border-gray-200 p-4 rounded-lg mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Q&A #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Order:</label>
                      <input
                        type="number"
                        value={qa.order_position}
                        onChange={(e) => updateQAPair(index, 'order_position', parseInt(e.target.value))}
                        className="w-16 p-1 border rounded text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => removeQAPair(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        title="Remove Q&A pair"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Question *
                    </label>
                    <textarea
                      value={qa.question}
                      onChange={(e) => updateQAPair(index, 'question', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the question..."
                      rows="2"
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Answer *
                    </label>
                    <textarea
                      value={qa.answer}
                      onChange={(e) => updateQAPair(index, 'answer', e.target.value)}
                      className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the answer..."
                      rows="3"
                    />
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

export default QATemplateManagerNew;

