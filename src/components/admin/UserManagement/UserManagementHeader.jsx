import { Plus } from 'lucide-react';
import { Button } from '../../ui/system_users/button';
import { Dialog, DialogTrigger } from '../../ui/system_users/dialog';
import PropTypes from 'prop-types';

export function UserManagementHeader({ onAddUser }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2>Quản Lý Người Dùng</h2>
        <p className="text-muted-foreground">Quản lý người dùng hệ thống và quyền vai trò</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={onAddUser}>
            <Plus className="h-4 w-4 mr-2" />Thêm Người Dùng</Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}

UserManagementHeader.propTypes = {
  onAddUser: PropTypes.func.isRequired,
};