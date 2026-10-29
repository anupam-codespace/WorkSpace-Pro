export type ProjectMode = 'quick' | 'guided';

export type ProjectIntent = 'delivery' | 'experiment' | 'internal';

export type SuccessType = 'deliverable' | 'metric' | 'undefined';

export type DeadlineType = 'none' | 'target' | 'fixed';

export type WorkStructure = 'linear' | 'milestones' | 'multistream';

export interface ProjectDeliverable {
  id: string;
  title: string;
  /** ISO date string, e.g. 2025-12-25 */
  dueDate?: string;
}

export interface ProjectMetric {
  id: string;
  name: string;
  target?: string;
}

export type OwnershipAccessLevel = 'full_access' | 'can_edit' | 'can_view';

export interface OwnershipEntry {
  accountId: string;
  access: Exclude<OwnershipAccessLevel, 'full_access'>;
}

export interface ProjectData {
  mode?: ProjectMode;
  intent?: ProjectIntent;
  successType: SuccessType;
  deliverables: ProjectDeliverable[];
  metrics?: ProjectMetric[];
  description?: string;
  metricName?: string;
  metricTarget?: string;
  deadlineType: DeadlineType;
  deadlineDate?: string; 
  ownerId?: string;
  contributorIds: string[];
  stakeholderIds: string[];
  contributorOwnerships?: OwnershipEntry[];
  stakeholderOwnerships?: OwnershipEntry[];
  structure?: WorkStructure;
  addStarterTasks: boolean;
  clientId?: string;
}
