import { apiRequest } from '@/helpers/request';
import hackLog from '@/lib/logger';
import { extractErrorMessage } from '@/helpers/errors';

// User API Types
export interface PublicUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  country: 'IN' | 'US';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleRequest {
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

export interface UpdateUserCountryRequest {
  country: 'IN' | 'US';
}

// User API Service
export class UsersAPI {
  /**
   * Get all users (ADMIN only)
   * Returns list of all users in the system
   */
  static async getAllUsers(): Promise<PublicUser[]> {
    try {
      const response = await apiRequest.get<PublicUser[]>('users', false);
      
      hackLog.apiSuccess('GET', 'users', {
        userCount: response?.length || 0,
        component: 'UsersAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('GET', 'users', {
        error: error,
        component: 'UsersAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to fetch users');
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user role (ADMIN only)
   * Changes the role of a specific user
   */
  static async updateUserRole(userId: string, role: 'ADMIN' | 'MANAGER' | 'MEMBER'): Promise<PublicUser> {
    try {
      const data: UpdateUserRoleRequest = { role };
      const response = await apiRequest.patch<PublicUser>(`users/${userId}/role`, data, true);
      
      hackLog.apiSuccess('PATCH', `users/${userId}/role`, {
        userId,
        newRole: role,
        component: 'UsersAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('PATCH', `users/${userId}/role`, {
        error: error,
        userId,
        role,
        component: 'UsersAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to update user role');
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user country (ADMIN only)
   * Changes the country assignment of a specific user
   */
  static async updateUserCountry(userId: string, country: 'IN' | 'US'): Promise<PublicUser> {
    try {
      const data: UpdateUserCountryRequest = { country };
      const response = await apiRequest.patch<PublicUser>(`users/${userId}/country`, data, true);
      
      hackLog.apiSuccess('PATCH', `users/${userId}/country`, {
        userId,
        newCountry: country,
        component: 'UsersAPI'
      });

      return response;
    } catch (error) {
      hackLog.apiError('PATCH', `users/${userId}/country`, {
        error: error,
        userId,
        country,
        component: 'UsersAPI'
      });
      
      const errorMessage = extractErrorMessage(error, 'Failed to update user country');
      throw new Error(errorMessage);
    }
  }
}
