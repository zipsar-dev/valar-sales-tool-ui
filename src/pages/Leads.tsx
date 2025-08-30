import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import api from "../lib/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Pagination from "../components/common/Pagination";
import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";
import { AddLeadModal, EditLeadModal, ViewLeadModal } from "../modals/leads";
import { Lead } from "../types/leads";

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const { leads, pagination: pag } = response.data.data;

      setLeads(leads);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: Partial<Lead>) => {
    try {
      await api.post("/leads", leadData);
      fetchLeads();
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleEditLead = async (leadData: Partial<Lead>) => {
    if (!editingLead) return;
    try {
      await api.patch(`/leads/${editingLead.id}`, leadData);
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${leadId}`);
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const getInitials = (contactName: string) => {
    const names = contactName.split(" ");
    return names.length > 1
      ? `${names[0].charAt(0)}${names[names.length - 1].charAt(
          0
        )}`.toUpperCase()
      : contactName.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto max-w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden box-border">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full max-w-full">
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white truncate">
                Leads Management
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                Manage and monitor all leads
              </p>
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap"
              >
                Add New Lead
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card
            className="w-full max-w-full box-border overflow-hidden"
            padding={`${isMobile ? "none" : "md"}`}
          >
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-4 w-full">
                {/* Search Bar - Full Width */}
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPagination({ ...pagination, page: 1 });
                      }}
                      className="pl-8 sm:pl-10 pr-4 text-sm sm:text-base w-full max-w-full focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  <div className="flex gap-2 sm:gap-3 flex-1">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPagination({ ...pagination, page: 1 });
                      }}
                      className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                      className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Sources</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Trade Show">Trade Show</option>
                      <option value="Cold Call">Cold Call</option>
                    </select>
                  </div>

                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("");
                        setSourceFilter("");
                        setPagination({ ...pagination, page: 1 });
                      }}
                      className="text-sm sm:text-base w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap"
                    >
                      <Filter className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Leads Display */}
          <Card
            className="w-full max-w-full box-border overflow-hidden"
            padding={`${isMobile ? "none" : "md"}`}
          >
            <div className="w-full max-w-full">
              {loading ? (
                <div className="flex items-center justify-center h-48 sm:h-64 lg:h-80 w-full">
                  <div className="animate-spin rounded-full h-6 sm:h-8 lg:h-10 w-6 sm:w-8 lg:w-10 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="w-full max-w-full overflow-hidden">
                  {/* Desktop/Large Tablet View */}
                  <div className="hidden lg:block w-full">
                    <div className="overflow-x-auto">
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
                  </div>

                  {/* Tablet View */}
                  <div className="hidden md:block lg:hidden w-full">
                    <div className="overflow-x-auto">
                      <div className="min-w-full">
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
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden w-full">
                    <div className="space-y-3 sm:space-y-4 w-full max-w-full p-2 sm:p-4">
                      {leads.map((lead) => (
                        <div key={lead.id} className="w-full max-w-full">
                          <LeadCard
                            lead={lead}
                            getInitials={getInitials}
                            setSelectedLead={setSelectedLead}
                            setShowViewModal={setShowViewModal}
                            setEditingLead={setEditingLead}
                            setShowEditModal={setShowEditModal}
                            handleDeleteLead={handleDeleteLead}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* No Results State */}
                  {leads.length === 0 && (
                    <div className="text-center py-8 sm:py-12 lg:py-16 w-full max-w-full px-4">
                      <div className="max-w-md mx-auto">
                        <h3 className="text-base sm:text-lg lg:text-xl font-medium text-neutral-900 dark:text-white mb-2">
                          No leads found
                        </h3>
                        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="w-full flex justify-center px-2 sm:px-4">
              <div className="w-full max-w-full overflow-x-auto">
                <Pagination
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </div>
            </div>
          )}

          {/* Modals */}
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
      </div>
    </div>
  );
};

export default Leads;
