import { useAuthStore } from './use-auth-store';
import hackLog from '@/lib/logger';

/**
 * Role-based access control hook
 * Provides utilities to check user roles and permissions
 */
export function useRoleCheck() {
  const { publicUser } = useAuthStore();
  
  const role = publicUser?.role || null;
  const country = publicUser?.country || null;

  /**
   * Check if user has a specific role
   */
  const hasRole = (requiredRole: 'ADMIN' | 'MANAGER' | 'MEMBER'): boolean => {
    const result = role === requiredRole;
    
    hackLog.dev('Role check', {
      requiredRole,
      userRole: role,
      hasAccess: result,
      component: 'useRoleCheck'
    });
    
    return result;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (requiredRoles: Array<'ADMIN' | 'MANAGER' | 'MEMBER'>): boolean => {
    const result = role ? requiredRoles.includes(role) : false;
    
    hackLog.dev('Role check (any)', {
      requiredRoles,
      userRole: role,
      hasAccess: result,
      component: 'useRoleCheck'
    });
    
    return result;
  };

  /**
   * Check if user is an admin
   */
  const isAdmin = (): boolean => {
    return role === 'ADMIN';
  };

  /**
   * Check if user is a manager
   */
  const isManager = (): boolean => {
    return role === 'MANAGER';
  };

  /**
   * Check if user is a member
   */
  const isMember = (): boolean => {
    return role === 'MEMBER';
  };

  /**
   * Check if user can checkout orders (ADMIN or MANAGER)
   */
  const canCheckout = (): boolean => {
    return role === 'ADMIN' || role === 'MANAGER';
  };

  /**
   * Check if user can cancel orders (ADMIN or MANAGER)
   */
  const canCancelOrders = (): boolean => {
    return role === 'ADMIN' || role === 'MANAGER';
  };

  /**
   * Check if user can manage payment methods (ADMIN only)
   */
  const canManagePaymentMethods = (): boolean => {
    return role === 'ADMIN';
  };

  /**
   * Get user's country
   */
  const getUserCountry = (): 'IN' | 'US' | null => {
    return country;
  };

  /**
   * Get role display name
   */
  const getRoleDisplayName = (): string => {
    if (!role) return 'Guest';
    
    const roleNames = {
      ADMIN: 'Administrator',
      MANAGER: 'Manager',
      MEMBER: 'Member'
    };
    
    return roleNames[role];
  };

  /**
   * Get role color for badges
   */
  const getRoleColor = (): string => {
    if (!role) return 'gray';
    
    const roleColors = {
      ADMIN: 'purple',
      MANAGER: 'blue',
      MEMBER: 'gray'
    };
    
    return roleColors[role];
  };

  /**
   * Get helpful message for unavailable features
   */
  const getUnavailableFeatureMessage = (feature: 'checkout' | 'cancel' | 'payment-methods'): string => {
    const messages = {
      checkout: 'Only Administrators and Managers can checkout orders. Please contact your administrator for assistance.',
      cancel: 'Only Administrators and Managers can cancel orders. Please contact your administrator for assistance.',
      'payment-methods': 'Only Administrators can manage payment methods. Please contact your administrator for assistance.'
    };
    
    return messages[feature];
  };

  return {
    role,
    country,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isMember,
    canCheckout,
    canCancelOrders,
    canManagePaymentMethods,
    getUserCountry,
    getRoleDisplayName,
    getRoleColor,
    getUnavailableFeatureMessage
  };
}
