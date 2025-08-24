import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Lead } from '../../types/leads';

interface LeadTableProps {
  leads: Lead[];
  getInitials: (contactName: string) => string;
  setSelectedLead: (lead: Lead) => void;
  setShowViewModal: (value: boolean) => void;
  setEditingLead: (lead: Lead | null) => void;
  setShowEditModal: (value: boolean) => void;
  handleDeleteLead: (leadId: number) => Promise<void>;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  getInitials,
  setSelectedLead,
  setShowViewModal,
  setEditingLead,
  setShowEditModal,
  handleDeleteLead,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1000px] divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[25%]">
              Lead
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[20%]">
              Contact
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[15%]">
              Outlet
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[15%]">
              Job Title
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[10%]">
              Status
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-[15%]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-medium text-primary-600 dark:text-primary-400">
                      {lead.outlet ? getInitials(lead.outlet.contactName) : 'N/A'}
                    </span>
                  </div>
                  <div className="ml-2 sm:ml-4 max-w-full">
                    <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white truncate">
                      {lead.outlet?.contactName || 'N/A'}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[80%] sm:max-w-[90%]">
                      {lead.notes || ''}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {lead.email}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {lead.outlet?.outletName || 'N/A'}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                {lead.jobTitle || 'N/A'}
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'new'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : lead.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : lead.status === 'qualified'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : lead.status === 'proposal'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowViewModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingLead(lead);
                      setShowEditModal(true);
                    }}
                    className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                  >
                    <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="text-error-600 hover:text-error-900"
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
};

export default LeadTable;