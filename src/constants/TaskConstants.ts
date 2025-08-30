export type TaskStage = 'NEW' | 'CONTACTED' | 'DEMO' | 'OFFER_SENT' | 'NEGOTIATION' | 'FINALIZING' | 'WON' | 'LOST';
export type TaskStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TaskConstants {
  taskStageOptions: any;
  taskStatusOptions: any;
  stages: Record<TaskStage, string>;
  statuses: Record<TaskStatus, string>;
}

export const TASK_STAGES: Record<TaskStage, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  DEMO: 'Demo',
  OFFER_SENT: 'Offer Sent',
  NEGOTIATION: 'Negotiation',
  FINALIZING: 'Finalizing',
  WON: 'Won',
  LOST: 'Lost',
};

export const TASK_STATUS: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILED: 'Failed',
};

export const TASK_STAGE_COLORS: Record<TaskStage, string> = {
  NEW: "#3B82F6", // Blue
  CONTACTED: "#10B981", // Green
  DEMO: "#F59E0B", // Amber
  OFFER_SENT: "#8B5CF6", // Purple
  NEGOTIATION: "#EC4899", // Pink
  FINALIZING: "#14B8A6", // Teal
  WON: "#059669", // Emerald
  LOST: "#EF4444", // Red
};