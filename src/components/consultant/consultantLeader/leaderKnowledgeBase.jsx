import { useState } from 'react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { Button } from '../../ui/system_users/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/system_users/tabs';
import { MessageCircle, FileText, Check, X } from 'lucide-react';

// Temporary data structure for draft requests
const draftRequests = {
  qaTemplates: [
    {
      id: 1,
      type: 'qa',
      title: 'New Admission Deadline Question',
      category: 'Admission Requirements',
      content: {
        question: 'What are the application deadlines for Spring 2026?',
        answer: 'For Spring 2026 admission, the deadlines are: Early Decision - October 1, 2025; Regular Decision - November 15, 2025.'
      },
      requestedBy: 'Sarah Chen',
      requestDate: '2025-10-25',
      status: 'pending'
    },
    {
      id: 2,
      type: 'qa',
      title: 'Updated Financial Aid Information',
      category: 'Financial Aid',
      content: {
        question: 'What are the new FAFSA requirements for 2026?',
        answer: 'The new FAFSA requirements for 2026 include simplified income reporting and expanded eligibility criteria.'
      },
      requestedBy: 'John Smith',
      requestDate: '2025-10-26',
      status: 'pending'
    }
  ],
  documents: [
    {
      id: 3,
      type: 'document',
      title: 'Updated Housing Guide 2026',
      category: 'Campus Life',
      content: {
        fileSize: '2.8 MB',
        fileType: 'pdf',
        description: 'Comprehensive guide to on-campus housing options and policies.'
      },
      requestedBy: 'Emily Johnson',
      requestDate: '2025-10-27',
      status: 'pending'
    }
  ]
};

export function LeaderKnowledgeBase() {
  const [activeTab, setActiveTab] = useState('qa');
  
  const handleApprove = (id, type) => {
    // Approval logic would go here
    console.log('Approved:', id, type);
  };

  const handleReject = (id, type) => {
    // Rejection logic would go here
    console.log('Rejected:', id, type);
  };

  const RequestCard = ({ request }) => {
    const isQA = request.type === 'qa';

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isQA ? (
              <MessageCircle className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <h3 className="font-medium">{request.title}</h3>
              <p className="text-sm text-muted-foreground">
                {request.category} • Requested by {request.requestedBy}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {request.requestDate}
          </p>
        </div>

        <div className="mb-4">
          {isQA ? (
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">Question:</div>
                <p className="text-sm text-gray-700">{request.content.question}</p>
              </div>
              <div>
                <div className="text-sm font-medium">Answer:</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {request.content.answer}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium">File Details:</div>
                <p className="text-sm text-gray-700">
                  {request.content.fileType.toUpperCase()} • {request.content.fileSize}
                </p>
              </div>
              <div>
                <div className="text-sm font-medium">Description:</div>
                <p className="text-sm text-gray-700">
                  {request.content.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => handleReject(request.id, request.type)}
          >
            <X className="h-4 w-4" />Từ Chối</Button>
          <Button 
            size="sm"
            className="gap-2"
            onClick={() => handleApprove(request.id, request.type)}
          >
            <Check className="h-4 w-4" />Phê Duyệt</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen h-full p-6 bg-[#F8FAFC]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Knowledge Base Review</h1>
        <p className="text-muted-foreground">
          Review and manage draft requests from consultants
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="qa" className="gap-2">
            <MessageCircle className="h-4 w-4" />Mẫu Q&A<span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
              {draftRequests.qaTemplates.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
            <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
              {draftRequests.documents.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qa" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {draftRequests.qaTemplates.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {draftRequests.documents.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
