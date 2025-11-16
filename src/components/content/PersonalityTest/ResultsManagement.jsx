import { 
  Plus,
  Trash2,
  Brain
} from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Card } from '../../ui/system_users/card';
import { Input } from '../../ui/system_users/input';
import { Textarea } from '../../ui/system_users/textarea';
import { Label } from '../../ui/system_users/label';
import { Badge } from '../../ui/system_users/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/system_users/select';

export function ResultsManagement({ 
  selectedTest, 
  onUpdateTest
}) {
  if (!selectedTest) return null;

  const handleAddResult = () => {
    const newResult = {
      id: Date.now().toString(),
      title: '',
      description: '',
      riasecType: 'realistic', // realistic, investigative, artistic, social, enterprising, conventional
      minScore: 0,
      maxScore: 100,
      recommendations: [],
      color: 'blue',
    };

    onUpdateTest({
      results: [...selectedTest.results, newResult],
    });
  };

  const handleUpdateResult = (resultId, updates) => {
    onUpdateTest({
      results: selectedTest.results.map(r => 
        r.id === resultId ? { ...r, ...updates } : r
      ),
    });
  };

  const handleDeleteResult = (resultId) => {
    onUpdateTest({
      results: selectedTest.results.filter(r => r.id !== resultId),
    });
  };

  const handleAddRecommendation = (resultId) => {
    onUpdateTest({
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
    onUpdateTest({
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
    onUpdateTest({
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
    <div>
      {/* RIASEC Overview */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Brain className="h-8 w-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Hệ Thống Điểm RIASEC</h4>
            <p className="text-sm text-blue-800 mb-3">
              Mỗi học sinh sẽ có điểm cho 6 loại tính cách: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">R - Realistic (Thực tế)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">I - Investigative (Nghiên cứu)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs">A - Artistic (Nghệ thuật)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">S - Social (Xã hội)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">E - Enterprising (Doanh nghiệp)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">C - Conventional (Truyền thống)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h3>Hồ Sơ Kết Quả RIASEC ({selectedTest.results.length})</h3>
        <Button onClick={handleAddResult}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Hồ Sơ Kết Quả
        </Button>
      </div>

      <div className="space-y-4">
        {selectedTest.results.map((result, index) => (
          <Card key={result.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Tiêu Đề Kết Quả {index + 1}</Label>
                      <Input
                        value={result.title}
                        onChange={(e) => handleUpdateResult(result.id, { title: e.target.value })}
                        placeholder="Ví dụ: Nhóm Realistic (Thực tế)"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Loại RIASEC</Label>
                      <Select 
                        value={result.riasecType}
                        onValueChange={(value) => handleUpdateResult(result.id, { riasecType: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic (Thực tế)</SelectItem>
                          <SelectItem value="investigative">Investigative (Nghiên cứu)</SelectItem>
                          <SelectItem value="artistic">Artistic (Nghệ thuật)</SelectItem>
                          <SelectItem value="social">Social (Xã hội)</SelectItem>
                          <SelectItem value="enterprising">Enterprising (Doanh nghiệp)</SelectItem>
                          <SelectItem value="conventional">Conventional (Truyền thống)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Màu Sắc</Label>
                      <Select 
                        value={result.color}
                        onValueChange={(value) => handleUpdateResult(result.id, { color: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Xanh Dương</SelectItem>
                          <SelectItem value="green">Xanh Lá</SelectItem>
                          <SelectItem value="red">Đỏ</SelectItem>
                          <SelectItem value="purple">Tím</SelectItem>
                          <SelectItem value="orange">Cam</SelectItem>
                          <SelectItem value="yellow">Vàng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* RIASEC Score Information */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">Thông Tin Điểm RIASEC</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs">
                      <div><Badge variant="outline">R: Realistic</Badge></div>
                      <div><Badge variant="outline">I: Investigative</Badge></div>
                      <div><Badge variant="outline">A: Artistic</Badge></div>
                      <div><Badge variant="outline">S: Social</Badge></div>
                      <div><Badge variant="outline">E: Enterprising</Badge></div>
                      <div><Badge variant="outline">C: Conventional</Badge></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Kết quả này sẽ được hiển thị khi điểm {result.riasecType} của học sinh nằm trong khoảng {result.minScore || 0} - {result.maxScore || 100}
                    </p>
                  </div>

                  <div>
                    <Label>Mô Tả Kết Quả</Label>
                    <Textarea
                      value={result.description}
                      onChange={(e) => handleUpdateResult(result.id, { description: e.target.value })}
                      placeholder="Mô tả chi tiết về nhóm tính cách này..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Điểm Tối Thiểu cho {result.riasecType?.charAt(0).toUpperCase() + result.riasecType?.slice(1) || 'RIASEC'}</Label>
                      <Input
                        type="number"
                        value={result.minScore || 0}
                        onChange={(e) => handleUpdateResult(result.id, { 
                          minScore: Number(e.target.value)
                        })}
                        className="mt-2"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label>Điểm Tối Đa cho {result.riasecType?.charAt(0).toUpperCase() + result.riasecType?.slice(1) || 'RIASEC'}</Label>
                      <Input
                        type="number"
                        value={result.maxScore || 100}
                        onChange={(e) => handleUpdateResult(result.id, { 
                          maxScore: Number(e.target.value)
                        })}
                        className="mt-2"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Gợi Ý Ngành Học ({result.recommendations.length})</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddRecommendation(result.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Thêm Gợi Ý
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {result.recommendations.map((recommendation, recIndex) => (
                        <div key={recIndex} className="flex items-center gap-2">
                          <Input
                            value={recommendation}
                            onChange={(e) => handleUpdateRecommendation(result.id, recIndex, e.target.value)}
                            placeholder="Tên ngành học hoặc lĩnh vực..."
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRecommendation(result.id, recIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {result.recommendations.length === 0 && (
                        <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">
                            Chưa có gợi ý ngành học
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddRecommendation(result.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm Gợi Ý Đầu Tiên
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteResult(result.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {selectedTest.results.length === 0 && (
          <Card className="p-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="mb-2">Chưa Có Hồ Sơ Kết Quả RIASEC</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Tạo các hồ sơ kết quả cho từng loại tính cách RIASEC. Mỗi hồ sơ sẽ được hiển thị dựa trên điểm số cao nhất của học sinh.
            </p>
            <Button onClick={handleAddResult}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Hồ Sơ Kết Quả Đầu Tiên
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
