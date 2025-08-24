import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Activity } from '../types/activities';
import api from '../lib/api';

// Props interfaces for each modal
interface ViewActivityModalProps {
    activity: Activity | null;
    isOpen: boolean;
    onClose: () => void;
}

interface EditActivityModalProps {
    activity: Activity | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (activity: Activity) => void;
}

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (activity: Partial<Activity>) => void;
}

// View Activity Modal Component
export const ViewActivityModal: React.FC<ViewActivityModalProps> = ({ activity, isOpen, onClose }) => {
    if (!isOpen || !activity) return null;

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Activity Details
                        </h2>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                                    {getInitials(activity.subject)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                                    {activity.subject}
                                </h3>
                                <p className="text-neutral-500 dark:text-neutral-400">{activity.type}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Status
                                </label>
                                <p className="mt-1 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        activity.status === 'completed'
                                            ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                                            : activity.status === 'cancelled'
                                                ? 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                                                : 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                                    }`}>
                                        {activity.status}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Priority
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.priority}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Due Date
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {formatDate(activity.dueDate)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Created
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {formatDate(activity.createdAt)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Completed
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {formatDate(activity.completedAt)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Assigned To
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.assignedTo?.name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Created By
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.createdBy?.name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Lead
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.lead?.name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Task
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.task?.name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Outlet
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.outlet?.outletName || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Contact Name
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.outlet?.contactName || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Contact Email
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.outlet?.email || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Contact Phone
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.outlet?.phone || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {activity.description && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Description
                                </label>
                                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                                    {activity.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

// Edit Activity Modal Component
export const EditActivityModal: React.FC<EditActivityModalProps> = ({ activity, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Activity>({
        id: 0,
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
        createdBy: { id: undefined, name: '' },
        createdAt: '',
        updatedAt: '',
        completedAt: '',
        outlet: { id: 0, outletName: '', contactName: '', email: '', phone: '' },
        lead: { id: 0, name: '' },
        task: { id: 0, name: '' },
    });
    const [outlets, setOutlets] = useState<any[]>([]);
    const [outletSearch, setOutletSearch] = useState('');
    const [showOutletDropdown, setShowOutletDropdown] = useState(false);
    const [loadingOutlets, setLoadingOutlets] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [leadSearch, setLeadSearch] = useState('');
    const [showLeadDropdown, setShowLeadDropdown] = useState(false);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]);
    const [taskSearch, setTaskSearch] = useState('');
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const outletDropdownRef = useRef<HTMLDivElement>(null);
    const leadDropdownRef = useRef<HTMLDivElement>(null);
    const taskDropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen && activity) {
            setFormData(activity);
            setOutletSearch(activity.outlet?.outletName || '');
            setLeadSearch(activity.lead?.name || '');
            setTaskSearch(activity.task?.name || '');
            setUserSearch(activity.assignedTo?.name || '');
        }
    }, [isOpen, activity]);

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

    const fetchLeads = async (search: string) => {
        try {
            setLoadingLeads(true);
            const response = await api.get(`/leads?search=${encodeURIComponent(search)}`);
            const data = response.data.leads || response.data;
            setLeads(Array.isArray(data) ? data.map(lead => ({ id: lead.id, name: lead.name })) : []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoadingLeads(false);
        }
    };

    const fetchTasks = async (search: string) => {
        try {
            setLoadingTasks(true);
            const response = await api.get(`/tasks?search=${encodeURIComponent(search)}`);
            const data = response.data.tasks || response.data;
            setTasks(Array.isArray(data) ? data.map(task => ({ id: task.id, name: task.name })) : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoadingTasks(false);
        }
    };

    const fetchUsers = async (search: string) => {
        try {
            setLoadingUsers(true);
            const response = await api.get(`/users?search=${encodeURIComponent(search)}`);
            const data = response.data.users || response.data;
            setUsers(Array.isArray(data) ? data.map(user => ({ id: user.id, name: user.fullName })) : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (isOpen && showOutletDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchOutlets(outletSearch), 300);
        }
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [isOpen, showOutletDropdown, outletSearch]);

    useEffect(() => {
        if (isOpen && showLeadDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchLeads(leadSearch), 300);
        }
    }, [isOpen, showLeadDropdown, leadSearch]);

    useEffect(() => {
        if (isOpen && showTaskDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchTasks(taskSearch), 300);
        }
    }, [isOpen, showTaskDropdown, taskSearch]);

    useEffect(() => {
        if (isOpen && showUserDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchUsers(userSearch), 300);
        }
    }, [isOpen, showUserDropdown, userSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (outletDropdownRef.current && !outletDropdownRef.current.contains(event.target as Node)) {
                setShowOutletDropdown(false);
                const selectedOutlet = outlets.find(o => o.id.toString() === formData.outletId);
                setOutletSearch(selectedOutlet?.outletName || activity?.outlet?.outletName || '');
            }
            if (leadDropdownRef.current && !leadDropdownRef.current.contains(event.target as Node)) {
                setShowLeadDropdown(false);
                const selectedLead = leads.find(l => l.id.toString() === formData.leadId);
                setLeadSearch(selectedLead?.name || activity?.lead?.name || '');
            }
            if (taskDropdownRef.current && !taskDropdownRef.current.contains(event.target as Node)) {
                setShowTaskDropdown(false);
                const selectedTask = tasks.find(t => t.id.toString() === formData.taskId);
                setTaskSearch(selectedTask?.name || activity?.task?.name || '');
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
                const selectedUser = users.find(u => u.id.toString() === formData.assignedTo?.id);
                setUserSearch(selectedUser?.name || activity?.assignedTo?.name || '');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [formData.outletId, formData.leadId, formData.taskId, formData.assignedTo, activity, outlets, leads, tasks, users]);

    const filteredOutlets = outletSearch
        ? outlets.filter(outlet => outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase()))
        : outlets;
    const filteredLeads = leadSearch
        ? leads.filter(lead => lead.name.toLowerCase().includes(leadSearch.toLowerCase()))
        : leads;
    const filteredTasks = taskSearch
        ? tasks.filter(task => task.name.toLowerCase().includes(taskSearch.toLowerCase()))
        : tasks;
    const filteredUsers = userSearch
        ? users.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()))
        : users;

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col bg-white dark:bg-neutral-800">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Edit Activity
                    </h2>
                    <Button variant="ghost" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="editActivityForm" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="Call">Call</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Email">Email</option>
                                    <option value="Task">Task</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Subject
                                </label>
                                <Input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
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

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'planned' | 'in_progress' | 'completed' | 'cancelled' })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="planned">Planned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Due Date
                                </label>
                                <Input
                                    name="dueDate"
                                    type="datetime-local"
                                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            <div ref={leadDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Lead
                                </label>
                                <Input
                                    value={leadSearch}
                                    onChange={(e) => {
                                        setLeadSearch(e.target.value);
                                        setShowLeadDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowLeadDropdown(true);
                                        if (!leads.length && !loadingLeads) fetchLeads('');
                                    }}
                                    placeholder={loadingLeads ? "Loading leads..." : "Search lead..."}
                                />
                                {showLeadDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingLeads ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredLeads.length > 0 ? (
                                            filteredLeads.map(lead => (
                                                <div
                                                    key={lead.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, leadId: lead.id.toString() });
                                                        setLeadSearch(lead.name);
                                                        setShowLeadDropdown(false);
                                                    }}
                                                >
                                                    {lead.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2">No leads found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div ref={taskDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Task
                                </label>
                                <Input
                                    value={taskSearch}
                                    onChange={(e) => {
                                        setTaskSearch(e.target.value);
                                        setShowTaskDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowTaskDropdown(true);
                                        if (!tasks.length && !loadingTasks) fetchTasks('');
                                    }}
                                    placeholder={loadingTasks ? "Loading tasks..." : "Search task..."}
                                />
                                {showTaskDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingTasks ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredTasks.length > 0 ? (
                                            filteredTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, taskId: task.id.toString() });
                                                        setTaskSearch(task.name);
                                                        setShowTaskDropdown(false);
                                                    }}
                                                >
                                                    {task.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2">No tasks found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div ref={outletDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Outlet
                                </label>
                                <Input
                                    value={outletSearch}
                                    onChange={(e) => {
                                        setOutletSearch(e.target.value);
                                        setShowOutletDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowOutletDropdown(true);
                                        if (!outlets.length && !loadingOutlets) fetchOutlets('');
                                    }}
                                    placeholder={loadingOutlets ? "Loading outlets..." : "Search outlet..."}
                                />
                                {showOutletDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingOutlets ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredOutlets.length > 0 ? (
                                            filteredOutlets.map(outlet => (
                                                <div
                                                    key={outlet.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, outletId: outlet.id.toString() });
                                                        setOutletSearch(outlet.outletName);
                                                        setShowOutletDropdown(false);
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
                                        if (!users.length && !loadingUsers) fetchUsers('');
                                    }}
                                    placeholder={loadingUsers ? "Loading users..." : "Search user..."}
                                />
                                {showUserDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingUsers ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
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
                    <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button type="submit" form="editActivityForm">
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// Add Activity Modal Component
export const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState<Partial<Activity>>({
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
    const [outlets, setOutlets] = useState<any[]>([]);
    const [outletSearch, setOutletSearch] = useState('');
    const [showOutletDropdown, setShowOutletDropdown] = useState(false);
    const [loadingOutlets, setLoadingOutlets] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [leadSearch, setLeadSearch] = useState('');
    const [showLeadDropdown, setShowLeadDropdown] = useState(false);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]);
    const [taskSearch, setTaskSearch] = useState('');
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const outletDropdownRef = useRef<HTMLDivElement>(null);
    const leadDropdownRef = useRef<HTMLDivElement>(null);
    const taskDropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

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

    const fetchLeads = async (search: string) => {
        try {
            setLoadingLeads(true);
            const response = await api.get(`/leads?search=${encodeURIComponent(search)}`);
            const data = response.data.leads || response.data;
            setLeads(Array.isArray(data) ? data.map(lead => ({ id: lead.id, name: lead.name })) : []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoadingLeads(false);
        }
    };

    const fetchTasks = async (search: string) => {
        try {
            setLoadingTasks(true);
            const response = await api.get(`/tasks?search=${encodeURIComponent(search)}`);
            const data = response.data.tasks || response.data;
            setTasks(Array.isArray(data) ? data.map(task => ({ id: task.id, name: task.name })) : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoadingTasks(false);
        }
    };

    const fetchUsers = async (search: string) => {
        try {
            setLoadingUsers(true);
            const response = await api.get(`/users?search=${encodeURIComponent(search)}`);
            const data = response.data.users || response.data;
            setUsers(Array.isArray(data) ? data.map(user => ({ id: user.id, name: user.fullName })) : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (isOpen && showOutletDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchOutlets(outletSearch), 300);
        }
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [isOpen, showOutletDropdown, outletSearch]);

    useEffect(() => {
        if (isOpen && showLeadDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchLeads(leadSearch), 300);
        }
    }, [isOpen, showLeadDropdown, leadSearch]);

    useEffect(() => {
        if (isOpen && showTaskDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchTasks(taskSearch), 300);
        }
    }, [isOpen, showTaskDropdown, taskSearch]);

    useEffect(() => {
        if (isOpen && showUserDropdown) {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => fetchUsers(userSearch), 300);
        }
    }, [isOpen, showUserDropdown, userSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (outletDropdownRef.current && !outletDropdownRef.current.contains(event.target as Node)) {
                setShowOutletDropdown(false);
                const selectedOutlet = outlets.find(o => o.id.toString() === formData.outletId);
                setOutletSearch(selectedOutlet?.outletName || '');
            }
            if (leadDropdownRef.current && !leadDropdownRef.current.contains(event.target as Node)) {
                setShowLeadDropdown(false);
                const selectedLead = leads.find(l => l.id.toString() === formData.leadId);
                setLeadSearch(selectedLead?.name || '');
            }
            if (taskDropdownRef.current && !taskDropdownRef.current.contains(event.target as Node)) {
                setShowTaskDropdown(false);
                const selectedTask = tasks.find(t => t.id.toString() === formData.taskId);
                setTaskSearch(selectedTask?.name || '');
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
                const selectedUser = users.find(u => u.id.toString() === formData.assignedTo?.id);
                setUserSearch(selectedUser?.name || '');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [formData.outletId, formData.leadId, formData.taskId, formData.assignedTo, outlets, leads, tasks, users]);

    const filteredOutlets = outletSearch
        ? outlets.filter(outlet => outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase()))
        : outlets;
    const filteredLeads = leadSearch
        ? leads.filter(lead => lead.name.toLowerCase().includes(leadSearch.toLowerCase()))
        : leads;
    const filteredTasks = taskSearch
        ? tasks.filter(task => task.name.toLowerCase().includes(taskSearch.toLowerCase()))
        : tasks;
    const filteredUsers = userSearch
        ? users.filter(user => user.name.toLowerCase().includes(userSearch.toLowerCase()))
        : users;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
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
        setOutletSearch('');
        setLeadSearch('');
        setTaskSearch('');
        setUserSearch('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col bg-white dark:bg-neutral-800">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Add New Activity
                    </h2>
                    <Button variant="ghost" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="addActivityForm" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="Call">Call</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Email">Email</option>
                                    <option value="Task">Task</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Subject
                                </label>
                                <Input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
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

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'planned' | 'in_progress' | 'completed' | 'cancelled' })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="planned">Planned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Due Date
                                </label>
                                <Input
                                    name="dueDate"
                                    type="datetime-local"
                                    value={formData.dueDate || ''}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            <div ref={leadDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Lead
                                </label>
                                <Input
                                    value={leadSearch}
                                    onChange={(e) => {
                                        setLeadSearch(e.target.value);
                                        setShowLeadDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowLeadDropdown(true);
                                        if (!leads.length && !loadingLeads) fetchLeads('');
                                    }}
                                    placeholder={loadingLeads ? "Loading leads..." : "Search lead..."}
                                />
                                {showLeadDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingLeads ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredLeads.length > 0 ? (
                                            filteredLeads.map(lead => (
                                                <div
                                                    key={lead.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, leadId: lead.id.toString() });
                                                        setLeadSearch(lead.name);
                                                        setShowLeadDropdown(false);
                                                    }}
                                                >
                                                    {lead.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2">No leads found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div ref={taskDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Task
                                </label>
                                <Input
                                    value={taskSearch}
                                    onChange={(e) => {
                                        setTaskSearch(e.target.value);
                                        setShowTaskDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowTaskDropdown(true);
                                        if (!tasks.length && !loadingTasks) fetchTasks('');
                                    }}
                                    placeholder={loadingTasks ? "Loading tasks..." : "Search task..."}
                                />
                                {showTaskDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingTasks ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredTasks.length > 0 ? (
                                            filteredTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, taskId: task.id.toString() });
                                                        setTaskSearch(task.name);
                                                        setShowTaskDropdown(false);
                                                    }}
                                                >
                                                    {task.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2">No tasks found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div ref={outletDropdownRef} className="relative">
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Outlet
                                </label>
                                <Input
                                    value={outletSearch}
                                    onChange={(e) => {
                                        setOutletSearch(e.target.value);
                                        setShowOutletDropdown(true);
                                    }}
                                    onFocus={() => {
                                        setShowOutletDropdown(true);
                                        if (!outlets.length && !loadingOutlets) fetchOutlets('');
                                    }}
                                    placeholder={loadingOutlets ? "Loading outlets..." : "Search outlet..."}
                                />
                                {showOutletDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingOutlets ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredOutlets.length > 0 ? (
                                            filteredOutlets.map(outlet => (
                                                <div
                                                    key={outlet.id}
                                                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                                    onClick={() => {
                                                        setFormData({ ...formData, outletId: outlet.id.toString() });
                                                        setOutletSearch(outlet.outletName);
                                                        setShowOutletDropdown(false);
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
                                        if (!users.length && !loadingUsers) fetchUsers('');
                                    }}
                                    placeholder={loadingUsers ? "Loading users..." : "Search user..."}
                                />
                                {showUserDropdown && (
                                    <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {loadingUsers ? (
                                            <div className="px-3 py-2">Loading...</div>
                                        ) : filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
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
                    <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button type="submit" form="addActivityForm">
                        Add Activity
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// Export all modal components
export default {
    ViewActivityModal,
    EditActivityModal,
    AddActivityModal,
};