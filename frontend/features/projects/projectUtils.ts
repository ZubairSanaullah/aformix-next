export type ProjectPriority = "Critical" | "High" | "Medium" | "Low";

export interface ProjectItem {
  id: string;
  title: string;
  priority: ProjectPriority;
  progress: number;
  owner: string;
  due: string;
}

const priorityOrder: Record<ProjectPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export const sortProjectsByPriority = (projects: ProjectItem[]) =>
  [...projects].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
