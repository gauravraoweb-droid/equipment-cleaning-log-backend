import type { AuditDiff } from "../types/index.js";

export function generateAuditDiffs<T extends Record<string, any>>(
  oldData: T,
  newData: T,
  fieldsToTrack: (keyof T)[]
): AuditDiff[] {
  const diffs: AuditDiff[] = [];
  for (const field of fieldsToTrack) {
    if (oldData[field] !== newData[field]) {
      diffs.push({
        field: String(field),
        oldValue: oldData[field]?.toString() ?? null,
        newValue: newData[field]?.toString() ?? null,
      });
    }
  }
  return diffs;
}