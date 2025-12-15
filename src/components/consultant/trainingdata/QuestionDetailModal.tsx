import { useState } from 'react';
import { X, Edit, Trash2, Loader2 } from 'lucide-react';
import { TrainingQuestion, Intent } from './types';
import { Textarea } from '../../ui/system_users/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/system_users/select';
import { Button } from '../../ui/system_users/button';

interface QuestionDetailModalProps {
  question: TrainingQuestion;
  intents: Intent[];
  isLeader: boolean;
  onClose: () => void;
  onUpdate: (questionId: number, data: { question: string; answer: string; intent_id?: number }) => Promise<void>;
  onDelete: (questionId: number) => Promise<void>;
  onApprove?: (questionId: number) => Promise<void>;
  onReject?: (questionId: number) => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function QuestionDetailModal({
  question,
  intents,
  isLeader,
  onClose,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false
}: QuestionDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedAnswer, setEditedAnswer] = useState(question.answer);
  const [editedIntentId, setEditedIntentId] = useState<number | undefined>(question.intent_id);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(question.question_id, {
        question: editedQuestion,
        answer: editedAnswer,
        intent_id: editedIntentId
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      setLoading(true);
      await onDelete(question.question_id);
      onClose();
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setLoading(true);
      await onApprove(question.question_id);
    } catch (error) {
      console.error('Failed to approve question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    try {
      setLoading(true);
      await onReject(question.question_id);
    } catch (error) {
      console.error('Failed to reject question:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Nháp' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Đã duyệt' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Từ chối' },
      deleted: { color: 'bg-gray-100 text-gray-800', label: 'Đã xóa' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Câu Hỏi</h2>
            {getStatusBadge(question.status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Intent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            {isEditing ? (
              <Select
                value={editedIntentId?.toString() || ''}
                onValueChange={(value) => setEditedIntentId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {intents.map((intent) => (
                    <SelectItem key={intent.intent_id} value={intent.intent_id.toString()}>
                      {intent.intent_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {question.intent_name || 'Chưa chọn intent'}
              </p>
            )}
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu Hỏi
            </label>
            {isEditing ? (
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="min-h-[100px]"
                placeholder="Nhập câu hỏi..."
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {question.question}
              </p>
            )}
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu Trả Lời
            </label>
            {isEditing ? (
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                className="min-h-[200px]"
                placeholder="Nhập câu trả lời..."
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {question.answer}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {question.created_at && (
              <div>
                <span className="text-sm text-gray-500">Ngày tạo:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(question.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
            {question.approved_at && (
              <div>
                <span className="text-sm text-gray-500">Ngày duyệt:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(question.approved_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="text-red-600 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedQuestion(question.question);
                    setEditedAnswer(question.answer);
                    setEditedIntentId(question.intent_id);
                  }}
                  variant="outline"
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#EB5A0D] hover:bg-[#d14f0a]"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </>
            ) : (
              <>
                {isLeader && question.status === 'draft' && (
                  <>
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      disabled={loading || isApproving || isRejecting}
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Từ chối'
                      )}
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={loading || isApproving || isRejecting}
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang duyệt...
                        </>
                      ) : (
                        'Duyệt'
                      )}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#EB5A0D] hover:bg-[#d14f0a]"
                  disabled={isApproving || isRejecting}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh Sửa
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
