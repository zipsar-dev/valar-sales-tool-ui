import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../lib/api';
import { Lead } from '../types/leads';

interface AddLeadModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  onAddLead: (leadData: Partial<Lead>) => Promise<void>;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  showAddModal,
  setShowAddModal,
  onAddLead,
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [outlets, setOutlets] = useState<any[]>([]);
  const [outletSearch, setOutletSearch] = useState('');
  const [showOutletDropdown, setShowOutletDropdown] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [assignedToSearch, setAssignedToSearch] = useState('');
  const [createdBySearch, setCreatedBySearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState<'assignedTo' | 'createdBy' | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const outletDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchOutlets = async (search: string) => {
    try {
      setLoadingOutlets(true);
      const response = await api.get(`/outlets?search=${encodeURIComponent(search)}`);
      const data = response.data.data.outlets || response.data.data;
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
      const data = response.data.data.users || response.data.data;
      setUsers(
        Array.isArray(data)
          ? data.map((user) => ({
              id: user.id,
              name: user.fullName || user.name,
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
    if (showAddModal && showOutletDropdown) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchOutlets(outletSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [showAddModal, showOutletDropdown, outletSearch]);

  useEffect(() => {
    if (showAddModal && showUserDropdown) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchUsers(showUserDropdown === 'assignedTo' ? assignedToSearch : createdBySearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [showAddModal, showUserDropdown, assignedToSearch, createdBySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (outletDropdownRef.current && !outletDropdownRef.current.contains(event.target as Node)) {
        setShowOutletDropdown(false);
        const selectedOutlet = outlets.find((o) => o.id === formData.outlet?.id);
        setOutletSearch(selectedOutlet?.outletName || '');
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(null);
        const selectedAssignedTo = users.find((u) => u.id === formData.assignedTo?.id);
        const selectedCreatedBy = users.find((u) => u.id === formData.createdBy?.id);
        setAssignedToSearch(selectedAssignedTo?.name || '');
        setCreatedBySearch(selectedCreatedBy?.name || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [formData.outlet, formData.assignedTo, formData.createdBy, outlets, users]);

  const filteredOutlets = outletSearch
    ? outlets.filter((outlet) => outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase()))
    : outlets;

  const filteredUsers = (search: string) =>
    search ? users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())) : users;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onAddLead(formData);
    setShowAddModal(false);
    setFormData({});
    setOutletSearch('');
    setAssignedToSearch('');
    setCreatedBySearch('');
  };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Add New Lead</h2>
          <Button variant="ghost" onClick={() => setShowAddModal(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="addLeadForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Job Title</label>
              <Input
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lead Source</label>
              <select
                name="leadSource"
                value={formData.leadSource || ''}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Select Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                rows={4}
              />
            </div>

            <div ref={outletDropdownRef} className="relative">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet</label>
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
                placeholder={loadingOutlets ? 'Loading outlets...' : 'Search outlet...'}
              />
              {showOutletDropdown && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingOutlets ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredOutlets.length > 0 ? (
                    filteredOutlets.map((outlet) => (
                      <div
                        key={outlet.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            outlet: {
                              id: outlet.id,
                              outletName: outlet.outletName,
                              contactName: outlet.contactName,
                              email: outlet.email,
                              phone: outlet.phone,
                            },
                          });
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Assigned To</label>
              <Input
                value={assignedToSearch}
                onChange={(e) => {
                  setAssignedToSearch(e.target.value);
                  setShowUserDropdown('assignedTo');
                }}
                onFocus={() => {
                  setShowUserDropdown('assignedTo');
                  if (!users.length && !loadingUsers) fetchUsers('');
                }}
                placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
              />
              {showUserDropdown === 'assignedTo' && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredUsers(assignedToSearch).length > 0 ? (
                    filteredUsers(assignedToSearch).map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, assignedTo: { id: user.id, name: user.name } });
                          setAssignedToSearch(user.name);
                          setShowUserDropdown(null);
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

            <div ref={userDropdownRef} className="relative">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Created By</label>
              <Input
                value={createdBySearch}
                onChange={(e) => {
                  setCreatedBySearch(e.target.value);
                  setShowUserDropdown('createdBy');
                }}
                onFocus={() => {
                  setShowUserDropdown('createdBy');
                  if (!users.length && !loadingUsers) fetchUsers('');
                }}
                placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
              />
              {showUserDropdown === 'createdBy' && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredUsers(createdBySearch).length > 0 ? (
                    filteredUsers(createdBySearch).map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, createdBy: { id: user.id, name: user.name } });
                          setCreatedBySearch(user.name);
                          setShowUserDropdown(null);
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
          </form>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button type="submit" form="addLeadForm">
            Add Lead
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface EditLeadModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editingLead: Lead | null;
  setEditingLead: (lead: Lead | null) => void;
  onEditLead: (leadData: Partial<Lead>) => Promise<void>;
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  showEditModal,
  setShowEditModal,
  editingLead,
  setEditingLead,
  onEditLead,
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>(editingLead || {});
  const [outlets, setOutlets] = useState<any[]>([]);
  const [outletSearch, setOutletSearch] = useState(editingLead?.outlet?.outletName || '');
  const [showOutletDropdown, setShowOutletDropdown] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [assignedToSearch, setAssignedToSearch] = useState(editingLead?.assignedTo?.name || '');
  const [createdBySearch, setCreatedBySearch] = useState(editingLead?.createdBy?.name || '');
  const [showUserDropdown, setShowUserDropdown] = useState<'assignedTo' | 'createdBy' | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const outletDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showEditModal && editingLead) {
      setFormData(editingLead);
      setOutletSearch(editingLead.outlet?.outletName || '');
      setAssignedToSearch(editingLead.assignedTo?.name || '');
      setCreatedBySearch(editingLead.createdBy?.name || '');
    }
  }, [showEditModal, editingLead]);

  const fetchOutlets = async (search: string) => {
    try {
      setLoadingOutlets(true);
      const response = await api.get(`/outlets?search=${encodeURIComponent(search)}`);
      const data = response.data.data.outlets || response.data.data;
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
      const data = response.data.data.users || response.data.data;
      setUsers(
        Array.isArray(data)
          ? data.map((user) => ({
              id: user.id,
              name: user.fullName || user.name,
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
    if (showEditModal && showOutletDropdown) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchOutlets(outletSearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [showEditModal, showOutletDropdown, outletSearch]);

  useEffect(() => {
    if (showEditModal && showUserDropdown) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchUsers(showUserDropdown === 'assignedTo' ? assignedToSearch : createdBySearch);
      }, 300);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [showEditModal, showUserDropdown, assignedToSearch, createdBySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (outletDropdownRef.current && !outletDropdownRef.current.contains(event.target as Node)) {
        setShowOutletDropdown(false);
        const selectedOutlet = outlets.find((o) => o.id === formData.outlet?.id);
        setOutletSearch(selectedOutlet?.outletName || editingLead?.outlet?.outletName || '');
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(null);
        const selectedAssignedTo = users.find((u) => u.id === formData.assignedTo?.id);
        const selectedCreatedBy = users.find((u) => u.id === formData.createdBy?.id);
        setAssignedToSearch(selectedAssignedTo?.name || editingLead?.assignedTo?.name || '');
        setCreatedBySearch(selectedCreatedBy?.name || editingLead?.createdBy?.name || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [formData.outlet, formData.assignedTo, formData.createdBy, editingLead, outlets, users]);

  const filteredOutlets = outletSearch
    ? outlets.filter((outlet) => outlet.outletName.toLowerCase().includes(outletSearch.toLowerCase()))
    : outlets;

  const filteredUsers = (search: string) =>
    search ? users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())) : users;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onEditLead(formData);
    setShowEditModal(false);
    setEditingLead(null);
  };

  if (!showEditModal || !editingLead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Edit Lead</h2>
          <Button
            variant="ghost"
            onClick={() => {
              setShowEditModal(false);
              setEditingLead(null);
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="editLeadForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Job Title</label>
              <Input
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lead Source</label>
              <select
                name="leadSource"
                value={formData.leadSource || ''}
                onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="">Select Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                rows={4}
              />
            </div>

            <div ref={outletDropdownRef} className="relative">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet</label>
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
                placeholder={loadingOutlets ? 'Loading outlets...' : 'Search outlet...'}
              />
              {showOutletDropdown && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingOutlets ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredOutlets.length > 0 ? (
                    filteredOutlets.map((outlet) => (
                      <div
                        key={outlet.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            outlet: {
                              id: outlet.id,
                              outletName: outlet.outletName,
                              contactName: outlet.contactName,
                              email: outlet.email,
                              phone: outlet.phone,
                            },
                          });
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Assigned To</label>
              <Input
                value={assignedToSearch}
                onChange={(e) => {
                  setAssignedToSearch(e.target.value);
                  setShowUserDropdown('assignedTo');
                }}
                onFocus={() => {
                  setShowUserDropdown('assignedTo');
                  if (!users.length && !loadingUsers) fetchUsers('');
                }}
                placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
              />
              {showUserDropdown === 'assignedTo' && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredUsers(assignedToSearch).length > 0 ? (
                    filteredUsers(assignedToSearch).map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, assignedTo: { id: user.id, name: user.name } });
                          setAssignedToSearch(user.name);
                          setShowUserDropdown(null);
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

            <div ref={userDropdownRef} className="relative">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Created By</label>
              <Input
                value={createdBySearch}
                onChange={(e) => {
                  setCreatedBySearch(e.target.value);
                  setShowUserDropdown('createdBy');
                }}
                onFocus={() => {
                  setShowUserDropdown('createdBy');
                  if (!users.length && !loadingUsers) fetchUsers('');
                }}
                placeholder={loadingUsers ? 'Loading users...' : 'Search user...'}
              />
              {showUserDropdown === 'createdBy' && (
                <div className="absolute z-10 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-2">Loading...</div>
                  ) : filteredUsers(createdBySearch).length > 0 ? (
                    filteredUsers(createdBySearch).map((user) => (
                      <div
                        key={user.id}
                        className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => {
                          setFormData({ ...formData, createdBy: { id: user.id, name: user.name } });
                          setCreatedBySearch(user.name);
                          setShowUserDropdown(null);
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
          </form>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowEditModal(false);
              setEditingLead(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="editLeadForm">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface ViewLeadModalProps {
  showViewModal: boolean;
  setShowViewModal: (show: boolean) => void;
  selectedLead: Lead | null;
  getInitials: (contactName: string) => string;
}

export const ViewLeadModal: React.FC<ViewLeadModalProps> = ({
  showViewModal,
  setShowViewModal,
  selectedLead,
  getInitials,
}) => {
  if (!showViewModal || !selectedLead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Lead Details</h2>
            <Button variant="ghost" onClick={() => setShowViewModal(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  {selectedLead.outlet ? getInitials(selectedLead.outlet.contactName) : 'N/A'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  {selectedLead.outlet?.contactName || 'N/A'}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedLead.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.phone || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet Name</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.outlet?.outletName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet Contact Name</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.outlet?.contactName || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet Email</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.outlet?.email || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Outlet Phone</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.outlet?.phone || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Job Title</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.jobTitle || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Lead Source</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.leadSource || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedLead.status === 'new'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : selectedLead.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : selectedLead.status === 'qualified'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedLead.status === 'proposal'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {selectedLead.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Assigned To</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.assignedTo?.name || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Created By</label>
                <p className="text-sm text-neutral-900 dark:text-white">{selectedLead.createdBy?.name || 'N/A'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
                <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">{selectedLead.notes || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};