import { describe, it, expect } from "vitest";
import { skillTreeData } from "@/data/skillTreeData";

describe("skillTreeData integrity", () => {
  it("has no duplicate ids", () => {
    const ids = skillTreeData.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every requires id resolves to a real node", () => {
    const ids = new Set(skillTreeData.map((s) => s.id));
    for (const node of skillTreeData) {
      for (const req of node.requires ?? []) {
        expect(ids.has(req), `${node.id} requires unknown skill "${req}"`).toBe(true);
      }
    }
  });

  it("every node has a level between 1 and 5", () => {
    for (const node of skillTreeData) {
      expect(node.level).toBeGreaterThanOrEqual(1);
      expect(node.level).toBeLessThanOrEqual(5);
    }
  });
});
