import {
  ComplaintRecord,
  OfficerProfile,
  AgencyDirectoryItem,
  AuditLog,
  SystemConfig,
  StoredSystemState
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_OFFICERS,
  INITIAL_AGENCIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONFIG
} from '../data/mockComplaints';

const STORAGE_KEY = 'songkhla_damrongdham_connect_v1';

/**
 * Abstract Storage Adapter Interface
 * Designed so the LocalStorage prototype can be swapped seamlessly
 * with Firebase Firestore or an external REST/SQL API in future phases.
 */
export interface ComplaintDataAdapter {
  loadState(): StoredSystemState;
  saveState(state: StoredSystemState): void;
  resetDemoState(): StoredSystemState;
}

class LocalStorageComplaintAdapter implements ComplaintDataAdapter {
  loadState(): StoredSystemState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = this.getDefaultState();
        this.saveState(seeded);
        return seeded;
      }
      const parsed = JSON.parse(raw) as Partial<StoredSystemState>;
      return {
        complaints: Array.isArray(parsed.complaints) ? parsed.complaints : INITIAL_COMPLAINTS,
        officers: Array.isArray(parsed.officers) && parsed.officers.length > 0 ? parsed.officers : INITIAL_OFFICERS,
        agencies: Array.isArray(parsed.agencies) && parsed.agencies.length > 0 ? parsed.agencies : INITIAL_AGENCIES,
        logs: Array.isArray(parsed.logs) ? parsed.logs : INITIAL_AUDIT_LOGS,
        config: parsed.config ? { ...INITIAL_CONFIG, ...parsed.config } : INITIAL_CONFIG
      };
    } catch {
      return this.getDefaultState();
    }
  }

  saveState(state: StoredSystemState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to persist state to localStorage:', err);
    }
  }

  resetDemoState(): StoredSystemState {
    const fresh = this.getDefaultState();
    this.saveState(fresh);
    return fresh;
  }

  private getDefaultState(): StoredSystemState {
    return {
      complaints: INITIAL_COMPLAINTS,
      officers: INITIAL_OFFICERS,
      agencies: INITIAL_AGENCIES,
      logs: INITIAL_AUDIT_LOGS,
      config: INITIAL_CONFIG
    };
  }
}

export const complaintStorage: ComplaintDataAdapter = new LocalStorageComplaintAdapter();

export function generateNextCaseNumber(complaints: ComplaintRecord[], fiscalYear = 2569): string {
  let maxNum = 0;
  const prefix = `SD-${fiscalYear}-`;
  complaints.forEach((c) => {
    if (c.caseNumber.startsWith(prefix)) {
      const numPart = parseInt(c.caseNumber.replace(prefix, ''), 10);
      if (!Number.isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  });
  const nextNum = Math.max(maxNum + 1, complaints.length + 1);
  return `${prefix}${String(nextNum).padStart(3, '0')}`;
}

export function isComplaintOverdue(record: ComplaintRecord, referenceDateStr?: string): boolean {
  if (record.status === 'completed' || record.status === 'closed') return false;
  if (!record.followUpDate) return false;
  const todayStr = referenceDateStr || new Date().toISOString().split('T')[0];
  return record.followUpDate < todayStr;
}

export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  if (Number.isNaN(year) || monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) return dateStr;
  const buddhistYear = year < 2400 ? year + 543 : year;
  return `${day} ${thaiMonths[monthIdx]} ${buddhistYear}`;
}

export function formatThaiMonthLabel(ymStr: string): string {
  const parts = ymStr.split('-');
  if (parts.length !== 2) return ymStr;
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  if (Number.isNaN(year) || monthIdx < 0 || monthIdx > 11) return ymStr;
  const shortYear = String((year < 2400 ? year + 543 : year)).slice(-2);
  return `${thaiMonths[monthIdx]} ${shortYear}`;
}
