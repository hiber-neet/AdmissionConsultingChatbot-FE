import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Search,
  Filter,
  Calendar,
  RefreshCcw,
  MessageSquare,
  Database,
  AlertCircle,
  LogIn,
  Settings,
  AlertOctagon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/system_users/card';
import { Input } from '../ui/system_users/input';
import { Button } from '../ui/system_users/button';
import { Select } from '../ui/system_users/select';
import { Badge } from '../ui/system_users/badge';
import { ScrollArea } from '../ui/system_users/scroll-area';
import { ActivityFilters, SystemActivity, ActivityType } from '../../types/activity.types';
// import { activityAPI } from '../../utils/templateAPI'; // TODO: Uncomment when backend is ready

// Mock data for development - remove when backend is ready
const mockActivities: SystemActivity[] = [
  {
    id: '1',
    type: 'login' as ActivityType,
    action: 'User logged in successfully',
    user: 'admin@example.com',
    time: new Date().toLocaleTimeString(),
    timestamp: new Date().toISOString(),
    status: 'completed',
    metadata: {
      ip: '192.168.1.1',
      location: 'Ho Chi Minh City, Vietnam'
    }
  },
  {
    id: '2',
    type: 'kb_update' as ActivityType,
    action: 'Knowledge base article updated',
    user: 'content@example.com',
    time: new Date(Date.now() - 3600000).toLocaleTimeString(),
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    metadata: {
      severity: 'low'
    }
  },
  {
    id: '3',
    type: 'conversation' as ActivityType,
    action: 'New student consultation started',
    user: 'admission@example.com',
    time: new Date(Date.now() - 7200000).toLocaleTimeString(),
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'active',
    metadata: {
      ip: '192.168.1.2'
    }
  },
  {
    id: '4',
    type: 'error' as ActivityType,
    action: 'Failed to load student profile',
    user: 'system',
    time: new Date(Date.now() - 10800000).toLocaleTimeString(),
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'error',
    metadata: {
      severity: 'high'
    }
  }
];

const ITEMS_PER_PAGE = 20;

const activityTypeIcons = {
  conversation: MessageSquare,
  kb_update: Database,
  alert: AlertCircle,
  login: LogIn,
  system_update: Settings,
  error: AlertOctagon
};

const activityTypeColors = {
  conversation: 'text-blue-500',
  kb_update: 'text-green-500',
  alert: 'text-yellow-500',
  login: 'text-purple-500',
  system_update: 'text-indigo-500',
  error: 'text-red-500'
};

export function ActivityLog() {
  // State
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Load activities
  useEffect(() => {
    // loadActivities(); // TODO: Uncomment when backend is ready
    // Mock data loading for development
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setTotal(mockActivities.length);
      setHasMore(false);
      setLoading(false);
    }, 500);
  }, [page, filters]);

  // TODO: Uncomment when backend is ready
  // const loadActivities = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await activityAPI.getActivities(page, ITEMS_PER_PAGE, {
  //       ...filters,
  //       searchQuery
  //     });
  //     setActivities(response.items);
  //     setTotal(response.total);
  //     setHasMore(response.hasMore);
  //   } catch (error) {
  //     console.error('Error loading activities:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadActivities = () => {
    // Mock refresh for development
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setTotal(mockActivities.length);
      setHasMore(false);
      setLoading(false);
    }, 500);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setFilters({ ...filters, searchQuery: query });
  };

  const handleFilterChange = (key: keyof ActivityFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const getActivityIcon = (type: ActivityType) => {
    const IconComponent = activityTypeIcons[type];
    return <IconComponent className={`h-4 w-4 ${activityTypeColors[type]}`} />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activity Log
          </h1>
          <p className="text-muted-foreground">
            View and filter all system activities
          </p>
        </div>
        <Button onClick={() => loadActivities()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter activities by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type?.[0] || ''}
                onValueChange={(value) => handleFilterChange('type', value ? [value] : [])}
              >
                <option value="">All Types</option>
                <option value="conversation">Conversation</option>
                <option value="kb_update">Knowledge Base</option>
                <option value="alert">Alert</option>
                <option value="login">Login</option>
                <option value="system_update">System Update</option>
                <option value="error">Error</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status?.[0] || ''}
                onValueChange={(value) => handleFilterChange('status', value ? [value] : [])}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="resolved">Resolved</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Activities</CardTitle>
            <Badge variant="outline">{total} Total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                >
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p>{activity.action}</p>
                    {activity.metadata && (
                      <div className="text-xs text-muted-foreground">
                        {activity.metadata.ip && (
                          <span className="mr-2">IP: {activity.metadata.ip}</span>
                        )}
                        {activity.metadata.location && (
                          <span className="mr-2">Location: {activity.metadata.location}</span>
                        )}
                        {activity.metadata.severity && (
                          <Badge variant="outline" className="text-xs">
                            {activity.metadata.severity} severity
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={
                      activity.status === 'active'
                        ? 'default'
                        : activity.status === 'warning' || activity.status === 'error'
                        ? 'destructive'
                        : activity.status === 'completed'
                        ? 'outline'
                        : 'secondary'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(total / ITEMS_PER_PAGE)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}