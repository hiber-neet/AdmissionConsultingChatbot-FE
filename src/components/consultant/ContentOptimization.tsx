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

const knowledgeGaps = [
  {
    id: 1,
    question: 'What are the housing options for international students?',
    frequency: 28,
    priority: 'high',
    category: 'Campus Life',
    suggestedAction: 'Create comprehensive housing guide for international students',
  },
  {
    id: 2,
    question: 'Can I defer my admission to next semester?',
    frequency: 22,
    priority: 'high',
    category: 'Admissions',
    suggestedAction: 'Add deferment policy details to knowledge base',
  },
  {
    id: 3,
    question: 'What is the policy for transfer credits?',
    frequency: 18,
    priority: 'medium',
    category: 'Academic',
    suggestedAction: 'Document transfer credit evaluation process',
  },
  {
    id: 4,
    question: 'Are there part-time MBA programs available?',
    frequency: 15,
    priority: 'medium',
    category: 'Programs',
    suggestedAction: 'Add part-time and executive program information',
  },
];

const confusingAnswers = [
  {
    id: 1,
    question: 'What GPA do I need for admission?',
    currentSatisfaction: 3.2,
    targetSatisfaction: 4.5,
    feedback: 'Users report answer is too vague',
    suggestion: 'Provide GPA ranges by program and include context about holistic review',
  },
  {
    id: 2,
    question: 'How long does the application review take?',
    currentSatisfaction: 3.5,
    targetSatisfaction: 4.5,
    feedback: 'Timeline information is unclear',
    suggestion: 'Add specific timelines for each decision type (ED, RD, Transfer)',
  },
  {
    id: 3,
    question: 'What are the English proficiency requirements?',
    currentSatisfaction: 3.8,
    targetSatisfaction: 4.5,
    feedback: 'Missing exemption criteria',
    suggestion: 'Include exemptions and alternative proof of English proficiency',
  },
];

const trendingTopics = [
  {
    id: 1,
    topic: 'Study Abroad Programs',
    growthRate: 85,
    questionsCount: 45,
    description: 'Rapid increase in questions about international exchange and semester abroad options',
    action: 'Create dedicated section for study abroad opportunities',
  },
  {
    id: 2,
    topic: 'AI and Computer Science Programs',
    growthRate: 67,
    questionsCount: 38,
    description: 'Growing interest in AI-focused curriculum and research opportunities',
    action: 'Highlight AI specializations and research labs',
  },
  {
    id: 3,
    topic: 'Sustainability Initiatives',
    growthRate: 52,
    questionsCount: 29,
    description: 'Students asking about campus sustainability and environmental programs',
    action: 'Document green initiatives and environmental studies programs',
  },
  {
    id: 4,
    topic: 'Mental Health Resources',
    growthRate: 48,
    questionsCount: 24,
    description: 'Increased inquiries about counseling services and wellness support',
    action: 'Expand mental health and wellness resource information',
  },
];

export function ContentOptimization({ onNavigateToKnowledgeBase }: { onNavigateToKnowledgeBase?: (question: string) => void }) {
  return (
    <ScrollArea className="min-h-screen h-full">
      <div className="p-6 pb-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Optimization Suggestions</h1>
          <p className="text-muted-foreground">
            AI-powered recommendations to improve chatbot coverage and quality
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#EF4444]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl">{knowledgeGaps.length}</div>
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
                  <div className="text-3xl">{confusingAnswers.length}</div>
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
                  <div className="text-3xl">{trendingTopics.length}</div>
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
            <div className="space-y-4">
              {knowledgeGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{gap.question}</h4>
                        <Badge 
                          variant={gap.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {gap.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {gap.category}
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
            </div>
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
            <div className="space-y-4">
              {confusingAnswers.map((answer) => (
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
            </div>
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
            <div className="space-y-4">
              {trendingTopics.map((topic) => (
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
                        <Progress value={topic.growthRate} className="flex-1 h-2" />
                        <div className="text-sm font-semibold text-[#10B981]">
                          {topic.growthRate}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">{topic.questionsCount} questions</span> asked in the last 14 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md mb-3">
                    <div className="h-5 w-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <strong>Recommended Action:</strong> {topic.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
                      <Plus className="h-4 w-4 mr-1" />
                      Create Content
                    </Button>
                    <Button size="sm" variant="outline">
                      View Questions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
