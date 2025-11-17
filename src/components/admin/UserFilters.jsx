import { Search } from 'lucide-react';
import { Input } from '../ui/system_users/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/system_users/select';
import PropTypes from 'prop-types';

export function UserFilters({ 
  searchQuery, 
  onSearchChange, 
  filterRole, 
  onFilterRoleChange 
}) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..."
          className="pl-10"
        />
      </div>
      <Select value={filterRole} onValueChange={onFilterRoleChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">System Admin</SelectItem>
          <SelectItem value="content_manager">Content Manager</SelectItem>
          <SelectItem value="consultant">Consultant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

UserFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterRole: PropTypes.string.isRequired,
  onFilterRoleChange: PropTypes.func.isRequired,
};