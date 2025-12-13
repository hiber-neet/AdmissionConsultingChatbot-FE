import { useState, useEffect } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { consultantAnalyticsAPI, CategoryStatistic, KnowledgeGap, TrendingTopic } from '../../../services/fastapi';
import { CategoryInterestSection } from './CategoryInterestSection';
import { KnowledgeGapsSection } from './KnowledgeGapsSection';
import { TrendingTopicsSection } from './TrendingTopicsSection';

interface AnalyticsStatisticsProps {
  onNavigateToKnowledgeBase?: (question: string) => void;
}

export function AnalyticsStatistics({ onNavigateToKnowledgeBase }: AnalyticsStatisticsProps = {}) {
  // API state for category stats
  const [categoryStats, setCategoryStats] = useState<CategoryStatistic[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // API state for knowledge gaps and trending topics
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [gapsLoading, setGapsLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [gapsError, setGapsError] = useState<string | null>(null);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // Fetch category statistics (not affected by date range filter)
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError(null);
        const response = await consultantAnalyticsAPI.getCategoryStatistics(30); // Always 30 days for categories
        setCategoryStats(Array.isArray(response) ? response : response?.data || []);
      } catch (err: any) {
        console.error('Error fetching category statistics:', err);
        setCategoryError(err.response?.data?.detail || 'Failed to fetch category statistics');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryStats();
  }, []);

  // Fetch knowledge gaps
  useEffect(() => {
    const fetchKnowledgeGaps = async () => {
      try {
        setGapsLoading(true);
        setGapsError(null);
        const response = await consultantAnalyticsAPI.getKnowledgeGaps();
        setKnowledgeGaps(Array.isArray(response) ? response : response?.data || []);
      } catch (err: any) {
        console.error('Error fetching knowledge gaps:', err);
        setGapsError(err.response?.data?.detail || 'Failed to fetch knowledge gaps');
      } finally {
        setGapsLoading(false);
      }
    };

    fetchKnowledgeGaps();
  }, []);

  // Fetch trending topics
  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        setTopicsLoading(true);
        setTopicsError(null);
        const response = await consultantAnalyticsAPI.getTrendingTopics();
        setTrendingTopics(Array.isArray(response) ? response : response?.data || []);
      } catch (err: any) {
        console.error('Error fetching trending topics:', err);
        setTopicsError(err.response?.data?.detail || 'Failed to fetch trending topics');
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân Tích Chatbot</h1>
        </div>

        {/* Category Interest Section */}
        <CategoryInterestSection 
          categoryStats={categoryStats}
          loading={categoryLoading}
          error={categoryError}
        />

        {/* Knowledge Gaps */}
        <KnowledgeGapsSection 
          knowledgeGaps={knowledgeGaps}
          loading={gapsLoading}
          error={gapsError}
          onNavigateToKnowledgeBase={onNavigateToKnowledgeBase}
        />

        {/* Trending Topics */}
        <TrendingTopicsSection 
          trendingTopics={trendingTopics}
          loading={topicsLoading}
          error={topicsError}
        />
      </div>
    </ScrollArea>
  );
}
