import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Outlet } from "../types/outlets";
import {
  ViewOutletModal,
  EditOutletModal,
  AddOutletModal,
} from "../modals/outlets";

const Outlets: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchOutlets();
  }, [pagination.page, searchTerm]);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await api.get(`/outlets?${params}`);
      const { outlets, pagination: pag } = response.data.data;

      setOutlets(outlets);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching outlets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOutlet = async (outletData: Partial<Outlet>) => {
    try {
      await api.post("/outlets", outletData);
      setShowAddModal(false);
      fetchOutlets();
    } catch (error) {
      console.error("Error adding outlet:", error);
    }
  };

  const handleDeleteOutlet = async (id: string) => {
    try {
      await api.delete(`/outlets/${id}`);
      fetchOutlets();
    } catch (error) {
      console.error("Error deleting outlet:", error);
    }
  };

  const handleEditOutlet = async (outletData: Partial<Outlet>) => {
    if (!editingOutlet) return;

    try {
      await api.patch(`/outlets/${editingOutlet.id}`, outletData);
      setShowEditModal(false);
      setEditingOutlet(null);
      fetchOutlets();
    } catch (error) {
      console.error("Error updating outlet:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (outletName: string) => {
    return outletName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const OutletCard = ({ outlet }: { outlet: Outlet }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {getInitials(outlet.outletName)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {outlet.outletName}
          </h3>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {outlet.email}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {outlet.outletType ?? "No outlet type"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Added {formatDate(outlet.createdAt)}</span>
        {outlet.updatedAt && (
          <span>Updated {formatDate(outlet.updatedAt)}</span>
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedOutlet(outlet);
            setShowViewModal(true);
          }}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingOutlet(outlet);
            setShowEditModal(true);
          }}
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteOutlet(outlet.id)}
          className="flex-1 text-error-600"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );

  const OutletTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Outlet Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Industry
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {outlets.map((outlet) => (
            <tr
              key={outlet.id}
              className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {getInitials(outlet.outletName)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      {outlet.outletName}
                    </div>

                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {outlet.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {outlet.contactName || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {outlet.outletType || "N/A"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {outlet.city
                  ? `${outlet.city}, ${outlet.country || ""}`
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOutlet(outlet);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingOutlet(outlet);
                      setShowEditModal(true);
                    }}
                    className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOutlet(outlet.id)}
                    className="text-error-600 hover:opacity-80"
                  >
                    <Trash2 className="w-4 h-4" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Outlets Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage and monitor all outlets
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>Add New Outlet</Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="p-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search outlets..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setPagination({ ...pagination, page: 1 });
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Outlets Display */}
      <Card padding="sm">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden md:block">
                <OutletTable />
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {outlets.map((outlet) => (
                  <OutletCard key={outlet.id} outlet={outlet} />
                ))}
              </div>

              {outlets.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No outlets found
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} outlets
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ViewOutletModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        outlet={selectedOutlet}
      />

      <AddOutletModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddOutlet}
      />

      <EditOutletModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingOutlet(null);
        }}
        outlet={editingOutlet}
        onSave={handleEditOutlet}
      />
    </div>
  );
};

export default Outlets;
