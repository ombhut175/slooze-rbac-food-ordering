import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { MESSAGES } from '../constants/string-const';

/**
 * RolesGuard that enforces role-based access control using metadata decorators
 * Must be used after AuthGuard to ensure user is attached to request
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requestId = crypto.randomUUID();

    // Get required roles from @Roles() decorator metadata
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('No role requirements specified, allowing access', {
        operation: 'canActivate',
        requestId,
      });
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // User should be attached by AuthGuard
    if (!user?.role) {
      this.logger.error('User or role not found on request', {
        operation: 'canActivate',
        requestId,
        hasUser: !!user,
        hasRole: !!user?.role,
      });
      throw new ForbiddenException(MESSAGES.USER_ROLE_NOT_FOUND);
    }

    // Check if user's role is in the required roles
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      this.logger.warn('User does not have required role', {
        operation: 'canActivate',
        requestId,
        userId: user.id,
        userRole: user.role,
        requiredRoles,
        timestamp: new Date().toISOString(),
      });
      throw new ForbiddenException(
        `${MESSAGES.ACCESS_DENIED_ROLE_REQUIRED}: ${requiredRoles.join(', ')}`,
      );
    }

    this.logger.log('Role authorization successful', {
      operation: 'canActivate',
      requestId,
      userId: user.id,
      userRole: user.role,
      requiredRoles,
      timestamp: new Date().toISOString(),
    });

    return true;
  }
}
