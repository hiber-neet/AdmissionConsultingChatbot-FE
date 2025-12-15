import { Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/system_users/dialog';
import { Badge } from '../../ui/system_users/badge';
import { Separator } from '../../ui/system_users/separator';

export function QADetailDialog({ isQADialogOpen, setIsQADialogOpen, selectedQA }) {
  return (
    <Dialog open={isQADialogOpen} onOpenChange={setIsQADialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi Tiết Câu Hỏi & Trả Lời</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về mẫu câu hỏi và câu trả lời
          </DialogDescription>
        </DialogHeader>
        {selectedQA && (
          <div className="space-y-4 py-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Câu Hỏi</div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="font-medium">{selectedQA.question}</p>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Câu Trả Lời</div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-sm leading-relaxed">{selectedQA.answer}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Danh Mục</div>
                <Badge variant="secondary">{selectedQA.category}</Badge>
              </div>
              <div>
                
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Thời gian tạo:</span>{' '}
                <span className="font-medium">
                  {new Date(selectedQA.lastModified).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QADetailDialog;