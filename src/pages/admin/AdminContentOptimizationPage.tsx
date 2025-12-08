import { useNavigate } from 'react-router-dom';
import { ContentOptimization } from '../../components/consultant/ContentOptimization';

export function AdminContentOptimizationPage() {
  const navigate = useNavigate();

  const handleNavigateToAnalytics = () => {
    navigate('/admin/analytics');
  };

  return <ContentOptimization onNavigateToAnalytics={handleNavigateToAnalytics} />;
}