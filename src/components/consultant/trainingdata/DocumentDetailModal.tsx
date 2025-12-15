import { useState } from 'react';
import { X, Edit, Trash2, Download, Loader2 } from 'lucide-react';
import { TrainingDocument, Intent } from './types';
import { Input } from '../../ui/system_users/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/system_users/select';
import { Button } from '../../ui/system_users/button';
import { API_CONFIG } from '../../../config/api';

interface DocumentDetailModalProps {
  document: TrainingDocument;
  intents: Intent[];
  isLeader: boolean;
  onClose: () => void;
  onUpdate: (documentId: number, data: { title: string; intent_id?: number; category?: string }) => Promise<void>;
  onDelete: (documentId: number) => Promise<void>;
  onApprove?: (documentId: number) => Promise<void>;
  onReject?: (documentId: number) => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function DocumentDetailModal({
  document,
  intents,
  isLeader,
  onClose,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false
}: DocumentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(document.title);
  const [editedIntentId, setEditedIntentId] = useState<number | undefined>(document.intent_id);
  const [editedCategory, setEditedCategory] = useState(document.category || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(document.document_id, {
        title: editedTitle,
        intent_id: editedIntentId,
        category: editedCategory
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      setLoading(true);
      await onDelete(document.document_id);
      onClose();
    } catch (error) {
      console.error('Failed to delete document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setLoading(true);
      await onApprove(document.document_id);
    } catch (error) {
      console.error('Failed to approve document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    try {
      setLoading(true);
      await onReject(document.document_id);
    } catch (error) {
      console.error('Failed to reject document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadUrl = `${API_CONFIG.BASE_URL}/knowledge/documents/${document.document_id}/download`;
    window.open(downloadUrl, '_blank');
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
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
            <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Tài Liệu</h2>
            {getStatusBadge(document.status)}
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu Đề
            </label>
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Nhập tiêu đề tài liệu..."
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg font-medium">
                {document.title}
              </p>
            )}
          </div>

          {/* Intent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intent
            </label>
            {isEditing ? (
              <Select
                value={editedIntentId?.toString() || ''}
                onValueChange={(value) => setEditedIntentId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn intent" />
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
                {document.intent_name || 'Chưa chọn intent'}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh Mục
            </label>
            {isEditing ? (
              <Input
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                placeholder="Nhập danh mục..."
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {document.category || 'Chưa có danh mục'}
              </p>
            )}
          </div>

          {/* File Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại File
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
              {document.file_type?.toUpperCase() || 'UNKNOWN'}
            </p>
          </div>

          {/* Document Content Preview */}
          {document.content && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội Dung
              </label>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {document.content.substring(0, 2000)}
                  {document.content.length > 2000 && '...'}
                </p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {document.created_at && (
              <div>
                <span className="text-sm text-gray-500">Ngày tạo:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(document.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
            {document.reviewed_at && (
              <div>
                <span className="text-sm text-gray-500">Ngày duyệt:</span>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(document.reviewed_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải Xuống
            </Button>
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
                    setEditedTitle(document.title);
                    setEditedIntentId(document.intent_id);
                    setEditedCategory(document.category || '');
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
                {isLeader && document.status === 'draft' && (
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
