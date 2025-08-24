import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatDateForInput } from '../utils/formatters';
import { TaskConstants, TaskStage, TASK_STAGES, TASK_STATUS, TaskStatus } from '../constants/TaskConstants';
import { Task } from '../types/tasks';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/users';

const stageColors: Record<TaskStage, string> = {
  NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  DEMO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OFFER_SENT: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  NEGOTIATION: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  FINALIZING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  WON: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  LOST: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const useTaskConstants = (): TaskConstants => {
  return {
    stages: TASK_STAGES,
    statuses: TASK_STATUS,
    taskStageOptions: undefined,
    taskStatusOptions: undefined,
  };
};

const getTaskStageOptions = (taskConstants: TaskConstants) => {
  return Object.entries(taskConstants.stages).map(([key, value]) => ({
    value: key as TaskStage,
    label: value,
  }));
};

const getTaskStatusOptions = (taskConstants: TaskConstants) => {
  return Object.entries(taskConstants.statuses).map(([key, value]) => ({
    value: key,
    label: value,
  }));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTask: Partial<Task>;
  setNewTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
}

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, taskId: string) => void;
  formData: Partial<Task>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Task>>>;
}

export const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const taskConstants = useTaskConstants();

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Task Details
            </h2>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Name
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Outlet
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.outlet?.outletName || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Contact Name
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.outlet?.contactName || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.outlet?.email || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Phone
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.outlet?.phone || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Amount
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                ${task.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Stage
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stageColors[task.stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                >
                  {taskConstants.stages[task.stage] || task.stage}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Probability
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.probability}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Expected Close Date
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.expectedCloseDate ? formatDate(task.expectedCloseDate) : 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Lead Source
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.leadSource || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Description
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                {task.description || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Assigned To
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.assignedTo?.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Created By
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {task.createdBy?.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Created At
              </label>
              <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newTask,
  setNewTask,
}) => {
  const taskConstants = useTaskConstants();
  const { user } = useAuth() as { user: User | null };
  const [outlets, setOutlets] = useState<any[]>([]);
  const [outletSearch, setOutletSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isAdmin = user?.permissions?.includes("SUPER_ADMIN_ACCESS") || user?.permissions?.includes("ADMIN_ACCESS") || false;

  const fetchOutlets = async (search: string) => {
    try {
      setLoadingOutlets(true);
      const response = await api.get(`/outlets?search=${encodeURIComponent(search)}`);
      const data = response.data.outlets || response.data;
      setOutlets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoadingOutlets(false);
    }
  };

  const fetchUsers = async (search: string) => {
    try {
      setLoadingUsers(true);
      const response = await api.get(`/users?search=${encodeURIComponent(search)}`);
      const data = response.data.users || response.data;
      setUsers(
        Array.isArray(data)
          ? data.map((user) => ({
            id: user.id,
            name: user.fullName,
          }))
          : []
      );
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen && showDropdown) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        fetchOutlets(outletSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isOpen, showDropdown, outletSearch]);

  useEffect(() => {
    if (isOpen && showUserDropdown) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        fetchUsers(userSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isOpen, showUserDropdown, userSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOutlets = outlets.filter((outlet) =>
    outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const selectedOutletName = newTask.outletId
    ? outlets.find((o) => o.id.toString() === newTask.outletId)?.outletName || ''
    : '';

  const selectedUserName = newTask.assignedTo?.id
    ? users.find((u) => u.id.toString() === newTask.assignedTo?.id)?.name || ''
    : '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Add New Task
          </h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="addTaskForm" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Name
                </label>
                <Input
                  name="name"
                  value={newTask.name || ''}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  required
                />
              </div>

              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet
                </label>
                <Input
                  value={outletSearch || selectedOutletName}
                  onChange={(e) => {
                    setOutletSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    setShowDropdown(true);
                    if (!outlets.length && !loadingOutlets) {
                      fetchOutlets('');
                    }
                  }}
                  placeholder={loadingOutlets ? 'Loading outlets...' : 'Search outlet...'}
                  required
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {loadingOutlets ? (
                      <div className="px-3 py-2">Loading...</div>
                    ) : filteredOutlets.length > 0 ? (
                      filteredOutlets.map((outlet) => (
                        <div
                          key={outlet.id}
                          className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                          onClick={() => {
                            setNewTask({ ...newTask, outletId: outlet.id.toString() });
                            setOutletSearch(outlet.outletName);
                            setShowDropdown(false);
                          }}
                        >
                          {outlet.outletName}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2">No outlets found</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Amount
                </label>
                <Input
                  name="amount"
                  type="number"
                  value={newTask.amount !== undefined ? newTask.amount : ''}
                  onChange={(e) =>
                    setNewTask({ ...newTask, amount: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Stage
                </label>
                <select
                  name="stage"
                  value={newTask.stage || ''}
                  onChange={(e) => setNewTask({ ...newTask, stage: e.target.value as TaskStage })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  required
                >
                  {getTaskStageOptions(taskConstants).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newTask.status || ''}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    {getTaskStatusOptions(taskConstants).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Probability (%)
                </label>
                <Input
                  name="probability"
                  type="number"
                  value={newTask.probability !== undefined ? newTask.probability : ''}
                  onChange={(e) =>
                    setNewTask({ ...newTask, probability: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={0}
                  max={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Expected Close Date
                </label>
                <Input
                  name="expectedCloseDate"
                  type="date"
                  value={newTask.expectedCloseDate ? formatDateForInput(newTask.expectedCloseDate) : ''}
                  onChange={(e) => setNewTask({ ...newTask, expectedCloseDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Lead Source
                </label>
                <Input
                  name="leadSource"
                  value={newTask.leadSource || ''}
                  onChange={(e) => setNewTask({ ...newTask, leadSource: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div ref={userDropdownRef} className="relative">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Assigned To
                </label>
                <Input
                  value={userSearch || selectedUserName}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => {
                    setShowUserDropdown(true);
                    if (!users.length && !loadingUsers) {
                      fetchUsers('');
                    }
                  }}
                  placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
                />
                {showUserDropdown && (
                  <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {loadingUsers ? (
                      <div className="px-3 py-2">Loading...</div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                          onClick={() => {
                            setNewTask({ ...newTask, assignedTo: { id: user.id.toString(), name: user.name } });
                            setUserSearch(user.name);
                            setShowUserDropdown(false);
                          }}
                        >
                          {user.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2">No users found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button type="submit" form="addTaskForm">
            Add Task
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) => {
  const taskConstants = useTaskConstants();
  const { user } = useAuth() as { user: User | null };
  const [outlets, setOutlets] = useState<any[]>([]);
  const [outletSearch, setOutletSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const isAdmin = user?.permissions?.includes("SUPER_ADMIN_ACCESS") || user?.permissions?.includes("ADMIN_ACCESS") || false;

  useEffect(() => {
    if (isOpen && task?.outlet?.outletName) {
      setOutletSearch(task.outlet.outletName);
    }
    if (isOpen && task?.assignedTo?.name) {
      setUserSearch(task.assignedTo.name);
    }
    if (isOpen && task?.status) {
      setFormData(prev => ({ ...prev, status: task.status as TaskStatus }));

    }
  }, [isOpen, task]);


  const fetchOutlets = async (search: string) => {
    try {
      setLoadingOutlets(true);
      const response = await api.get(`/outlets?search=${encodeURIComponent(search)}`);
      const data = response.data.outlets || response.data;
      setOutlets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoadingOutlets(false);
    }
  };

  const fetchUsers = async (search: string) => {
    try {
      setLoadingUsers(true);
      const response = await api.get(`/users?search=${encodeURIComponent(search)}`);
      const data = response.data.users || response.data;
      setUsers(
        Array.isArray(data)
          ? data.map((user) => ({
            id: user.id,
            name: user.fullName,
          }))
          : []
      );
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen && showDropdown) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        fetchOutlets(outletSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isOpen, showDropdown, outletSearch]);

  useEffect(() => {
    if (isOpen && showUserDropdown) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        fetchUsers(userSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isOpen, showUserDropdown, userSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        const selectedOutlet = outlets.find((o) => o.id.toString() === formData.outletId);
        setOutletSearch(selectedOutlet?.outletName || task?.outlet?.outletName || '');
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
        const selectedUser = users.find((u) => u.id.toString() === formData.assignedTo?.id);
        setUserSearch(selectedUser?.name || task?.assignedTo?.name || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [formData.outletId, formData.assignedTo, task, outlets, users]);

  const filteredOutlets = outletSearch
    ? outlets.filter((outlet) =>
      outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase())
    )
    : outlets;

  const filteredUsers = userSearch
    ? users.filter((user) => user.name.toLowerCase().includes(userSearch.toLowerCase()))
    : users;

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Edit Task
          </h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="editTaskForm" onSubmit={(e) => onSubmit(e, task.id)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Name
                </label>
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet
                </label>
                <Input
                  value={outletSearch}
                  onChange={(e) => {
                    setOutletSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    setShowDropdown(true);
                    if (!outlets.length && !loadingOutlets) {
                      fetchOutlets('');
                    }
                  }}
                  placeholder={loadingOutlets ? 'Loading outlets...' : 'Search outlet...'}
                  required
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {loadingOutlets ? (
                      <div className="px-3 py-2">Loading...</div>
                    ) : filteredOutlets.length > 0 ? (
                      filteredOutlets.map((outlet) => (
                        <div
                          key={outlet.id}
                          className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, outletId: outlet.id.toString() });
                            setOutletSearch(outlet.outletName);
                            setShowDropdown(false);
                          }}
                        >
                          {outlet.outletName}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2">No outlets found</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Amount
                </label>
                <Input
                  name="amount"
                  type="number"
                  value={formData.amount !== undefined ? formData.amount : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage || ''}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as TaskStage })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  required
                >
                  {getTaskStageOptions(taskConstants).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        status: value === '' ? undefined : (value as TaskStatus),
                      });
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    {getTaskStatusOptions(taskConstants).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Probability (%)
                </label>
                <Input
                  name="probability"
                  type="number"
                  value={formData.probability !== undefined ? formData.probability : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, probability: e.target.value ? Number(e.target.value) : undefined })
                  }
                  min={0}
                  max={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Expected Close Date
                </label>
                <Input
                  name="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate ? formatDateForInput(formData.expectedCloseDate) : ''}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Lead Source
                </label>
                <Input
                  name="leadSource"
                  value={formData.leadSource || ''}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div ref={userDropdownRef} className="relative">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Assigned To
                </label>
                <Input
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => {
                    setShowUserDropdown(true);
                    if (!users.length && !loadingUsers) {
                      fetchUsers('');
                    }
                  }}
                  placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
                />
                {showUserDropdown && (
                  <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {loadingUsers ? (
                      <div className="px-3 py-2">Loading...</div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, assignedTo: { id: user.id.toString(), name: user.name } });
                            setUserSearch(user.name);
                            setShowUserDropdown(false);
                          }}
                        >
                          {user.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2">No users found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button type="submit" form="editTaskForm">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
