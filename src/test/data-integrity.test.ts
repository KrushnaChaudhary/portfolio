import { describe, it, expect } from "vitest";
import { projectsData, projectsList } from "@/data/projectsData";

describe("projectsData integrity", () => {
  it("every projectsList entry resolves to a projectsData record", () => {
    for (const project of projectsList) {
      expect(projectsData[project.slug], `missing projectsData entry for "${project.slug}"`).toBeDefined();
    }
  });

  it("every project has non-empty tags, highlights, and myRole", () => {
    for (const [slug, project] of Object.entries(projectsData)) {
      expect(project.tags.length, `${slug}.tags is empty`).toBeGreaterThan(0);
      expect(project.highlights.length, `${slug}.highlights is empty`).toBeGreaterThan(0);
      expect(project.myRole.length, `${slug}.myRole is empty`).toBeGreaterThan(0);
    }
  });

  it("every project has a cover image", () => {
    for (const [slug, project] of Object.entries(projectsData)) {
      expect(project.image, `${slug} has no cover image`).toBeTruthy();
    }
  });

  it("projectsList has no duplicate slugs", () => {
    const slugs = projectsList.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
