import { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { consultantAnalyticsAPI, UserQuestion, intentAPI } from '../../../services/fastapi';
import { Intent } from '../../../utils/fastapi-client';
import { CategoryInterestSection } from './CategoryInterestSection';
import { KnowledgeGapsSection } from './KnowledgeGapsSection';
import { TrendingTopicsSection } from './TrendingTopicsSection';

interface AnalyticsStatisticsProps {
  onNavigateToKnowledgeBase?: (question: string) => void;
}

export function AnalyticsStatistics({ onNavigateToKnowledgeBase }: AnalyticsStatisticsProps = {}) {
  // Intent state
  const [intents, setIntents] = useState<Intent[]>([]);
  const [intentsLoading, setIntentsLoading] = useState(false);
  const [intentsError, setIntentsError] = useState<string | null>(null);

  // Unanswered questions state
  const [unansweredQuestions, setUnansweredQuestions] = useState<UserQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // Fetch all intents
  useEffect(() => {
    const fetchIntents = async () => {
      try {
        setIntentsLoading(true);
        setIntentsError(null);
        const response = await intentAPI.getIntents();
        setIntents(Array.isArray(response) ? response : []);
      } catch (err: any) {
        console.error('Error fetching intents:', err);
        setIntentsError(err.response?.data?.detail || 'Failed to fetch intents');
      } finally {
        setIntentsLoading(false);
      }
    };

    fetchIntents();
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
        console.error('Error fetching unanswered questions:', err);
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

        {/* Category Section (displays all intents) */}
        <CategoryInterestSection 
          intents={intents}
          loading={intentsLoading}
          error={intentsError}
        />

        {/* Unanswered Questions */}
        <KnowledgeGapsSection 
          unansweredQuestions={unansweredQuestions}
          loading={questionsLoading}
          error={questionsError}
        />

        {/* Trending Topics (displays all intents with description) */}
        <TrendingTopicsSection 
          intents={intents}
          loading={intentsLoading}
          error={intentsError}
        />
      </div>
    </ScrollArea>
  );
}
