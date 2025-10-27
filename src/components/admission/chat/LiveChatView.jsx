import { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Clock, 
  Send,
  Smile,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { ScrollArea } from '../../ui/system_users/scroll-area';
import { Input } from '../../ui/system_users/input';
import { Button } from '../../ui/system_users/button';
import { Avatar, AvatarFallback } from '../../ui/system_users/avatar';
import { Badge } from '../../ui/system_users/badge';

const users = [
  {
    id: 'VTH',
    name: 'Vũ Thị Hoa',
    status: 'Đang hoạt động',
    topic: 'Hồ sơ tuyển sinh',
    lastMessage: '14:32',
    isActive: true
  },
  {
    id: 'DQK',
    name: 'Đặng Quốc Khải',
    status: 'Chuyển trường',
    topic: 'Trong nước',
    lastMessage: '14:33'
  },
  {
    id: 'NVA',
    name: 'Nguyễn Văn An',
    status: 'Học bổng',
    topic: 'Quốc tế',
    lastMessage: '14:34',
    badge: 'ĐANG CHỜ'
  },
  {
    id: 'TTB',
    name: 'Trần Thị Bình',
    status: 'Visa',
    topic: 'Trong nước',
    lastMessage: '14:35',
    badge: 'ĐANG CHỜ'
  }
];

const messages = [
  {
    id: 1,
    sender: 'student',
    content: 'Xin chào! Tôi muốn hỏi về quy trình xin visa du học.',
    time: '14:32'
  },
  {
    id: 2,
    sender: 'officer',
    content: 'Chào bạn! Tôi rất vui được hỗ trợ. Bạn đang quan tâm đến visa F-1 cho sinh viên phải không?',
    time: '14:33'
  },
  {
    id: 3,
    sender: 'student',
    content: 'Vâng đúng rồi ạ. Tôi cần chuẩn bị những giấy tờ gì?',
    time: '14:34'
  },
  {
    id: 4,
    sender: 'officer',
    content: 'Để xin visa F-1, bạn cần:\\n1. Form I-20 từ trường (chúng tôi sẽ cấp sau khi nhận hồ sơ)\\n2. Hộ chiếu còn hạn\\n3. Chứng minh tài chính\\n4. Bằng cấp học vấn\\n\\nBạn đã nhận được thư nhận học chưa?',
    time: '14:35'
  }
];

export function LiveChatView() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-full">
      {/* Left Sidebar - User List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm cuộc hội thoại..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  selectedUser.id === user.id ? 'bg-[#3B82F6]/5' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={user.isActive ? 'bg-[#3B82F6] text-white' : 'bg-gray-200'}>
                    {user.id}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.lastMessage}</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{user.status}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      {user.topic}
                    </Badge>
                    {user.badge && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {user.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={selectedUser.isActive ? 'bg-[#3B82F6] text-white' : 'bg-gray-200'}>
                {selectedUser.id}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{selectedUser.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Đang hoạt động
                </span>
                <span>•</span>
                <span>{selectedUser.topic}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'officer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === 'officer' ? 'flex-row-reverse' : ''}`}>
                  {message.sender === 'student' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-200">
                        {selectedUser.id}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div 
                      className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'officer' 
                          ? 'bg-[#3B82F6] text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === 'officer' ? 'text-right' : ''
                    }`}>
                      {message.time}
                    </div>
                  </div>
                  {message.sender === 'officer' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#3B82F6] text-white">
                        CB
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button className="bg-[#3B82F6]" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}