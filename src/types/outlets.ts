export interface Outlet {
  id: string;
  outletName: string;

  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  outletType?: string;


  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;

  notes?: string;
  assignedTo?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomersResponse {
  customers: Outlet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
