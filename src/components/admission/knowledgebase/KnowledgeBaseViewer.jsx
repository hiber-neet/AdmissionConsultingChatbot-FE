import { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import StatsCards from './StatsCards';
import SearchAndFilter from './SearchAndFilter';
import QATemplateList from './QATemplateList';
import DocumentList from './DocumentList';
import QADetailDialog from './QADetailDialog';
import { knowledgeAPI, intentAPI } from '../../../services/fastapi';

export function KnowledgeBaseViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả Danh Mục');
  const [selectedQA, setSelectedQA] = useState(null);
  const [isQADialogOpen, setIsQADialogOpen] = useState(false);
  const [trainingQuestions, setTrainingQuestions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static categories for filtering
  const categories = [
    'Tất Cả Danh Mục',
    'Tuyển Sinh',
    'Học Thuật',
    'Hỗ Trợ Tài Chính',
    'Cuộc Sống Khu Học Xá',
    'Khác'
  ];

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch intents first
        const intentsResponse = await intentAPI.getIntents();
        const intentsData = intentsResponse.data || intentsResponse || [];
        
        // Create intent map for quick lookup
        const intentMap = {};
        intentsData.forEach(intent => {
          intentMap[intent.intent_id] = intent.intent_name;
        });
        setIntents(intentsData);
        
        // Fetch training questions
        const trainingResponse = await knowledgeAPI.getTrainingQuestions();
        
        // Handle different response structures
        const trainingData = trainingResponse.data || trainingResponse || [];
        
        const transformedQuestions = Array.isArray(trainingData) 
          ? trainingData.map((question, index) => ({
              id: question.question_id?.toString() || index.toString(),
              question: question.question || 'No question',
              answer: question.answer || 'No answer',
              category: question.intent_id ? (intentMap[question.intent_id] || 'Khác') : 'Khác',
              tags: [], // No tags for now
              lastModified: question.created_at || new Date().toISOString().split('T')[0]
            }))
          : [];

        // Fetch documents
        const documentsResponse = await knowledgeAPI.getDocuments();
        
        // Handle different response structures
        const documentsData = documentsResponse.data || documentsResponse || [];
        
        const transformedDocuments = Array.isArray(documentsData)
          ? documentsData.map((doc, index) => ({
              id: doc.document_id?.toString() || `D${index + 1}`,
              document_id: doc.document_id, // ⬅️ KEEP original document_id for API calls
              title: doc.title || 'Untitled Document',
              description: doc.content ? doc.content.substring(0, 150) + '...' : '',
              category: doc.category || 'Khác',
              fileType: getFileType(doc.file_path || ''),
              uploadedDate: doc.created_at || new Date().toISOString().split('T')[0],
              tags: [], // No tags
              file_path: doc.file_path,
              content: doc.content
            }))
          : [];


        setTrainingQuestions(transformedQuestions);
        setDocuments(transformedDocuments);
      } catch (error) {
        
        // Set empty arrays on error to prevent crashes
        setTrainingQuestions([]);
        setDocuments([]);
        
        // Show user-friendly error message
        if (error.response?.status === 403) {
        } else if (error.response?.status === 401) {
        } else {
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function
  const getFileType = (filePath) => {
    if (!filePath) return 'PDF';
    const extension = filePath.split('.').pop()?.toUpperCase();
    return extension || 'PDF';
  };

  const filteredQATemplates = trainingQuestions.filter((template) => {
    const matchesSearch = 
      template.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất Cả Danh Mục' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất Cả Danh Mục' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewQA = (template) => {
    setSelectedQA(template);
    setIsQADialogOpen(true);
  };

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 pb-8 space-y-6">
          <div>
            <h2>Cơ Sở Tri Thức</h2>
            <p className="text-muted-foreground">
              Xem các mẫu câu hỏi & câu trả lời và tài liệu hướng dẫn (Chỉ Đọc)
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h2>Cơ Sở Tri Thức</h2>
          <p className="text-muted-foreground">
            Xem các mẫu câu hỏi & câu trả lời và tài liệu hướng dẫn (Chỉ Đọc)
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards 
          qaTemplatesCount={trainingQuestions.length}
          documentsCount={documents.length}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Q&A Templates and Documents Lists */}
        <QATemplateList
          filteredQATemplates={filteredQATemplates}
          filteredDocuments={filteredDocuments}
          handleViewQA={handleViewQA}
        />

        {/* Q&A Detail Dialog */}
        <QADetailDialog
          isQADialogOpen={isQADialogOpen}
          setIsQADialogOpen={setIsQADialogOpen}
          selectedQA={selectedQA}
        />
      </div>
    </ScrollArea>
  );
}
