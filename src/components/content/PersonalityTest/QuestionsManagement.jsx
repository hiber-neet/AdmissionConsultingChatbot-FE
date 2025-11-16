import { 
  Plus, 
  Trash2, 
  GripVertical,
  FileText
} from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Card } from '../../ui/system_users/card';
import { Input } from '../../ui/system_users/input';
import { Textarea } from '../../ui/system_users/textarea';
import { Label } from '../../ui/system_users/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/system_users/select';

export function QuestionsManagement({ 
  selectedTest,
  onUpdateTest
}) {
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

    onUpdateTest({
      questions: [...selectedTest.questions, newQuestion],
    });
  };

  const handleUpdateQuestion = (questionId, updates) => {
    if (!selectedTest) return;
    
    onUpdateTest({
      questions: selectedTest.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const handleDeleteQuestion = (questionId) => {
    if (!selectedTest) return;
    
    onUpdateTest({
      questions: selectedTest.questions.filter(q => q.id !== questionId),
    });
  };

  const handleAddOption = (questionId) => {
    if (!selectedTest) return;
    
    onUpdateTest({
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
    
    onUpdateTest({
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
    
    onUpdateTest({
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
  return (
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
                                          onChange={(e) => handleUpdateQuestion(question.id, { weight: parseInt(e.target.value) || 1 })}
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
  );
}