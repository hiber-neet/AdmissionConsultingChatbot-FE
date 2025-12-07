import { 
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  Plus,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Button } from '../ui/system_users/button';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Badge } from '../ui/system_users/badge';
import { Progress } from '../ui/system_users/progress';
import { useState, useEffect } from 'react';
import { consultantAnalyticsAPI, KnowledgeGap, LowSatisfactionAnswer, TrendingTopic } from '../../services/fastapi';

export function ContentOptimization({ 
  onNavigateToKnowledgeBase,
  onNavigateToAnalytics 
}: { 
  onNavigateToKnowledgeBase?: (question: string) => void;
  onNavigateToAnalytics?: () => void;
}) {
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([]);
  const [confusingAnswers, setConfusingAnswers] = useState<LowSatisfactionAnswer[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states for each section
  const [gapsVisibleCount, setGapsVisibleCount] = useState(3);
  const [answersVisibleCount, setAnswersVisibleCount] = useState(3);
  const [topicsVisibleCount, setTopicsVisibleCount] = useState(3);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all analytics data in parallel using unified consultant analytics API
        const [gapsData, answersData, topicsData] = await Promise.all([
          consultantAnalyticsAPI.getKnowledgeGaps(),
          consultantAnalyticsAPI.getLowSatisfactionAnswers(),
          consultantAnalyticsAPI.getTrendingTopics()
        ]);
        
        setKnowledgeGaps(Array.isArray(gapsData) ? gapsData : gapsData?.data || []);
        setConfusingAnswers(Array.isArray(answersData) ? answersData : answersData?.data || []);
        setTrendingTopics(Array.isArray(topicsData) ? topicsData : topicsData?.data || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <ScrollArea className="min-h-screen h-full">
        <div className="p-6 pb-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Optimization Suggestions</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (error) {
    return (
      <ScrollArea className="min-h-screen h-full">
        <div className="p-6 pb-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Optimization Suggestions</h1>
            <p className="text-muted-foreground">Suggestions to improve chatbot coverage and quality</p>
          </div>
          <Card className="border-l-4 border-l-[#EF4444]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }
  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Optimization Suggestions</h1>
          <p className="text-muted-foreground">
            Suggestions to improve chatbot coverage and quality
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#EF4444]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl">{knowledgeGaps?.length || 0}</div>
                  <p className="text-sm text-muted-foreground mt-1">Knowledge Gaps</p>
                </div>
                <HelpCircle className="h-8 w-8 text-[#EF4444] opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#F59E0B]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl">{confusingAnswers?.length || 0}</div>
                  <p className="text-sm text-muted-foreground mt-1">Low-Rated Answers</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[#F59E0B] opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#10B981]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl">{trendingTopics?.length || 0}</div>
                  <p className="text-sm text-muted-foreground mt-1">Trending Topics</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#10B981] opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Gaps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#EF4444]" />
                  Gaps in Knowledge Base
                </CardTitle>
                <CardDescription className="mt-2">
                  Frequently asked questions without answers - prioritize adding these
                </CardDescription>
              </div>
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Action Required
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!knowledgeGaps || knowledgeGaps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No knowledge gaps identified at this time</p>
                <p className="text-sm">Your knowledge base appears to be comprehensive!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {knowledgeGaps.slice(0, gapsVisibleCount).map((gap) => (
                  <div
                    key={gap.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{gap.question}</h4>
                          <Badge variant="outline" className="text-xs">
                            {gap.intent_name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Asked <span className="font-semibold">{gap.frequency} times</span> in the last 30 days
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#3B82F6] hover:bg-[#2563EB]"
                        onClick={() => onNavigateToKnowledgeBase?.(gap.question)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Knowledge Base
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Show More Button for Knowledge Gaps */}
                {knowledgeGaps && gapsVisibleCount < knowledgeGaps.length && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setGapsVisibleCount(prev => Math.min(prev + 3, knowledgeGaps.length))}
                      className="flex items-center gap-2"
                    >
                      Show More ({Math.min(3, knowledgeGaps.length - gapsVisibleCount)} more items)
                    </Button>
                  </div>
                )}
                
                {/* Show Less Button when showing more than 3 */}
                {gapsVisibleCount > 3 && (
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setGapsVisibleCount(3)}
                      className="text-muted-foreground"
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confusing Answers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                  Low Satisfaction Answers
                </CardTitle>
                <CardDescription className="mt-2">
                  Q&A pairs that users frequently rate poorly - review and improve
                </CardDescription>
              </div>
              <Badge className="bg-[#F59E0B] hover:bg-[#D97706] gap-1">
                <AlertTriangle className="h-3 w-3" />
                Needs Review
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!confusingAnswers || confusingAnswers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50 text-green-500" />
                <p>No low satisfaction answers found!</p>
                <p className="text-sm">All your Q&A pairs are performing well.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {confusingAnswers.slice(0, answersVisibleCount).map((answer) => (
                  <div
                    key={answer.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">{answer.question}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Current Satisfaction</span>
                            <span className="font-semibold text-[#F59E0B]">
                              {answer.currentSatisfaction}/5.0
                            </span>
                          </div>
                          <Progress 
                            value={(answer.currentSatisfaction / 5) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Target</span>
                            <span className="font-semibold text-[#10B981]">
                              {answer.targetSatisfaction}/5.0
                            </span>
                          </div>
                          <Progress 
                            value={(answer.targetSatisfaction / 5) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm">
                        <strong>User Feedback:</strong> {answer.feedback}
                      </p>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                        <div className="h-5 w-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <strong>Improvement Suggestion:</strong> {answer.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
                        Edit Answer
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View User Feedback
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Show More Button for Low Satisfaction Answers */}
                {confusingAnswers && answersVisibleCount < confusingAnswers.length && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setAnswersVisibleCount(prev => Math.min(prev + 3, confusingAnswers.length))}
                      className="flex items-center gap-2"
                    >
                      Show More ({Math.min(3, confusingAnswers.length - answersVisibleCount)} more items)
                    </Button>
                  </div>
                )}
                
                {/* Show Less Button when showing more than 3 */}
                {answersVisibleCount > 3 && (
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setAnswersVisibleCount(3)}
                      className="text-muted-foreground"
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#10B981]" />
                  New Trending Topics
                </CardTitle>
                <CardDescription className="mt-2">
                  Emerging question topics that might need new Q&A entries
                </CardDescription>
              </div>
              <Badge className="bg-[#10B981] hover:bg-[#059669] gap-1">
                <TrendingUp className="h-3 w-3" />
                Opportunity
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!trendingTopics || trendingTopics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No trending topics detected</p>
                <p className="text-sm">Check back later for emerging question patterns.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingTopics.slice(0, topicsVisibleCount).map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{topic.topic}</h4>
                          <Badge className="bg-[#10B981] hover:bg-[#059669] gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{topic.growthRate}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-muted-foreground">Growth Rate:</div>
                          <Progress value={Math.min(topic.growthRate, 100)} className="flex-1 h-2" />
                          <div className="text-sm font-semibold text-[#10B981]">
                            {topic.growthRate}%
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">{topic.questionsCount} questions</span> asked in the {topic.timeframe || "last 14 days"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigateToAnalytics?.()}
                      >
                        View Questions
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Show More Button for Trending Topics */}
                {trendingTopics && topicsVisibleCount < trendingTopics.length && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setTopicsVisibleCount(prev => Math.min(prev + 3, trendingTopics.length))}
                      className="flex items-center gap-2"
                    >
                      Show More ({Math.min(3, trendingTopics.length - topicsVisibleCount)} more items)
                    </Button>
                  </div>
                )}
                
                {/* Show Less Button when showing more than 3 */}
                {topicsVisibleCount > 3 && (
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setTopicsVisibleCount(3)}
                      className="text-muted-foreground"
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
