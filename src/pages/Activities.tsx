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
import { Activity } from "../types/activities";
import {
  ViewActivityModal,
  EditActivityModal,
  AddActivityModal,
} from "../modals/activities";

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(
    undefined
  );
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: "Call",
    subject: "",
    description: "",
    status: "planned",
    priority: "low",
    dueDate: "",
    leadId: undefined,
    taskId: undefined,
    outletId: undefined,
    assignedTo: { id: undefined, name: "" },
  });

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [pagination.page, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(typeFilter && { type: typeFilter }),
      });

      const response = await api.get(`/activities?${params}`);
      const { activities, pagination: pag } = response.data.data;

      setActivities(activities);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await api.delete(`/activities/${id}`);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleEditActivity = async (activity: Activity) => {
    try {
      const activityData = {
        type: activity.type,
        subject: activity.subject,
        description: activity.description || undefined,
        status: activity.status,
        priority: activity.priority,
        dueDate: activity.dueDate ?? undefined,
        leadId: activity.leadId ?? undefined,
        taskId: activity.taskId ?? undefined,
        outletId: activity.outletId ?? undefined,
        assignedTo: Number(activity.assignedTo?.id),
      };
      await api.put(`/activities/${activity.id}`, activityData);
      setShowEditModal(false);
      setEditingActivity(null);
      fetchActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const handleAddActivity = async (activityData: Partial<Activity>) => {
    try {
      const payload = {
        type: activityData.type,
        subject: activityData.subject,
        description: activityData.description || undefined,
        status: activityData.status,
        priority: activityData.priority,
        dueDate: activityData.dueDate || undefined,
        leadId: activityData.leadId || undefined,
        taskId: activityData.taskId || undefined,
        outletId: activityData.outletId || undefined,
        assignedTo: activityData.assignedTo?.id || undefined,
      };
      await api.post("/activities", payload);
      setShowAddActivityModal(false);
      fetchActivities();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (subject: string) => {
    return subject
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
          <span className="text-sm sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
            {getInitials(activity.subject)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {activity.subject}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {activity.type}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
            {activity.outlet?.outletName
              ? `Outlet: ${activity.outlet.outletName}`
              : "No outlet"}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
            {activity.lead?.name ? `Lead: ${activity.lead.name}` : "No lead"}
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span
            className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
              activity.status === "completed"
                ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                : activity.status === "cancelled"
                ? "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                : "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
            }`}
          >
            {activity.status}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-1 xs:gap-0">
        <span>Due: {formatDate(activity.dueDate)}</span>
        <span>Created: {formatDate(activity.createdAt)}</span>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium 
          ${
            activity.priority === "high"
              ? "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
              : activity.priority === "medium"
              ? "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
              : "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
          }
          `}
        >
          {activity.priority}
        </span>
      </div>

      <div className="mt-3 sm:mt-4 flex  gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedActivity(activity);
            setShowViewModal(true);
          }}
          className="flex-1 min-w-0"
        >
          <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">View</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingActivity(activity);
            setShowEditModal(true);
          }}
          className="flex-1 min-w-0"
        >
          <Edit className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">Edit</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteActivity(activity.id)}
          className="flex-1 min-w-0 text-error-600"
        >
          <Trash2 className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">Delete</span>
        </Button>
      </div>
    </Card>
  );

  const ActivityTable = () => (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[200px]">
                Activity
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[80px]">
                Type
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[120px] hidden lg:table-cell">
                Outlet
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[100px] hidden lg:table-cell">
                Lead
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[100px] hidden xl:table-cell">
                Task
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[80px] hidden md:table-cell">
                Priority
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[100px] hidden md:table-cell">
                Due Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400">
                        {getInitials(activity.subject)}
                      </span>
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                        {activity.subject}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="truncate block max-w-[60px] sm:max-w-none">
                    {activity.type}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">
                  <span className="truncate block max-w-[100px]">
                    {activity.outlet?.outletName || "N/A"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 hidden lg:table-cell">
                  <span className="truncate block max-w-[80px]">
                    {activity.lead?.name || "N/A"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 hidden xl:table-cell">
                  <span className="truncate block max-w-[80px]">
                    {activity.task?.name || "N/A"}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === "completed"
                        ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                        : activity.status === "cancelled"
                        ? "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                        : "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
                    }`}
                  >
                    <span className="truncate max-w-[60px] sm:max-w-none">
                      {activity.status}
                    </span>
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                  {activity.priority}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                  {formatDate(activity.dueDate)}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowViewModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingActivity(activity);
                        setShowEditModal(true);
                      }}
                      className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300 p-1"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-error-600 hover:opacity-80 p-1"
                      title="Delete"
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
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 py-4 sm:p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
            Activities Management
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and monitor all activities
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={() => setShowAddActivityModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            <span className="sm:hidden">Add Activity</span>
            <span className="hidden sm:inline">Add New Activity</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="p-1 sm:p-2">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 flex-wrap">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <select
                value={statusFilter || ""}
                onChange={(e) => {
                  setStatusFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-3 sm:px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm sm:text-base flex-1 sm:flex-none"
              >
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={priorityFilter || ""}
                onChange={(e) => {
                  setPriorityFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-3 sm:px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm sm:text-base flex-1 sm:flex-none"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={typeFilter || ""}
                onChange={(e) => {
                  setTypeFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-3 sm:px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm sm:text-base flex-1 sm:flex-none"
              >
                <option value="">All Types</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Email">Email</option>
                <option value="Task">Task</option>
              </select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(undefined);
                  setPriorityFilter(undefined);
                  setTypeFilter(undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="text-sm sm:text-base"
              >
                <Filter className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Activities Display */}
      <Card padding="sm">
        <div className="p-1 sm:p-3">
          {loading ? (
            <div className="flex items-center justify-center h-32 sm:h-64">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden sm:block">
                <ActivityTable />
              </div>

              {/* Mobile View */}
              <div className="sm:hidden space-y-3 sm:space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>

              {activities.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No activities found
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 px-4">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} activities
          </div>

          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page === pagination.totalPages}
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ViewActivityModal
        activity={selectedActivity}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
      />

      <EditActivityModal
        activity={editingActivity}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingActivity(null);
        }}
        onSave={handleEditActivity}
      />

      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        onAdd={handleAddActivity}
      />
    </div>
  );
};

export default Activities;
