import { Card, CardContent, CardHeader, CardTitle } from '../../ui/system_users/card';
import PropTypes from 'prop-types';

export function UserStats({ users }) {
  const adminCount = users.filter(u => u.role === 'SYSTEM_ADMIN').length;
  const contentManagerCount = users.filter(u => u.role === 'CONTENT_MANAGER').length;
  const admissionOfficerCount = users.filter(u => u.role === 'ADMISSION_OFFICER').length;
  const consultantCount = users.filter(u => u.role === 'CONSULTANT').length;
  const activeCount = users.filter(u => u.status === 'active').length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">System Admins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{adminCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Content Managers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{contentManagerCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Admission Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{admissionOfficerCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{consultantCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {activeCount} active users
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

UserStats.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
};