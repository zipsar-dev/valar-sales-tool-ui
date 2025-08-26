import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, UserCheck, UserX, ChevronLeft, ChevronRight, Eye, Shield } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EditUserModal from '../components/users/EditUserModal';
import AddUserModal from '../components/users/AddUserModal';
import { User, UsersResponse } from '../types/users';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, activeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(activeFilter !== undefined && { active: activeFilter.toString() })
      });

      const response = await api.get(`/users?${params}`);
      const { users, pagination: pag } = response.data.data as UsersResponse;
      
      setUsers(users);
      setPagination(pag);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}/status`, {
        isActive: !user.isActive
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleEditUser = async (userData: Partial<User> & { addedRoles?: string[]; removedRoles?: string[] }) => {
    if (!editingUser) return;
    
    try {
      // Update user details with PUT
      if (userData.fullName || userData.phone || userData.department) {
        await api.put(`/users/${editingUser.id}`, {
          fullName: userData.fullName,
          phone: userData.phone,
          department: userData.department
        });
      }

      // Update roles with POST
      if (userData.addedRoles?.length || userData.removedRoles?.length) {
        await api.post(`/users/${editingUser.id}/roles`, {
          addedRoles: userData.addedRoles || [],
          removedRoles: userData.removedRoles || []
        });
      }

      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user or roles:', error);
    }
  };

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      await api.post('/users', userData);
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ').filter(Boolean);
    return names.length >= 2
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0]?.slice(0, 2).toUpperCase() || '';
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full" />
          ) : (
            <span className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
              {getInitials(user.fullName)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {user.fullName}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {user.department ?? 'No department'}
          </p>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
              : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Joined {formatDate(user.createdAt)}</span>
        {user.lastLogin && <span>Last login {formatDate(user.lastLogin)}</span>}
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
        {user.roles.slice(0, 2).map((role) => (
          <span key={role} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
            {role}
          </span>
        ))}
        {user.roles.length > 2 && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            +{user.roles.length - 2} more
          </span>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedUser(user);
            setShowViewModal(true);
          }}
          className="flex-1 min-w-[80px]"
        >
          <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingUser(user);
            setShowEditModal(true);
          }}
          className="flex-1 min-w-[80px]"
        >
          <Edit className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatusToggle(user)}
          className="flex-1 min-w-[80px]"
        >
          {user.isActive ? (
            <>
              <UserX className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
              Activate
            </>
          )}
        </Button>
      </div>
    </Card>
  );

  const UserTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              User
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                      {user.fullName}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[150px] sm:max-w-[200px]">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {user.phone || 'N/A'}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {user.department || 'N/A'}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                    : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex flex-wrap gap-1">
                  {user.roles.slice(0, 2).map((role) => (
                    <span key={role} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                      {role}
                    </span>
                  ))}
                  {user.roles.length > 2 && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      +{user.roles.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowEditModal(true);
                    }}
                    className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                  >
                    <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(user)}
                    className={`${
                      user.isActive ? 'text-error-600' : 'text-success-600'
                    } hover:opacity-80`}
                  >
                    {user.isActive ? <UserX className="w-3 sm:w-4 h-3 sm:h-4" /> : <UserCheck className="w-3 sm:w-4 h-3 sm:h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage and monitor all system users
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto"
        >
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 sm:w-5 h-4 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-8 sm:pl-10 text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={activeFilter === undefined ? '' : activeFilter.toString()}
                onChange={(e) => {
                  setActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true');
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-2 sm:px-4 py-1 sm:py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter(undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="text-sm"
              >
                <Filter className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Display */}
      <Card>
        <div className="p-3 sm:p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden md:block">
                <UserTable />
              </div>
              
              {/* Mobile View */}
              <div className="md:hidden space-y-3 sm:space-y-4">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              
              {users.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-8 sm:w-12 h-8 sm:h-12 text-neutral-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="p-1 sm:p-2"
            >
              <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
            </Button>
            
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="p-1 sm:p-2"
            >
              <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 top-16 md:top-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-[95%] sm:max-w-lg md:max-w-2xl mx-2 sm:mx-4 my-4 sm:my-6 max-h-[85vh] overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  User Details
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowViewModal(false)}
                  className="text-sm"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.fullName} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-base sm:text-lg md:text-2xl font-semibold text-primary-600 dark:text-primary-400">
                        {getInitials(selectedUser.fullName)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Phone
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-900 dark:text-white">
                      {selectedUser.phone || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Department
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-900 dark:text-white">
                      {selectedUser.department || 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Status
                    </label>
                    <p className="mt-1 text-xs sm:text-sm">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.isActive 
                          ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                          : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                      }`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Joined
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-900 dark:text-white">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Roles
                  </label>
                  <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                    {selectedUser.roles.map((role) => (
                      <span key={role} className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Permissions
                  </label>
                  <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                    {selectedUser.permissions.map((permission) => (
                      <span key={permission} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleEditUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddUser}
      />
    </div>
  );
};

export default Users;