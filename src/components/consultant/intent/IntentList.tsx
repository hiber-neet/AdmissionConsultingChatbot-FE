import { Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Card } from '../../ui/system_users/card';
import { Intent } from '../../../utils/fastapi-client';

interface IntentListProps {
  intents: Intent[];
  onEdit: (intent: Intent) => void;
  onDelete: (intent: Intent) => void;
  isLeader: boolean;
}

export function IntentList({ intents, onEdit, onDelete, isLeader }: IntentListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {intents.map((intent) => (
        <Card key={intent.intent_id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Tag className="h-4 w-4 text-[#EB5A0D]" />
              </div>
              <h3 className="font-semibold text-gray-900">{intent.intent_name}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(intent)}
                className="h-8 w-8 p-0"
                title="Chỉnh sửa"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {isLeader && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(intent)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {intent.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {intent.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>ID: {intent.intent_id}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
