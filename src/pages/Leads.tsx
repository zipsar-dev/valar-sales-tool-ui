import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Pagination from '../components/common/Pagination';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import { AddLeadModal, EditLeadModal, ViewLeadModal } from '../modals/leads';
import { Lead } from '../types/leads';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, searchTerm, statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });

      const response = await api.get(`/leads?${params}`);
      const { leads, pagination: pag } = response.data;

      setLeads(leads);
      setPagination(pag);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: Partial<Lead>) => {
    try {
      await api.post('/leads', leadData);
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleEditLead = async (leadData: Partial<Lead>) => {
    if (!editingLead) return;
    try {
      await api.patch(`/leads/${editingLead.id}`, leadData);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${leadId}`);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const getInitials = (contactName: string) => {
    const names = contactName.split(' ');
    return names.length > 1
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      : contactName.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 w-full max-w-full">
        <div className="truncate">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
            Leads Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage and monitor all leads
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto text-sm"
        >
          Add New Lead
        </Button>
      </div>

      {/* Filters */}
      <Card className="w-full max-w-full box-border">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <div className="flex-1 max-w-full">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 sm:w-5 h-4 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-8 sm:pl-10 text-sm w-full max-w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-2 sm:px-4 py-1 sm:py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm w-full sm:w-auto"
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-2 sm:px-4 py-1 sm:py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm w-full sm:w-auto"
              >
                <option value="">All Sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Cold Call">Cold Call</option>
              </select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSourceFilter('');
                  setPagination({ ...pagination, page: 1 });
                }}
                className="text-sm"
              >
                <Filter className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Leads Display */}
      <Card className="w-full max-w-full box-border">
        <div className="p-3 sm:p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48 sm:h-64 w-full">
              <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden md:block w-full max-w-full">
                <LeadTable
                  leads={leads}
                  getInitials={getInitials}
                  setSelectedLead={setSelectedLead}
                  setShowViewModal={setShowViewModal}
                  setEditingLead={setEditingLead}
                  setShowEditModal={setShowEditModal}
                  handleDeleteLead={handleDeleteLead}
                />
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3 sm:space-y-4 w-full max-w-full">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    getInitials={getInitials}
                    setSelectedLead={setSelectedLead}
                    setShowViewModal={setShowViewModal}
                    setEditingLead={setEditingLead}
                    setShowEditModal={setShowEditModal}
                    handleDeleteLead={handleDeleteLead}
                  />
                ))}
              </div>

              {leads.length === 0 && (
                <div className="text-center py-8 sm:py-12 w-full max-w-full">
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No leads found
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
        />
      )}

      <AddLeadModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onAddLead={handleAddLead}
      />

      <ViewLeadModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedLead={selectedLead}
        getInitials={getInitials}
      />

      <EditLeadModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingLead={editingLead}
        setEditingLead={setEditingLead}
        onEditLead={handleEditLead}
      />
    </div>
  );
};

export default Leads;