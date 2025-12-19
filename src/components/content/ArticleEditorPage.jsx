import { useLocation } from 'react-router-dom';
import ArticleEditor from './ArticleEditor';

export function ArticleEditorPage() {
  const location = useLocation();
  
  // Get article data from navigation state if available
  const initialData = location.state || null;

  return (
    <ArticleEditor initialData={initialData} />
  );
}