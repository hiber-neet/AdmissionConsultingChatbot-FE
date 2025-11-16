import { FileText, Eye, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Badge } from '../../ui/system_users/badge';
import { Button } from '../../ui/system_users/button';
import { Separator } from '../../ui/system_users/separator';

export function DocumentList({ filteredDocuments }) {
  if (filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy tài liệu nào.</p>
            <p className="text-sm">Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredDocuments.map((doc) => (
        <Card key={doc.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base mb-1">{doc.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {doc.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{doc.fileType}</span>
                <span>•</span>
                <span>{doc.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{doc.viewCount}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{doc.category}</Badge>
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Tải lên: {new Date(doc.uploadedDate).toLocaleDateString('vi-VN')}
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Eye className="h-4 w-4" />
              Xem Tài Liệu
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DocumentList;