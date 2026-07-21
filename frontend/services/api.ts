const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Project API calls
export const projectAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },

  getAll: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.sort) params.append("sort", filters.sort);

    const response = await fetch(
      `${API_BASE_URL}/projects?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  getById: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
  },

  update: async (projectId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
  },

  delete: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete project");
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/projects/stats`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },

  addCollaborator: async (projectId: string, email: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/collaborators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to add collaborator");
    return response.json();
  },

  removeCollaborator: async (projectId: string, collaboratorId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/collaborators/${collaboratorId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to remove collaborator");
    return response.json();
  },
};

// Schedule API calls
export const scheduleAPI = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create schedule");
    return response.json();
  },

  getAll: async (filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.projectId) params.append("projectId", filters.projectId);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.sort) params.append("sort", filters.sort);

    const response = await fetch(
      `${API_BASE_URL}/schedules?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch schedules");
    return response.json();
  },

  getById: async (scheduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch schedule");
    return response.json();
  },

  update: async (scheduleId: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update schedule");
    return response.json();
  },

  delete: async (scheduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete schedule");
    return response.json();
  },

  complete: async (scheduleId: string) => {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}/complete`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to complete schedule");
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules/stats`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },

  getToday: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules/today`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch today's schedules");
    return response.json();
  },

  getUpcoming: async (days?: number) => {
    const params = new URLSearchParams();
    if (days) params.append("days", days.toString());

    const response = await fetch(
      `${API_BASE_URL}/schedules/upcoming?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch upcoming schedules");
    return response.json();
  },
};
