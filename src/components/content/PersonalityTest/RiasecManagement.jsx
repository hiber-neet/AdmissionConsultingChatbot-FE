import { useState } from 'react';
import { Brain, Plus } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { TestLibrarySidebar } from './TestLibrarySidebar';
import { TestHeader } from './TestHeader';
import { TestSettings } from './TestSettings';
import { QuestionsManagement } from './QuestionsManagement';
import { TestPreview } from './TestPreview';
import { ResultsManagement } from './ResultsManagement';

export default function RiasecManagement() {
  const [tests, setTests] = useState([
    {
      id: '1',
      title: 'Tìm Ngành Học Phù Hợp',
      description: 'Khám phá ngành học phù hợp nhất với tính cách và sở thích của bạn',
      category: 'Định Hướng Nghề Nghiệp',
      questions: [],
      results: [],
      status: 'draft',
      createdDate: '2024-10-20',
      lastModified: '2024-10-24',
    },
  ]);

  const [selectedTest, setSelectedTest] = useState(tests[0]);
  const [activeTab, setActiveTab] = useState('builder');

  const handleCreateTest = () => {
    const newTest = {
      id: Date.now().toString(),
      title: 'Bài Test Mới',
      description: '',
      category: 'Chung',
      questions: [],
      results: [],
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
    };
    setTests([newTest, ...tests]);
    setSelectedTest(newTest);
  };

  const handleUpdateTest = (updates) => {
    if (!selectedTest) return;
    const updatedTest = { ...selectedTest, ...updates };
    setSelectedTest(updatedTest);
    setTests(tests.map(t => t.id === selectedTest.id ? updatedTest : t));
  };

  const handleSaveTest = () => {
    if (!selectedTest) return;
    setTests(tests.map(t => t.id === selectedTest.id ? selectedTest : t));
    alert('Đã lưu bài test thành công!');
  };

  return (
    <div className="flex h-full bg-background">
      <TestLibrarySidebar
        tests={tests}
        selectedTest={selectedTest}
        onSelectTest={setSelectedTest}
        onCreateTest={handleCreateTest}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedTest ? (
          <>
            <TestHeader
              selectedTest={selectedTest}
              onUpdateTest={handleUpdateTest}
              onSaveTest={handleSaveTest}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {activeTab === 'builder' && (
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                  <TestSettings
                    selectedTest={selectedTest}
                    onUpdateTest={handleUpdateTest}
                  />

                  <QuestionsManagement
                    selectedTest={selectedTest}
                    onUpdateTest={handleUpdateTest}
                  />

                  <ResultsManagement
                    selectedTest={selectedTest}
                    onUpdateTest={handleUpdateTest}
                  />
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <TestPreview selectedTest={selectedTest} />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Chọn Hoặc Tạo Bài Test</h3>
              <p className="text-muted-foreground mb-4">
                Chọn một bài test từ danh sách hoặc tạo mới
              </p>
              <Button onClick={handleCreateTest}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Bài Test Mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}