import { useLocation } from 'react-router-dom';
import { QATemplateManagement } from '../../components/consultant/QATemplateManagement';

export function ConsultantTemplatesPage() {
  const location = useLocation();
  const state = location.state as { question?: string; action?: 'edit' | 'add' | 'view' } | null;

  const handleQuestionUsed = () => {
    // Clear the state after question is used
    window.history.replaceState(null, '', location.pathname);
  };

  return (
    <QATemplateManagement
      prefilledQuestion={state?.question || null}
      templateAction={state?.action || null}
      onQuestionUsed={handleQuestionUsed}
    />
  );
}