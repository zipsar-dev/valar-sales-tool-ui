import React from 'react';
import { Outlet } from '../types/outlets';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ViewOutletModalProps extends ModalProps {
  outlet: Outlet | null;
}

interface EditOutletModalProps extends ModalProps {
  outlet: Outlet | null;
  onSave: (outletData: Partial<Outlet>) => void;
}

interface AddOutletModalProps extends ModalProps {
  onSave: (outletData: Partial<Outlet>) => void;
}

// Helper function for formatting date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function for initials
const getInitials = (outletName: string) => {
  return outletName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};


export const ViewOutletModal: React.FC<ViewOutletModalProps> = ({
  isOpen,
  onClose,
  outlet
}) => {
  if (!isOpen || !outlet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Outlet Details
            </h2>
            <Button
              variant="ghost"
              onClick={onClose}
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary-600 dark:text-primary-400">
                  {getInitials(outlet.outletName)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  {outlet.outletName}
                </h3>

                <p className="text-neutral-500 dark:text-neutral-400">{outlet.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Contact Name
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.contactName || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.phone || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet Type
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.outletType || 'N/A'}
                </p>
              </div>


              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Address
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.address ?
                    `${outlet.address}, ${outlet.city}, ${outlet.state || ''}, ${outlet.country || ''} ${outlet.postalCode || ''}`
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Website
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.website || 'N/A'}
                </p>
              </div>



              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Created
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {formatDate(outlet.createdAt)}
                </p>
              </div>
            </div>

            {outlet.notes && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Notes
                </label>
                <p className="mt-1 text-sm text-neutral-900 dark:text-white">
                  {outlet.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AddOutletModal: React.FC<AddOutletModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      outletName: formData.get('outletName') as string,
      contactName: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string,
      outletType: formData.get('outletType') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
      notes: formData.get('notes') as string,
    });
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Add New Outlet
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="addOutletForm" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Outlet Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet Name
                </label>
                <Input
                  name="outletName"
                  required
                />
              </div>


              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Contact Name
                </label>
                <Input
                  name="contactName"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone
                </label>
                <Input
                  name="phone"
                  type="tel"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Website
                </label>
                <Input
                  name="website"
                />
              </div>

              {/* Outlet Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet Type
                </label>
                <Input
                  name="outletType"
                />
              </div>


              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Address
                </label>
                <Input
                  name="address"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  City
                </label>
                <Input
                  name="city"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  State
                </label>
                <Input
                  name="state"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Country
                </label>
                <Input
                  name="country"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Postal Code
                </label>
                <Input
                  name="postalCode"
                />
              </div>



              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" form="addOutletForm">
            Add Outlet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const EditOutletModal: React.FC<EditOutletModalProps> = ({
  isOpen,
  onClose,
  outlet,
  onSave
}) => {
  if (!isOpen || !outlet) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      outletName: formData.get('outletName') as string,
      contactName: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string,
      outletType: formData.get('outletType') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
      notes: formData.get('notes') as string,
    });

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Edit Outlet
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            ×
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="editOutletForm" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Outlet Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet Name
                </label>
                <Input
                  name="outletName"
                  defaultValue={outlet.outletName}
                  required
                />
              </div>


              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Contact Name
                </label>
                <Input
                  name="contactName"
                  defaultValue={outlet.contactName || ''}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={outlet.email}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Phone
                </label>
                <Input
                  name="phone"
                  type="tel"
                  defaultValue={outlet.phone || ''}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Website
                </label>
                <Input
                  name="website"
                  defaultValue={outlet.website || ''}
                />
              </div>

              {/* Outlet Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Outlet Type
                </label>
                <Input
                  name="outletType"
                  defaultValue={outlet.outletType || ''}
                />
              </div>


              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Address
                </label>
                <Input
                  name="address"
                  defaultValue={outlet.address || ''}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  City
                </label>
                <Input
                  name="city"
                  defaultValue={outlet.city || ''}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  State
                </label>
                <Input
                  name="state"
                  defaultValue={outlet.state || ''}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Country
                </label>
                <Input
                  name="country"
                  defaultValue={outlet.country || ''}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Postal Code
                </label>
                <Input
                  name="postalCode"
                  defaultValue={outlet.postalCode || ''}
                />
              </div>



              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  defaultValue={outlet.notes || ''}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-3 bg-white dark:bg-neutral-900">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" form="editOutletForm">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};
