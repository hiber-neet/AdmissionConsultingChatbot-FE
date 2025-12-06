import { Eye, BookOpen, Tag, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Badge } from '../../ui/system_users/badge';
import { Button } from '../../ui/system_users/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/system_users/tabs';
import DocumentList from './DocumentList';

export function QATemplateList({ filteredQATemplates, filteredDocuments, handleViewQA }) {
  return (
    <Tabs defaultValue="qa" className="space-y-4">
      <TabsList>
        <TabsTrigger value="qa">
          Câu Hỏi & Trả Lời ({filteredQATemplates.length})
        </TabsTrigger>
        <TabsTrigger value="docs">
          Tài Liệu ({filteredDocuments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="qa" className="space-y-4">
        {filteredQATemplates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy mẫu câu hỏi nào.</p>
                <p className="text-sm">Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredQATemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{template.question}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.answer}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewQA(template)}
                    className="gap-2 flex-shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                    Xem
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  {template.tags && template.tags.length > 0 && template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  <div className="ml-auto text-sm text-muted-foreground">
                    <span>Cập nhật {new Date(template.lastModified).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="docs" className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy tài liệu nào.</p>
                <p className="text-sm">Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DocumentList filteredDocuments={filteredDocuments} />
        )}
      </TabsContent>
    </Tabs>
  );
}

export default QATemplateList;