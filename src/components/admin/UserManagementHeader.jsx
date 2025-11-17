import { Plus } from 'lucide-react';
import { Button } from '../ui/system_users/button';
import { Dialog, DialogTrigger } from '../ui/system_users/dialog';
import PropTypes from 'prop-types';

export function UserManagementHeader({ onAddUser }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2>User Management</h2>
        <p className="text-muted-foreground">Manage system users and role permissions</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={onAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}

UserManagementHeader.propTypes = {
  onAddUser: PropTypes.func.isRequired,
};