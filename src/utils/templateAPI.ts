import { QATemplate, TemplateCreate, TemplateUpdate, TemplateSearchParams } from '../types/qaTemplate.types';
import { SystemActivity, ActivityFilters, PaginatedActivities } from '../types/activity.types';

// Mock data for templates
let templates: QATemplate[] = [
  {
    id: '1',
    title: 'Admission Requirements',
    question: 'What are the basic admission requirements for undergraduate programs?',
    answer: 'The basic requirements include high school diploma or equivalent, minimum GPA of 3.0, and standardized test scores (SAT/ACT).',
    category: 'Admissions',
    tags: ['requirements', 'undergraduate', 'admission'],
    confidence_score: 0.95,
    is_active: true,
    created_at: new Date(2024, 0, 1).toISOString(),
    updated_at: new Date(2024, 0, 1).toISOString(),
    metadata: {
      response_type: 'factual',
      usage_count: 150
    }
  },
  // Add more mock templates...
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
  getTemplates: async (): Promise<QATemplate[]> => {
    await delay(500);
    return [...templates];
  },

  getTemplate: async (id: string): Promise<QATemplate> => {
    await delay(300);
    const template = templates.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return { ...template };
  },

  createTemplate: async (data: TemplateCreate): Promise<QATemplate> => {
    await delay(500);
    const newTemplate: QATemplate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    templates = [...templates, newTemplate];
    return newTemplate;
  },

  updateTemplate: async (id: string, data: TemplateUpdate): Promise<QATemplate> => {
    await delay(500);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    
    const updatedTemplate: QATemplate = {
      ...templates[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    templates = [...templates.slice(0, index), updatedTemplate, ...templates.slice(index + 1)];
    return updatedTemplate;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await delay(300);
    templates = templates.filter(t => t.id !== id);
  },

  searchTemplates: async (params: TemplateSearchParams): Promise<QATemplate[]> => {
    await delay(300);
    let filtered = [...templates];

    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.question.toLowerCase().includes(query) ||
        t.answer.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (params.category) {
      filtered = filtered.filter(t => t.category === params.category);
    }

    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter(t => 
        params.tags!.some(tag => t.tags.includes(tag))
      );
    }

    if (params.sortBy) {
      filtered.sort((a: any, b: any) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        const direction = params.sortDirection === 'desc' ? -1 : 1;
        return aVal > bVal ? direction : -direction;
      });
    }

    return filtered;
  }
};

// Generate mock activities
const generateMockActivities = (): SystemActivity[] => {
  const types = ['conversation', 'kb_update', 'alert', 'login', 'system_update', 'error'] as const;
  const statuses = ['active', 'completed', 'resolved', 'warning', 'error'] as const;
  const users = ['Sarah Johnson', 'Michael Chen', 'Admin User', 'Emily Rodriguez', 'System'];
  const severityLevels = ['low', 'medium', 'high'] as const;

  return Array.from({ length: 100 }, (_, i) => ({
    id: `act-${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    user: users[Math.floor(Math.random() * users.length)],
    action: `Mock activity ${i + 1} - ${['Started a conversation', 'Updated KB article', 'System alert triggered', 'Logged in', 'Updated system settings', 'Error occurred'][Math.floor(Math.random() * 6)]}`,
    time: `${Math.floor(Math.random() * 60)} min ago`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    metadata: {
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: 'Vietnam',
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)]
    }
  }));
};

// Mock activities database
let mockActivities = generateMockActivities();

// Activity mock API
export const activityAPI = {
  // Get paginated activities with filters
  getActivities: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: ActivityFilters
  ): Promise<PaginatedActivities> => {
    await delay(500);

    let filtered = [...mockActivities];

    if (filters) {
      if (filters.type?.length) {
        filtered = filtered.filter(a => filters.type!.includes(a.type));
      }
      if (filters.status?.length) {
        filtered = filtered.filter(a => filters.status!.includes(a.status));
      }
      if (filters.user) {
        filtered = filtered.filter(a => 
          a.user.toLowerCase().includes(filters.user!.toLowerCase())
        );
      }
      if (filters.startDate) {
        filtered = filtered.filter(a => 
          new Date(a.timestamp) >= new Date(filters.startDate!)
        );
      }
      if (filters.endDate) {
        filtered = filtered.filter(a => 
          new Date(a.timestamp) <= new Date(filters.endDate!)
        );
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
          a.action.toLowerCase().includes(query) ||
          a.user.toLowerCase().includes(query)
        );
      }
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Calculate pagination
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const total = filtered.length;

    return {
      items,
      total,
      page,
      pageSize,
      hasMore: start + pageSize < total
    };
  },

  // Get recent activities for dashboard
  getRecentActivities: async (limit: number = 5): Promise<SystemActivity[]> => {
    await delay(300);
    return mockActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  // Add new activity (will be used when real API is implemented)
  addActivity: async (activity: Omit<SystemActivity, 'id' | 'timestamp'>): Promise<SystemActivity> => {
    await delay(300);
    const newActivity: SystemActivity = {
      ...activity,
      id: `act-${mockActivities.length + 1}`,
      timestamp: new Date().toISOString()
    };
    mockActivities = [newActivity, ...mockActivities];
    return newActivity;
  }
};