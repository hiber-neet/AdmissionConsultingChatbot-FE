import { useNavigate } from 'react-router-dom';
import { ContentOptimization } from '../../components/consultant/ContentOptimization';

export function ConsultantOptimizationPage() {
  const navigate = useNavigate();

  const handleNavigateToKnowledgeBase = (question: string) => {
    // Navigate to templates page with the question
    navigate('/consultant/templates', { state: { question, action: 'add' } });
  };

  const handleNavigateToAnalytics = () => {
    navigate('/consultant/analytics');
  };

  return (
    <ContentOptimization 
      onNavigateToKnowledgeBase={handleNavigateToKnowledgeBase}
      onNavigateToAnalytics={handleNavigateToAnalytics}
    />
  );
}