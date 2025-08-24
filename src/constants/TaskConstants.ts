export type TaskStage = 'NEW' | 'CONTACTED' | 'DEMO' | 'OFFER_SENT' | 'NEGOTIATION' | 'FINALIZING' | 'WON' | 'LOST';
export type TaskStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TaskConstants {
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