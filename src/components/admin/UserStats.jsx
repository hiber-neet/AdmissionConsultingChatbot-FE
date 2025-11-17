import { Card, CardContent, CardHeader, CardTitle } from '../ui/system_users/card';
import PropTypes from 'prop-types';

export function UserStats({ users }) {
  const adminCount = users.filter(u => u.roles?.includes('admin')).length;
  const contentManagerCount = users.filter(u => u.roles?.includes('content_manager')).length;
  const consultantCount = users.filter(u => u.roles?.includes('consultant')).length;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Admins</CardTitle>
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
          <CardTitle className="text-sm">Consultants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{consultantCount}</div>
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