import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { User } from '../../types/users';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (data: Partial<User> & { addedRoles?: string[]; removedRoles?: string[] }) => void;
}

const possibleRoles = ['SALES_REP', 'MANAGER', 'FINANCE', 'USER', 'ADMIN', 'SUPER_ADMIN'];

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [tab, setTab] = useState<'basic' | 'roles'>('basic');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<{
    fullName: string;
    phone: string;
    department: string;
    roles: string[];
  } | null>(null);

  useEffect(() => {
    if (user) {
      const initial = {
        fullName: user.fullName,
        phone: user.phone || '',
        department: user.department || '',
        roles: user.roles,
      };
      setFullName(initial.fullName);
      setPhone(initial.phone);
      setDepartment(initial.department);
      setRoles(initial.roles);
      setInitialData(initial);
    }
  }, [user]);

  if (!isOpen || !user || !initialData) return null;

  const hasChanges = () => {
    return (
      fullName !== initialData.fullName ||
      phone !== initialData.phone ||
      department !== initialData.department ||
      roles.length !== initialData.roles.length ||
      roles.some(r => !initialData.roles.includes(r)) ||
      initialData.roles.some(r => !roles.includes(r))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const basicChanges: Partial<User> = {};
    if (fullName !== initialData.fullName) basicChanges.fullName = fullName;
    if (phone !== initialData.phone) basicChanges.phone = phone;
    if (department !== initialData.department) basicChanges.department = department;

    const addedRoles = roles.filter(r => !initialData.roles.includes(r));
    const removedRoles = initialData.roles.filter(r => !roles.includes(r));

    onSave({
      ...basicChanges,
      ...(addedRoles.length > 0 && { addedRoles }),
      ...(removedRoles.length > 0 && { removedRoles }),
    });
  };

  const addRole = (role: string) => {
    if (!roles.includes(role)) {
      setRoles([...roles, role]);
    }
  };

  const removeRole = (role: string) => {
    setRoles(roles.filter(r => r !== role));
  };

  const availableRoles = possibleRoles.filter(r => !roles.includes(r));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Edit User
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            className={`flex-1 py-2 px-4 text-center ${tab === 'basic' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-neutral-500'}`}
            onClick={() => setTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${tab === 'roles' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-neutral-500'}`}
            onClick={() => setTab('roles')}
          >
            Roles
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6" id="editUserForm">
          {tab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Department
                </label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
          )}

          {tab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Available Roles</h3>
                <div className="space-y-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center justify-between p-2 border rounded">
                      <span>{role}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addRole(role)}>
                        +
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Assigned Roles</h3>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center justify-between p-2 border rounded">
                      <span>{role}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeRole(role)}>
                        -
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900 sticky bottom-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="editUserForm" disabled={!hasChanges()}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditUserModal;