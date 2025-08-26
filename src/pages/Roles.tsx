import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Trash2,
} from "lucide-react";
import api from "../lib/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EditRoleModal from "../components/roles/EditRoleModal";
import AddRoleModal from "../components/roles/AddRoleModal";

interface Role {
  id: number;
  role_key: string;
  role_name: string;
  permissions: string[];
}

interface RolesResponse {
  roles: Role[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, [pagination.page, searchTerm]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/roles?${params}`);
      const { roles, pagination: pag } = response.data.data as RolesResponse;

      setRoles(roles);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the role "${role.role_name}"?`
      )
    )
      return;
    try {
      await api.delete(`/roles/${role.id}`);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const RoleCard = ({ role }: { role: Role }) => (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow" padding="sm">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {role.role_name}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {role.role_key}
          </p>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
        {role.permissions.slice(0, 2).map((perm) => (
          <span
            key={perm}
            className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
          >
            {perm}
          </span>
        ))}
        {role.permissions.length > 2 && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            +{role.permissions.length - 2} more
          </span>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedRole(role);
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
            setEditingRole(role);
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
          onClick={() => handleDeleteRole(role)}
          className="flex-1 min-w-[80px] text-error-600"
        >
          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );

  const RoleTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Role Name
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Role Key
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Permissions
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {roles.map((role) => (
            <tr
              key={role.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                {role.role_name}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {role.role_key}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 2).map((perm) => (
                    <span
                      key={perm}
                      className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                    >
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length > 2 && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      +{role.permissions.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setShowEditModal(true);
                    }}
                    className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                  >
                    <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="text-error-600 hover:opacity-80"
                  >
                    <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
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
            Roles Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage and monitor all system roles
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto"
        >
          Add New Role
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="p-1 sm:p-2">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 sm:w-5 h-4 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search roles..."
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
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setPagination({ ...pagination, page: 1 });
                }}
                className="text-sm w-full sm:w-auto"
              >
                <Filter className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Roles Display */}
      <Card padding="sm">
        <div className="p-1 sm:p-2 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden md:block">
                <RoleTable />
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3 sm:space-y-4">
                {roles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>

              {roles.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-8 sm:w-12 h-8 sm:h-12 text-neutral-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No roles found
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search criteria
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
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} roles
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
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
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page === pagination.totalPages}
              className="p-1 sm:p-2"
            >
              <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Role Modal */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 top-16 md:top-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-[95%] sm:max-w-lg md:max-w-2xl mx-2 sm:mx-4 my-4 sm:my-6 max-h-[85vh] overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  Role Details
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
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Role Name
                  </label>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-900 dark:text-white">
                    {selectedRole.role_name}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Role Key
                  </label>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-900 dark:text-white">
                    {selectedRole.role_key}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Permissions
                  </label>
                  <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                    {selectedRole.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingRole(null);
        }}
        role={editingRole}
        onSave={async (data) => {
          if (!editingRole) return;

          try {
            // Update role details with PUT
            if (data.role_name) {
              await api.put(`/roles/${editingRole.id}`, {
                role_name: data.role_name,
              });
            }

            // Update permissions with POST
            if (
              data.addedPermissions?.length ||
              data.removedPermissions?.length
            ) {
              await api.post(`/roles/${editingRole.id}/permissions`, {
                addedPermissions: data.addedPermissions || [],
                removedPermissions: data.removedPermissions || [],
              });
            }

            setShowEditModal(false);
            setEditingRole(null);
            fetchRoles();
          } catch (error) {
            console.error("Error updating role or permissions:", error);
          }
        }}
      />

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={async (data) => {
          try {
            const roleResponse = await api.post("/roles", {
              role_name: data.role_name,
              role_key: data.role_key,
            });
            const newRole = roleresponse.data.data;

            setShowAddModal(false);
            fetchRoles();
          } catch (error) {
            console.error("Error creating role:", error);
          }
        }}
      />
    </div>
  );
};

export default Roles;
