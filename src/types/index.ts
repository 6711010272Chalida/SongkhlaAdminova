export type ActiveTab =
  | 'dashboard'
  | 'intake'
  | 'registry'
  | 'tracking'
  | 'assignment'
  | 'reports'
  | 'analytics'
  | 'settings';

export type ComplaintStatus =
  | 'new'
  | 'investigating'
  | 'coordinating'
  | 'in_progress'
  | 'waiting_info'
  | 'completed'
  | 'closed';

export type ComplaintUrgency = 'low' | 'normal' | 'high' | 'critical';

export type ComplaintCategory =
  | 'infrastructure'
  | 'environment'
  | 'noise_nuisance'
  | 'public_service'
  | 'consumer_debt'
  | 'land_dispute'
  | 'social_welfare'
  | 'other';

export interface ComplaintAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  previewDataUrl?: string;
  uploadedAt: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  status: ComplaintStatus;
  officerName: string;
  department?: string;
  note: string;
}

export interface ComplaintRecord {
  id: string;
  caseNumber: string;
  receivedDate: string;
  complainantName: string;
  phone: string;
  district: string;
  locationArea: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  responsibleAgency: string;
  assignedOfficer?: string;
  assignedDate?: string;
  followUpDate?: string;
  coordinationResult?: string;
  coordinationNotes?: string;
  urgency: ComplaintUrgency;
  status: ComplaintStatus;
  attachments: ComplaintAttachment[];
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OfficerProfile {
  id: string;
  name: string;
  position: string;
  division: string;
  phone: string;
}

export interface AgencyDirectoryItem {
  id: string;
  name: string;
  category: string;
  contactPhone: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: 'create' | 'update' | 'status_change' | 'assign' | 'delete' | 'import' | 'reset';
  caseNumber?: string;
  details: string;
}

export interface SystemConfig {
  officerDisplayName: string;
  officerPosition: string;
  fiscalYear: number;
  storageDriver: 'local_storage' | 'firebase_ready';
}

export interface StoredSystemState {
  complaints: ComplaintRecord[];
  officers: OfficerProfile[];
  agencies: AgencyDirectoryItem[];
  logs: AuditLog[];
  config: SystemConfig;
}
