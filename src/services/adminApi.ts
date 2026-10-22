/**
 * Secure Admin API Client for PhysioFit
 * Interacts directly with server-side authorized endpoints
 */

const TOKEN_KEY = 'physiofit_admin_token';

export const adminApi = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, remember: boolean = true) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  async login(email: string, password: string, twoFactorCode?: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, twoFactorCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async verifyToken() {
    const token = this.getToken();
    if (!token) return { valid: false };

    try {
      const res = await fetch('/api/admin/verify', {
        headers: this.getAuthHeaders(),
      });
      if (!res.ok) {
        this.clearToken();
        return { valid: false };
      }
      return await res.json();
    } catch {
      return { valid: false };
    }
  },

  async logout() {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.clearToken();
    }
  },

  async getStats() {
    const res = await fetch('/api/admin/stats', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  },

  async getWorkouts() {
    const res = await fetch('/api/admin/workouts', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return await res.json();
  },

  async createWorkout(data: any) {
    const res = await fetch('/api/admin/workouts', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create workout');
    return await res.json();
  },

  async updateWorkout(id: string, data: any) {
    const res = await fetch(`/api/admin/workouts/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update workout');
    return await res.json();
  },

  async deleteWorkout(id: string) {
    const res = await fetch(`/api/admin/workouts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete workout');
    return await res.json();
  },

  async getExercises() {
    const res = await fetch('/api/admin/exercises', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch exercises');
    return await res.json();
  },

  async createExercise(data: any) {
    const res = await fetch('/api/admin/exercises', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create exercise');
    return await res.json();
  },

  async updateExercise(id: string, data: any) {
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update exercise');
    return await res.json();
  },

  async deleteExercise(id: string) {
    const res = await fetch(`/api/admin/exercises/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete exercise');
    return await res.json();
  },

  async getMobility() {
    const res = await fetch('/api/admin/mobility', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch mobility routines');
    return await res.json();
  },

  async createMobility(data: any) {
    const res = await fetch('/api/admin/mobility', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create mobility routine');
    return await res.json();
  },

  async updateMobility(id: string, data: any) {
    const res = await fetch(`/api/admin/mobility/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update mobility routine');
    return await res.json();
  },

  async deleteMobility(id: string) {
    const res = await fetch(`/api/admin/mobility/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete mobility routine');
    return await res.json();
  },

  async getNutrition() {
    const res = await fetch('/api/admin/nutrition', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch nutrition articles');
    return await res.json();
  },

  async createNutrition(data: any) {
    const res = await fetch('/api/admin/nutrition', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create nutrition article');
    return await res.json();
  },

  async updateNutrition(id: string, data: any) {
    const res = await fetch(`/api/admin/nutrition/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update nutrition article');
    return await res.json();
  },

  async deleteNutrition(id: string) {
    const res = await fetch(`/api/admin/nutrition/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete nutrition article');
    return await res.json();
  },

  async getUsers() {
    const res = await fetch('/api/admin/users', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  async updateUserStatus(id: string, status: 'active' | 'suspended') {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update user status');
    return await res.json();
  },

  async getWebsiteContent() {
    const res = await fetch('/api/content/website');
    if (!res.ok) throw new Error('Failed to fetch website content');
    return await res.json();
  },

  async updateWebsiteContent(data: any) {
    const res = await fetch('/api/admin/website-content', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update website content');
    return await res.json();
  },

  async getApkReleases() {
    const res = await fetch('/api/admin/apk-releases', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch APK releases');
    return await res.json();
  },

  async createApkRelease(data: any) {
    const res = await fetch('/api/admin/apk-releases', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create APK release');
    return await res.json();
  },

  async activateApkRelease(id: string) {
    const res = await fetch(`/api/admin/apk-releases/${id}/activate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to activate APK release');
    return await res.json();
  },

  async getFeedback() {
    const res = await fetch('/api/admin/feedback', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return await res.json();
  },

  async updateFeedbackStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update feedback status');
    return await res.json();
  },

  async getAuditLogs() {
    const res = await fetch('/api/admin/audit-logs', { headers: this.getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return await res.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password update failed');
    return data;
  },
};
