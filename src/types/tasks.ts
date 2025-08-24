import { TaskStage, TaskStatus } from '../constants/TaskConstants';

export interface Task {
  id: string;
  name: string;
  outletId?: string;
  amount: number;
  stage: TaskStage;
  status?: TaskStatus;
  probability: number;
  expectedCloseDate?: string;
  leadSource?: string;
  description?: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
  outlet?: {
    id: string;
    outletName: string;
    contactName: string;
    email: string;
    phone: string;
  };
}


export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
