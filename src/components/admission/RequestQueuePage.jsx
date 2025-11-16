import { useNavigate } from 'react-router-dom';
import { RequestQueue } from './RequestQueue';

export function RequestQueuePage() {
  const navigate = useNavigate();

  // Mock data for RequestQueue
  const mockRequests = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      studentType: 'international',
      topic: 'Học bổng du học',
      message: 'Tôi muốn tìm hiểu về các chương trình học bổng cho sinh viên quốc tế...',
      priority: 'high',
      waitTime: 18,
      requestedAt: '2024-11-17T10:30:00',
      avatar: 'NA',
      location: 'Việt Nam'
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '+1234567890',
      studentType: 'international',
      topic: 'Admission Requirements',
      message: 'I would like to know about the admission requirements for the Computer Science program...',
      priority: 'normal',
      waitTime: 12,
      requestedAt: '2024-11-17T10:45:00',
      avatar: 'EJ',
      location: 'United States'
    },
    {
      id: '3',
      name: 'Trần Thị C',
      email: 'tranthic@email.com',
      phone: '0987654321',
      studentType: 'domestic',
      topic: 'Thời gian nộp hồ sơ',
      message: 'Em muốn hỏi về thời hạn nộp hồ sơ xét tuyển cho năm học tới...',
      priority: 'normal',
      waitTime: 25,
      requestedAt: '2024-11-17T10:15:00',
      avatar: 'TC',
      location: 'Việt Nam'
    }
  ];

  const handleTakeRequest = (requestId) => {
    console.log('Taking request:', requestId);
    // Navigate to consultation page when taking a request
    navigate('/admission/consultation');
  };

  return (
    <RequestQueue 
      requests={mockRequests} 
      onTakeRequest={handleTakeRequest} 
    />
  );
}