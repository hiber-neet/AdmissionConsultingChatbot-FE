import { MessageCircle, FileText } from 'lucide-react';
import { TabType } from './types';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  questionCount?: number;
  documentCount?: number;
}

export function TabSwitcher({ activeTab, onTabChange, questionCount = 0, documentCount = 0 }: TabSwitcherProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onTabChange('questions')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'questions'
            ? 'bg-[#EB5A0D] text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Câu Hỏi Huấn Luyện</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === 'questions' ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {questionCount}
        </span>
      </button>

      <button
        onClick={() => onTabChange('documents')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          activeTab === 'documents'
            ? 'bg-[#EB5A0D] text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <FileText className="h-5 w-5" />
        <span>Tài Liệu</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === 'documents' ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {documentCount}
        </span>
      </button>
    </div>
  );
}
