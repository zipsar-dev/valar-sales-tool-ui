import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Lead } from "../../types/leads";

interface LeadCardProps {
  lead: Lead;
  getInitials: (contactName: string) => string;
  setSelectedLead: (lead: Lead) => void;
  setShowViewModal: (value: boolean) => void;
  setEditingLead: (lead: Lead | null) => void;
  setShowEditModal: (value: boolean) => void;
  handleDeleteLead: (leadId: number) => Promise<void>;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  getInitials,
  setSelectedLead,
  setShowViewModal,
  setEditingLead,
  setShowEditModal,
  handleDeleteLead,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow w-full">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400 flex-shrink-0">
          {lead.outlet ? getInitials(lead.outlet.contactName) : "N/A"}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
            {lead.outlet?.contactName || "N/A"}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
            {lead.email}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
            {lead.outlet?.outletName || "No outlet"}
          </p>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <span
            className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lead.status === "new"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : lead.status === "contacted"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : lead.status === "qualified"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : lead.status === "proposal"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {lead.status}
          </span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Joined {formatDate(lead.createdAt)}</span>
        {lead.outlet?.id !== undefined && (
          <span>Outlet ID: {lead.outlet.id}</span>
        )}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelectedLead(lead);
            setShowViewModal(true);
          }}
          className="flex-1 min-w-[30%]"
        >
          <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingLead(lead);
            setShowEditModal(true);
          }}
          className="flex-1 min-w-[30%]"
        >
          <Edit className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteLead(lead.id)}
          className="flex-1 min-w-[30%] text-error-600 hover:text-error-900"
        >
          <Trash2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default LeadCard;
