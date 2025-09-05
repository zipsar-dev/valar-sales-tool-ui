export interface AssignedTo {
  id: number;
  name: string;
}

export interface CreatedBy {
  id: number;
  name: string;
}

export interface Outlet {
  id: number;
  outletName: string;
  contactName: string;
  email: string;
  phone: string;
}

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  leadSource?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: AssignedTo;
  createdBy?: CreatedBy;
  outlet?: Outlet;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}