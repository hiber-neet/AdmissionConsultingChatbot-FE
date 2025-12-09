import { FileText, Download, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/system_users/card';
import { Badge } from '../../ui/system_users/badge';
import { Button } from '../../ui/system_users/button';
import { Separator } from '../../ui/system_users/separator';
import { knowledgeAPI } from '../../../services/fastapi';
import { toast } from 'react-toastify';

export function DocumentList({ filteredDocuments }) {
  const handleDownload = async (doc) => {
    try {
      // Use the proper API call with authentication
      const blob = await knowledgeAPI.downloadDocument(doc.document_id);
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.title || `document-${doc.document_id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Tải tài liệu thành công!');
    } catch (error) {
      console.error('Failed to download document:', error);
      console.error('Error type:', typeof error);
      console.error('Error stringified:', JSON.stringify(error, null, 2));
      
      // Better error message extraction
      let errorMessage = 'Failed to download document. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.detail) {
        errorMessage = error.detail;
      }
      
      toast.error(`Failed to download: ${errorMessage}`);
    }
  };
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
                {doc.description && (
                  <CardDescription className="text-sm line-clamp-2">
                    {doc.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Separator />
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{doc.fileType}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{doc.category}</Badge>
              {doc.tags && doc.tags.length > 0 && doc.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Tải lên: {new Date(doc.uploadedDate).toLocaleDateString('vi-VN')}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => handleDownload(doc)}
            >
              <Download className="h-4 w-4" />
              Tải Xuống
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DocumentList;