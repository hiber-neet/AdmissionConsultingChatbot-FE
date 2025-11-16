import { useState } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import StatsCards from './StatsCards';
import SearchAndFilter from './SearchAndFilter';
import QATemplateList from './QATemplateList';
import DocumentList from './DocumentList';
import QADetailDialog from './QADetailDialog';
import { qaTemplates, documents, categories } from './mockData';

export function KnowledgeBaseViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả Danh Mục');
  const [selectedQA, setSelectedQA] = useState(null);
  const [isQADialogOpen, setIsQADialogOpen] = useState(false);

  const filteredQATemplates = qaTemplates.filter((template) => {
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

  const totalUsage = qaTemplates.reduce((sum, t) => sum + t.usageCount, 0);
  const totalViews = documents.reduce((sum, d) => sum + d.viewCount, 0);

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
          qaTemplatesCount={qaTemplates.length}
          documentsCount={documents.length}
          totalUsage={totalUsage}
          totalViews={totalViews}
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
