import { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { consultantAnalyticsAPI, UserQuestion, IntentAskedStatistic } from '../../../services/fastapi';
import { CategoryInterestSection } from './CategoryInterestSection';
import { KnowledgeGapsSection } from './KnowledgeGapsSection';
import { TrendingTopicsSection } from './TrendingTopicsSection';

interface AnalyticsStatisticsProps {
  onNavigateToKnowledgeBase?: (question: string) => void;
}

export function AnalyticsStatistics({ onNavigateToKnowledgeBase }: AnalyticsStatisticsProps = {}) {
  // Intent statistics state
  const [intentStats, setIntentStats] = useState<IntentAskedStatistic[]>([]);
  const [intentStatsLoading, setIntentStatsLoading] = useState(false);
  const [intentStatsError, setIntentStatsError] = useState<string | null>(null);

  // Unanswered questions state
  const [unansweredQuestions, setUnansweredQuestions] = useState<UserQuestion[]>([]);
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

  // Fetch unanswered questions (status='unanswered')
  useEffect(() => {
    const fetchUnansweredQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setQuestionsError(null);
        // Get all questions from the last 30 days with large page size
        const response = await consultantAnalyticsAPI.getUserQuestions(30, 1, 100);
        
        // Filter to only unanswered questions and sort by most recent
        const unanswered = (response?.data || [])
          .filter((q: UserQuestion) => q.status === 'unanswered')
          .sort((a: UserQuestion, b: UserQuestion) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          });
        
        setUnansweredQuestions(unanswered);
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

        {/* Trending Topics (displays intent statistics with description) */}
        <TrendingTopicsSection 
          intentStats={intentStats}
          loading={intentStatsLoading}
          error={intentStatsError}
        />
      </div>
    </ScrollArea>
  );
}
