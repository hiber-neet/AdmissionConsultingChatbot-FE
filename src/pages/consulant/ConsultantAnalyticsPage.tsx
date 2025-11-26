import { useNavigate } from 'react-router-dom';
import { AnalyticsStatistics } from '../../components/consultant/AnalyticsStatistics';

export function ConsultantAnalyticsPage() {
  const navigate = useNavigate();

  const handleNavigateToTemplates = (question?: string, action?: 'edit' | 'add' | 'view') => {
    // Navigate to templates page, could pass state if needed
    navigate('/consultant/templates', { state: { question, action } });
  };

  return <AnalyticsStatistics onNavigateToTemplates={handleNavigateToTemplates} />;
}