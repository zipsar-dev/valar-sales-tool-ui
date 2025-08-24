import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { role_name: string; role_key: string }) => void;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [roleName, setRoleName] = useState('');
  const [roleKey, setRoleKey] = useState('');

  if (!isOpen) return null;

  const hasBasicInfo = roleName && roleKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      role_name: roleName,
      role_key: roleKey,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Add New Role
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6" id="addRoleForm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Role Name
              </label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Role Key
              </label>
              <Input
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                required
              />
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900 sticky bottom-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="addRoleForm" disabled={!hasBasicInfo}>
            Add Role
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddRoleModal;
