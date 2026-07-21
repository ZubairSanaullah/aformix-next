import { describe, expect, it } from "vitest";
import type { ProjectItem } from "./projectUtils";
import { sortProjectsByPriority } from "./projectUtils";

describe("sortProjectsByPriority", () => {
  it("puts urgent work ahead of normal work", () => {
    const projects: ProjectItem[] = [
      { id: "1", title: "Growth site", priority: "Medium", progress: 50, owner: "Mina", due: "Tomorrow" },
      { id: "2", title: "Client portal", priority: "High", progress: 65, owner: "Isaac", due: "Friday" },
      { id: "3", title: "Orbit onboarding", priority: "Critical", progress: 82, owner: "You", due: "Today" },
    ];

    const ordered = sortProjectsByPriority(projects);

    expect(ordered.map((project) => project.id)).toEqual(["3", "2", "1"]);
  });
});
