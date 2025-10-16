import { useState } from 'react';
import {
  MessageCircle,
  User,
  Clock,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  X,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Input } from '../ui/system_users/input';
import { Badge } from '../ui/system_users/badge';
import { Avatar, AvatarFallback } from '../ui/system_users/avatar';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import { Textarea } from '../ui/system_users/textarea';

interface LiveConsultationProps {
  isPanel?: boolean;
}

const waitingQueue = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    type: 'international' as const,
    topic: 'Học bổng',
    waitTime: 2,
    avatar: 'NVA',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    type: 'domestic' as const,
    topic: 'Visa',
    waitTime: 5,
    avatar: 'TTB',
  },
  {
    id: 3,
    name: 'Lê Minh Cường',
    type: 'domestic' as const,
    topic: 'Chương trình MBA',
    waitTime: 8,
    avatar: 'LMC',
  },
  {
    id: 4,
    name: 'Phạm Thu Dung',
    type: 'international' as const,
    topic: 'Yêu cầu tuyển sinh',
    waitTime: 10,
    avatar: 'PTD',
  },
  {
    id: 5,
    name: 'Hoàng Văn Em',
    type: 'domestic' as const,
    topic: 'Học phí',
    waitTime: 12,
    avatar: 'HVE',
  },
];

const activeChats = [
  {
    id: 1,
    name: 'Vũ Thị Hoa',
    type: 'international' as const,
    topic: 'Hồ sơ tuyển sinh',
    duration: 15,
    avatar: 'VTH',
  },
  {
    id: 2,
    name: 'Đặng Quốc Khải',
    type: 'domestic' as const,
    topic: 'Chuyển trường',
    duration: 8,
    avatar: 'DQK',
  },
];

const messages = [
  {
    id: 1,
    sender: 'student' as const,
    content: 'Xin chào! Tôi muốn hỏi về quy trình xin visa du học.',
    timestamp: '14:32',
  },
  {
    id: 2,
    sender: 'officer' as const,
    content: 'Chào bạn! Tôi rất vui được hỗ trợ. Bạn đang quan tâm đến visa F-1 cho sinh viên phải không?',
    timestamp: '14:33',
  },
  {
    id: 3,
    sender: 'student' as const,
    content: 'Vâng đúng rồi ạ. Tôi cần chuẩn bị những giấy tờ gì?',
    timestamp: '14:34',
  },
  {
    id: 4,
    sender: 'officer' as const,
    content: 'Để xin visa F-1, bạn cần:\n1. Form I-20 từ trường (chúng tôi sẽ cấp sau khi nhận hồ sơ)\n2. Hộ chiếu còn hạn\n3. Chứng minh tài chính\n4. Bằng cấp học vấn\n\nBạn đã nhận được thư nhận học chưa?',
    timestamp: '14:35',
  },
  {
    id: 5,
    sender: 'student' as const,
    content: 'Tôi vừa nhận được thư nhận học tuần trước. Về chứng minh tài chính, cần bao nhiêu tiền ạ?',
    timestamp: '14:36',
  },
];

const quickResponses = [
  'Tôi sẽ kiểm tra thông tin và phản hồi lại bạn ngay.',
  'Bạn có thể gửi tài liệu qua email: admissions@university.edu',
  'Hạn nộp hồ sơ là ngày 15 tháng 1 năm 2025.',
  'Tôi sẽ chuyển bạn đến chuyên gia phụ trách mảng này.',
];

export function LiveConsultation({ isPanel = false }: LiveConsultationProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(isPanel ? null : 1);
  const [messageInput, setMessageInput] = useState('');

  if (isPanel) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Tư Vấn Trực Tiếp
          </h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Active Chats */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                ĐANG HOẠT ĐỘNG ({activeChats.length})
              </div>
              {activeChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="w-full p-3 rounded-lg border hover:bg-accent transition-colors mb-2"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-500 text-white">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm truncate">{chat.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {chat.topic}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {chat.type === 'international' ? 'Quốc tế' : 'Trong nước'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {chat.duration} phút
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Waiting Queue */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                ĐANG CHỜ ({waitingQueue.length})
              </div>
              {waitingQueue.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-lg border mb-2 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-orange-500 text-white text-xs">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{student.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {student.topic}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {student.type === 'international' ? 'QT' : 'TN'}
                          </Badge>
                          <span className="text-xs text-orange-600">
                            Chờ {student.waitTime}p
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Nhận
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar - Queue List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Phiên Tư Vấn</h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Active Chats */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                ĐANG HOẠT ĐỘNG ({activeChats.length})
              </div>
              {activeChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-3 rounded-lg border transition-colors mb-2 ${
                    selectedChat === chat.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-500 text-white">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm truncate">{chat.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {chat.topic}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {chat.type === 'international' ? 'Quốc tế' : 'Trong nước'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {chat.duration} phút
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Waiting Queue */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                ĐANG CHỜ ({waitingQueue.length})
              </div>
              {waitingQueue.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-lg border mb-2"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-orange-500 text-white text-xs">
                        {student.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{student.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {student.topic}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {student.type === 'international' ? 'Quốc tế' : 'Trong nước'}
                      </Badge>
                      <span className="text-xs text-orange-600">
                        Chờ {student.waitTime}p
                      </span>
                    </div>
                    <Button size="sm">Nhận</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green-500 text-white">
                  VTH
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Vũ Thị Hoa</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  Đang hoạt động • Hồ sơ tuyển sinh
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'officer' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={message.sender === 'officer' ? 'bg-primary text-primary-foreground' : 'bg-accent'}>
                      {message.sender === 'officer' ? 'CB' : 'SV'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex flex-col gap-1 max-w-[75%] ${message.sender === 'officer' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'officer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground px-2">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Responses */}
          <div className="px-4 py-2 border-t bg-muted/30">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs"
                  onClick={() => setMessageInput(response)}
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t px-4 py-3 bg-background">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        </div>
      )}
    </div>
  );
}
