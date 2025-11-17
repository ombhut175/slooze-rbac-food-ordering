import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator to specify required roles for endpoint access
 * Used in conjunction with RolesGuard to enforce role-based access control
 *
 * @param roles - Array of role strings that are allowed to access the endpoint
 *
 * @example
 * ```typescript
 * @Roles('ADMIN', 'MANAGER')
 * @UseGuards(AuthGuard, RolesGuard)
 * @Post('checkout')
 * async checkout() {
 *   // Only ADMIN and MANAGER can access this endpoint
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
