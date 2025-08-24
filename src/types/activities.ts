export interface Activity {
  id: number;
  type: string;
  subject: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  leadId?: number;
  taskId?: number;
  outletId?: number;
  assignedTo?: { id?: number; name: string };
  createdBy?: { id?: number; name: string };
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  outlet?: {
    id: number;
    outletName: string;
    contactName: string;
    email: string;
    phone: string;
  };
  lead?: {
    id: number;
    name: string;
  };
  task?: {
    id: number;
    name: string;
  };
}

export interface ActivitiesResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}