import { useState } from 'react';
import { TestLibrarySidebar } from './PersonalityTest/TestLibrarySidebar';
import { TestHeader } from './PersonalityTest/TestHeader';
import { TestSettings } from './PersonalityTest/TestSettings';
import { QuestionsManagement } from './PersonalityTest/QuestionsManagement';
import { TestPreview } from './PersonalityTest/TestPreview';
import { ResultsManagement } from './PersonalityTest/ResultsManagement';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/system_users/tabs';

// PersonalityTest object structure:
// {
//   id: string,
//   title: string,
//   description: string,
//   category: string,
//   questions: Question[],
//   results: ResultProfile[],
//   status: 'draft' | 'published',
//   createdDate: string,
//   lastModified: string
// }

// Question object structure:
// {
//   id: string,
//   text: string,
//   type: 'multiple-choice' | 'scale' | 'yes-no',
//   options?: Option[],
//   weight: number
// }

// Option object structure:
// {
//   id: string,
//   text: string,
//   score: number,
//   resultMapping?: string
// }

// ResultProfile object structure:
// {
//   id: string,
//   title: string,
//   description: string,
//   scoreRange: [number, number],
//   recommendations: string[],
//   color: string
// }

export function RiasecManagement() {
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

  const handleAddQuestion = () => {
    if (!selectedTest) return;
    
    const newQuestion = {
      id: Date.now().toString(),
      text: '',
      type: 'multiple-choice',
      options: [
        { id: '1', text: '', score: 0 },
        { id: '2', text: '', score: 0 },
      ],
      weight: 1,
    };

    setSelectedTest({
      ...selectedTest,
      questions: [...selectedTest.questions, newQuestion],
    });
  };

  const handleAddResult = () => {
    if (!selectedTest) return;
    
    const newResult = {
      id: Date.now().toString(),
      title: '',
      description: '',
      scoreRange: [0, 100],
      recommendations: [],
      color: 'blue',
    };

    setSelectedTest({
      ...selectedTest,
      results: [...selectedTest.results, newResult],
    });
  };

  const handleUpdateQuestion = (questionId, updates) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      questions: selectedTest.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const handleDeleteQuestion = (questionId) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      questions: selectedTest.questions.filter(q => q.id !== questionId),
    });
  };

  const handleAddOption = (questionId) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      questions: selectedTest.questions.map(q => {
        if (q.id === questionId) {
          const newOption = {
            id: Date.now().toString(),
            text: '',
            score: 0,
          };
          return {
            ...q,
            options: [...(q.options || []), newOption],
          };
        }
        return q;
      }),
    });
  };

  const handleUpdateOption = (questionId, optionId, updates) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      questions: selectedTest.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.map(opt => 
              opt.id === optionId ? { ...opt, ...updates } : opt
            ),
          };
        }
        return q;
      }),
    });
  };

  const handleDeleteOption = (questionId, optionId) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      questions: selectedTest.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options?.filter(opt => opt.id !== optionId),
          };
        }
        return q;
      }),
    });
  };

  const handleSaveTest = () => {
    if (!selectedTest) return;
    
    setTests(tests.map(t => t.id === selectedTest.id ? selectedTest : t));
    alert('Đã lưu bài test thành công!');
  };

  const handleUpdateResult = (resultId, updates) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      results: selectedTest.results.map(r => 
        r.id === resultId ? { ...r, ...updates } : r
      ),
    });
  };

  const handleDeleteResult = (resultId) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      results: selectedTest.results.filter(r => r.id !== resultId),
    });
  };

  const handleAddRecommendation = (resultId) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      results: selectedTest.results.map(r => {
        if (r.id === resultId) {
          return {
            ...r,
            recommendations: [...r.recommendations, ''],
          };
        }
        return r;
      }),
    });
  };

  const handleUpdateRecommendation = (resultId, index, value) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      results: selectedTest.results.map(r => {
        if (r.id === resultId) {
          const newRecommendations = [...r.recommendations];
          newRecommendations[index] = value;
          return {
            ...r,
            recommendations: newRecommendations,
          };
        }
        return r;
      }),
    });
  };

  const handleDeleteRecommendation = (resultId, index) => {
    if (!selectedTest) return;
    
    setSelectedTest({
      ...selectedTest,
      results: selectedTest.results.map(r => {
        if (r.id === resultId) {
          return {
            ...r,
            recommendations: r.recommendations.filter((_, i) => i !== index),
          };
        }
        return r;
      }),
    });
  };

  return (
    <div className="flex h-full bg-background">
      {/* Test Library Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Button onClick={handleCreateTest} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Bài Test Mới
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {tests.map(test => (
              <Card 
                key={test.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedTest?.id === test.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTest(test)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="line-clamp-1">{test.title || 'Chưa có tiêu đề'}</h4>
                  <Badge variant={test.status === 'published' ? 'default' : 'secondary'}>
                    {test.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {test.description || 'Chưa có mô tả'}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{test.questions.length} câu hỏi</span>
                  <span>{test.results.length} kết quả</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedTest ? (
          <>
            {/* Header */}
            <div className="bg-card border-b p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <div>
                    <Input
                      value={selectedTest.title}
                      onChange={(e) => setSelectedTest({ ...selectedTest, title: e.target.value })}
                      className="text-xl border-0 p-0 h-auto focus-visible:ring-0"
                      placeholder="Tiêu đề bài test..."
                    />
                    <Input
                      value={selectedTest.description}
                      onChange={(e) => setSelectedTest({ ...selectedTest, description: e.target.value })}
                      className="text-sm text-muted-foreground border-0 p-0 h-auto focus-visible:ring-0 mt-1"
                      placeholder="Mô tả ngắn..."
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('preview')}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem Trước
                  </Button>
                  <Button onClick={handleSaveTest}>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
                <TabsList>
                  <TabsTrigger value="builder">
                    <Settings className="h-4 w-4 mr-2" />
                    Chỉnh Sửa
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Play className="h-4 w-4 mr-2" />
                    Xem Trước
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Builder Content */}
            {activeTab === 'builder' && (
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                  {/* Test Settings */}
                  <Card className="p-6">
                    <h3 className="mb-4">Cài Đặt Bài Test</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Danh Mục</Label>
                        <Select 
                          value={selectedTest.category}
                          onValueChange={(value) => setSelectedTest({ ...selectedTest, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Định Hướng Nghề Nghiệp">Định Hướng Nghề Nghiệp</SelectItem>
                            <SelectItem value="Phong Cách Học Tập">Phong Cách Học Tập</SelectItem>
                            <SelectItem value="Sở Thích & Năng Khiếu">Sở Thích & Năng Khiếu</SelectItem>
                            <SelectItem value="Đánh Giá Chuẩn Bị">Đánh Giá Chuẩn Bị</SelectItem>
                            <SelectItem value="Chung">Chung</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  {/* Questions Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3>Câu Hỏi ({selectedTest.questions.length})</h3>
                      <Button onClick={handleAddQuestion}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm Câu Hỏi
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {selectedTest.questions.map((question, index) => (
                        <Card key={question.id} className="p-6">
                          <div className="flex items-start gap-4">
                            <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <Label>Câu hỏi {index + 1}</Label>
                                  <Textarea
                                    value={question.text}
                                    onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                                    placeholder="Nhập câu hỏi..."
                                    className="mt-2"
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Loại Câu Hỏi</Label>
                                  <Select 
                                    value={question.type}
                                    onValueChange={(value) => handleUpdateQuestion(question.id, { type: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">Nhiều Lựa Chọn</SelectItem>
                                      <SelectItem value="scale">Thang Điểm</SelectItem>
                                      <SelectItem value="yes-no">Có/Không</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Trọng Số</Label>
                                  <Input
                                    type="number"
                                    value={question.weight}
                                    onChange={(e) => handleUpdateQuestion(question.id, { weight: Number(e.target.value) })}
                                    min="1"
                                    max="5"
                                  />
                                </div>
                              </div>

                              {/* Options */}
                              {question.type === 'multiple-choice' && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <Label>Các Lựa Chọn</Label>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleAddOption(question.id)}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Thêm
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {question.options?.map((option, optIndex) => (
                                      <div key={option.id} className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground w-6">{String.fromCharCode(65 + optIndex)}.</span>
                                        <Input
                                          value={option.text}
                                          onChange={(e) => handleUpdateOption(question.id, option.id, { text: e.target.value })}
                                          placeholder="Nhập lựa chọn..."
                                          className="flex-1"
                                        />
                                        <Input
                                          type="number"
                                          value={option.score}
                                          onChange={(e) => handleUpdateOption(question.id, option.id, { score: Number(e.target.value) })}
                                          placeholder="Điểm"
                                          className="w-20"
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          onClick={() => handleDeleteOption(question.id, option.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}

                      {selectedTest.questions.length === 0 && (
                        <Card className="p-12 text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="mb-2">Chưa Có Câu Hỏi</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Thêm câu hỏi để bắt đầu tạo bài test
                          </p>
                          <Button onClick={handleAddQuestion}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Câu Hỏi Đầu Tiên
                          </Button>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Results Section */}
                  <ResultsManagement 
                    selectedTest={selectedTest}
                    onAddResult={handleAddResult}
                    onUpdateResult={handleUpdateResult}
                    onDeleteResult={handleDeleteResult}
                    onAddRecommendation={handleAddRecommendation}
                    onUpdateRecommendation={handleUpdateRecommendation}
                    onDeleteRecommendation={handleDeleteRecommendation}
                  />
                </div>
              </div>
            )}

            {/* Preview Content */}
            {activeTab === 'preview' && (
              <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
                <div className="max-w-3xl mx-auto">
                  <Card className="p-8">
                    <div className="text-center mb-8">
                      <h1 className="mb-3">{selectedTest.title}</h1>
                      <p className="text-muted-foreground">
                        {selectedTest.description}
                      </p>
                    </div>

                    <Separator className="my-8" />

                    {selectedTest.questions.length > 0 ? (
                      <div className="space-y-8">
                        {selectedTest.questions.map((question, index) => (
                          <div key={question.id}>
                            <h4 className="mb-4">
                              {index + 1}. {question.text || 'Chưa có câu hỏi'}
                            </h4>
                            {question.type === 'multiple-choice' && (
                              <div className="space-y-2">
                                {question.options?.map((option, optIndex) => (
                                  <div 
                                    key={option.id}
                                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                  >
                                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                                      {String.fromCharCode(65 + optIndex)}
                                    </div>
                                    <span>{option.text || 'Chưa có nội dung'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        <Button className="w-full" size="lg">
                          Xem Kết Quả
                        </Button>

                        {/* Preview Results Section */}
                        {selectedTest.results.length > 0 && (
                          <>
                            <Separator className="my-8" />
                            <div>
                              <h3 className="mb-6 text-center">Các Kết Quả Có Thể</h3>
                              <div className="grid gap-4">
                                {selectedTest.results.map((result) => (
                                  <Card key={result.id} className="p-6">
                                    <div className="flex items-start gap-4">
                                      <div className={`w-4 h-4 rounded-full mt-1 bg-${result.color}-500`} />
                                      <div className="flex-1">
                                        <h4 className="mb-2">{result.title || 'Chưa có tiêu đề'}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {result.description || 'Chưa có mô tả'}
                                        </p>
                                        <div className="text-xs text-muted-foreground mb-3">
                                          Điểm: {result.scoreRange[0]} - {result.scoreRange[1]}
                                        </div>
                                        {result.recommendations.length > 0 && (
                                          <div>
                                            <h5 className="text-sm mb-2">Gợi ý ngành học:</h5>
                                            <div className="flex flex-wrap gap-1">
                                              {result.recommendations.map((rec, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                  {rec || 'Chưa có nội dung'}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Thêm câu hỏi để xem bản xem trước
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
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
