import { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { consultantAnalyticsAPI, UnansweredQuestion, IntentAskedStatistic } from '../../../services/fastapi';
import { CategoryInterestSection } from './CategoryInterestSection';
import { KnowledgeGapsSection } from './KnowledgeGapsSection';

interface AnalyticsStatisticsProps {
  onNavigateToKnowledgeBase?: (question: string) => void;
}

export function AnalyticsStatistics({ onNavigateToKnowledgeBase }: AnalyticsStatisticsProps = {}) {
  // Intent statistics state
  const [intentStats, setIntentStats] = useState<IntentAskedStatistic[]>([]);
  const [intentStatsLoading, setIntentStatsLoading] = useState(false);
  const [intentStatsError, setIntentStatsError] = useState<string | null>(null);

  // Unanswered questions state
  const [unansweredQuestions, setUnansweredQuestions] = useState<UnansweredQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // Fetch intent asked statistics
  useEffect(() => {
    const fetchIntentStats = async () => {
      try {
        setIntentStatsLoading(true);
        setIntentStatsError(null);
        const response = await consultantAnalyticsAPI.getIntentAskedStatistics();
        setIntentStats(response?.data || []);
      } catch (err: any) {
        setIntentStatsError(err.response?.data?.detail || 'Failed to fetch intent statistics');
      } finally {
        setIntentStatsLoading(false);
      }
    };

    fetchIntentStats();
  }, []);

  // Fetch unanswered questions (from new endpoint)
  useEffect(() => {
    const fetchUnansweredQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError(null);
        // Call the new unanswered-questions endpoint
        const response = await consultantAnalyticsAPI.getUnansweredQuestions(100);
        
        setUnansweredQuestions(response?.data || []);
      } catch (err: any) {
        setQuestionsError(err.response?.data?.detail || 'Failed to fetch unanswered questions');
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchUnansweredQuestions();
  }, []);

  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân Tích Chatbot</h1>
        </div>

        {/* Category Section (displays intent asked statistics) */}
        <CategoryInterestSection 
          intentStats={intentStats}
          loading={intentStatsLoading}
          error={intentStatsError}
        />

        {/* Unanswered Questions */}
        <KnowledgeGapsSection 
          unansweredQuestions={unansweredQuestions}
          loading={questionsLoading}
          error={questionsError}
        />
      </div>
    </ScrollArea>
  );
}
