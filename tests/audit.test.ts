import { generateAuditDiffs } from "../src/utils/audit.js";

describe("Audit diff generator", () => {
  it("should return diffs for changed fields", () => {
    const oldData = {
      name: "Reactor",
      status: "ACTIVE",
      temp: 100,
    };

    const newData = {
      name: "Reactor V2",
      status: "ACTIVE",
      temp: 120,
    };

    const diffs = generateAuditDiffs(
      oldData,
      newData,
      ["name", "status", "temp"]
    );

    expect(diffs).toHaveLength(2);

    expect(diffs).toContainEqual({
      field: "name",
      oldValue: "Reactor",
      newValue: "Reactor V2",
    });

    expect(diffs).toContainEqual({
      field: "temp",
      oldValue: "100",
      newValue: "120",
    });
  });

  it("should return empty array when no changes", () => {
    const data = { a: 1, b: "x" };

    const diffs = generateAuditDiffs(data, data, ["a", "b"]);

    expect(diffs).toHaveLength(0);
  });

  it("should handle null/undefined values", () => {
    const oldData = {
      notes: "Some notes",
      status: "PENDING",
    };

    const newData = {
      notes: null,
      status: "VERIFIED",
    };

    const diffs = generateAuditDiffs(
      oldData,
      newData,
      ["notes", "status"]
    );

    expect(diffs).toContainEqual({
      field: "notes",
      oldValue: "Some notes",
      newValue: null,
    });

    expect(diffs).toContainEqual({
      field: "status",
      oldValue: "PENDING",
      newValue: "VERIFIED",
    });
  });
});