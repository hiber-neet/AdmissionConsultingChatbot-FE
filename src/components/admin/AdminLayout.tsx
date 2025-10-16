import { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Users, Shield } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { AdminDashboard } from './AdminDashboard';
import { QATemplateManager } from './QATemplateManager';
import { UserManagement } from './UserManagement';

type AdminView = 'dashboard' | 'templates' | 'users';

export function AdminLayout() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const navigation = [
    { id: 'dashboard' as AdminView, label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { id: 'templates' as AdminView, label: 'Mẫu Q&A', icon: MessageSquareText },
    { id: 'users' as AdminView, label: 'Quản Lý Người Dùng', icon: Users },
  ];

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <div>
              <h1>Admin Panel</h1>
              <p className="text-sm text-muted-foreground">System Control</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'templates' && <QATemplateManager />}
        {activeView === 'users' && <UserManagement />}
      </div>
    </div>
  );
}