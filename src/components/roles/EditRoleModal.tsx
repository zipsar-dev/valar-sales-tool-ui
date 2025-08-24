import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import api from '../../lib/api';

interface Role {
  id: number;
  role_key: string;
  role_name: string;
  permissions: string[];
}

interface Permission {
  id: number;
  permission_key: string;
  permission_name: string;
}

interface PermissionsResponse {
  permissions: Permission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (data: { role_name?: string; addedPermissions?: string[]; removedPermissions?: string[] }) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, role, onSave }) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [possiblePermissions, setPossiblePermissions] = useState<string[]>([]);
  const [initialData, setInitialData] = useState<{
    roleName: string;
    permissions: string[];
  } | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch possible permissions from the database
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const response = await api.get<PermissionsResponse>('/permissions?page=1&limit=100'); // Adjust limit as needed
        const permissionKeys = response.data.permissions.map(perm => perm.permission_key);
        setPossiblePermissions(permissionKeys);
        setError(null);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        setError('Failed to load permissions');
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  // Set initial data when role changes
  useEffect(() => {
    if (role) {
      const initial = {
        roleName: role.role_name,
        permissions: role.permissions,
      };
      setRoleName(initial.roleName);
      setPermissions(initial.permissions);
      setInitialData(initial);
    }
  }, [role]);

  if (!isOpen || !role || !initialData) return null;

  const hasChanges = () => {
    return (
      roleName !== initialData.roleName ||
      permissions.length !== initialData.permissions.length ||
      permissions.some(p => !initialData.permissions.includes(p)) ||
      initialData.permissions.some(p => !permissions.includes(p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const changes: { role_name?: string; addedPermissions?: string[]; removedPermissions?: string[] } = {};
    if (roleName !== initialData.roleName) changes.role_name = roleName;

    const addedPermissions = permissions.filter(p => !initialData.permissions.includes(p));
    const removedPermissions = initialData.permissions.filter(p => !permissions.includes(p));

    if (addedPermissions.length > 0) changes.addedPermissions = addedPermissions;
    if (removedPermissions.length > 0) changes.removedPermissions = removedPermissions;

    onSave(changes);
  };

  const addPermission = (perm: string) => {
    if (!permissions.includes(perm)) {
      setPermissions([...permissions, perm]);
    }
  };

  const removePermission = (perm: string) => {
    setPermissions(permissions.filter(p => p !== perm));
  };

  const availablePermissions = possiblePermissions.filter(p => !permissions.includes(p));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Edit Role
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6" id="editRoleForm">
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
                Permissions
              </label>
              {loadingPermissions ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="text-sm text-error-600 dark:text-error-400">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Available Permissions</h3>
                    <div className="space-y-2">
                      {availablePermissions.map((perm) => (
                        <div key={perm} className="flex items-center justify-between p-2 border border-neutral-200 dark:border-neutral-700 rounded">
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{perm}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => addPermission(perm)}>
                            +
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Assigned Permissions</h3>
                    <div className="space-y-2">
                      {permissions.map((perm) => (
                        <div key={perm} className="flex items-center justify-between p-2 border border-neutral-200 dark:border-neutral-700 rounded">
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{perm}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removePermission(perm)}>
                            -
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900 sticky bottom-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="editRoleForm" disabled={!hasChanges() || loadingPermissions || !!error}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );

};

export default EditRoleModal;
