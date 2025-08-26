import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Activity } from '../types/activities';
import { ViewActivityModal, EditActivityModal, AddActivityModal } from '../modals/activities';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: 'Call',
    subject: '',
    description: '',
    status: 'planned',
    priority: 'low',
    dueDate: '',
    leadId: undefined,
    taskId: undefined,
    outletId: undefined,
    assignedTo: { id: undefined, name: '' },
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
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await api.delete(`/activities/${id}`);
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
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
      console.error('Error updating activity:', error);
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
      await api.post('/activities', payload);
      setShowAddActivityModal(false);
      fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (subject: string) => {
    return subject
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {getInitials(activity.subject)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {activity.subject}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{activity.type}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {activity.outlet?.outletName ? `Outlet: ${activity.outlet.outletName}` : 'No outlet'}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {activity.lead?.name ? `Lead: ${activity.lead.name}` : 'No lead'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            activity.status === 'completed'
              ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
              : activity.status === 'cancelled'
              ? 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
              : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
          }`}>
            {activity.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Due: {formatDate(activity.dueDate)}</span>
        <span>Created: {formatDate(activity.createdAt)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
          {activity.priority}
        </span>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedActivity(activity);
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
            setEditingActivity(activity);
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
          onClick={() => handleDeleteActivity(activity.id)}
          className="flex-1 text-error-600"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );

  const ActivityTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Activity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Outlet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {getInitials(activity.subject)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.subject}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {activity.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {activity.outlet?.outletName || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {activity.lead?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {activity.task?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === 'completed'
                    ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                    : activity.status === 'cancelled'
                    ? 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                    : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                }`}>
                  {activity.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {activity.priority}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {formatDate(activity.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingActivity(activity);
                      setShowEditModal(true);
                    }}
                    className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
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
            Activities Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage and monitor all activities
          </p>
        </div>
        <Button onClick={() => setShowAddActivityModal(true)}>
          Add New Activity
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter || ''}
                onChange={(e) => {
                  setStatusFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={priorityFilter || ''}
                onChange={(e) => {
                  setPriorityFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={typeFilter || ''}
                onChange={(e) => {
                  setTypeFilter(e.target.value || undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
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
                  setSearchTerm('');
                  setStatusFilter(undefined);
                  setPriorityFilter(undefined);
                  setTypeFilter(undefined);
                  setPagination({ ...pagination, page: 1 });
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Activities Display */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden md:block">
                <ActivityTable />
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>

              {activities.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No activities found
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} activities
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
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