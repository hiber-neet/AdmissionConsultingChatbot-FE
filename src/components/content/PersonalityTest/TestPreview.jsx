import { Button } from '../../ui/system_users/button';
import { Card } from '../../ui/system_users/card';
import { Badge } from '../../ui/system_users/badge';
import { Separator } from '../../ui/system_users/separator';

export function TestPreview({ selectedTest }) {
  return (
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
                              <div className="flex items-center gap-2 mb-2">
                                <h4>{result.title || 'Chưa có tiêu đề'}</h4>
                                {result.riasecType && (
                                  <Badge variant="secondary" className="text-xs">
                                    {result.riasecType.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {result.description || 'Chưa có mô tả'}
                              </p>
                              <div className="text-xs text-muted-foreground mb-3">
                                Điểm {result.riasecType || 'RIASEC'}: {result.minScore || 0} - {result.maxScore || 100}
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
  );
}