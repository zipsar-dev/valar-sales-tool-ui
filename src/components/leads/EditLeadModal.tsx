import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../lib/api';
import { Lead } from '../../types/leads';

interface EditLeadModalProps {
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
  editingLead: Lead | null;
  setEditingLead: (lead: Lead | null) => void;
  fetchLeads: () => Promise<void>;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({
  showEditModal,
  setShowEditModal,
  editingLead,
  setEditingLead,
  fetchLeads,
}) => {
  const handleEditLead = async (leadData: Partial<Lead>) => {
    if (!editingLead) return;
    try {
      await api.patch(`/leads/${editingLead.id}`, leadData);
      setShowEditModal(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 top-16 md:top-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-[95%] sm:max-w-md mx-2 sm:mx-4 my-4 sm:my-6 overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditModal(false);
                setEditingLead(null);
              }}
              className="text-sm"
            >
              ×
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const leadData: Partial<Lead> = {
                fullName: formData.get('fullName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                jobTitle: formData.get('jobTitle') as string,
                leadSource: formData.get('leadSource') as string,
                status: formData.get('status') as string,
                notes: formData.get('notes') as string,
              };

              if (editingLead) {
                handleEditLead(leadData);
              } else {
                api.post('/leads', leadData)
                  .then(() => {
                    setShowEditModal(false);
                    fetchLeads();
                  })
                  .catch((error) => {
                    console.error('Error creating lead:', error);
                  });
              }
            }}
          >
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <Input
                  name="fullName"
                  defaultValue={editingLead?.fullName || ''}
                  required
                  className="text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingLead?.email || ''}
                  required
                  className="text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone
                </label>
                <div className="relative">
                  <Input
                    name="phone"
                    type="tel"
                    defaultValue={editingLead?.phone || ''}
                    className="text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Job Title
                </label>
                <Input
                  name="jobTitle"
                  defaultValue={editingLead?.jobTitle || ''}
                  className="text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Lead Source
                </label>
                <Input
                  name="leadSource"
                  defaultValue={editingLead?.leadSource || ''}
                  className="text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingLead?.status || 'new'}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                  required
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>


              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  defaultValue={editingLead?.notes || ''}
                  className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3 pt-3 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLead(null);
                  }}
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-sm">
                  {editingLead ? 'Save Changes' : 'Add Lead'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditLeadModal;
