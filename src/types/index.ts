export interface AuditDiff {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}