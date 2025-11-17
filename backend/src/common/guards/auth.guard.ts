import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { UsersRepository } from '../../core/database/repositories/users.repository';
import { COOKIES, MESSAGES } from '../constants/string-const';

/**
 * AuthGuard that validates Supabase tokens and attaches user info to request
 * Follows project rules: use Supabase Auth, detailed logging, proper error handling
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = crypto.randomUUID();

    this.logger.log('Authentication attempt started', {
      operation: 'canActivate',
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });

    try {
      // Extract token from Authorization header
      const token = this.extractTokenFromRequest(request);

      if (!token) {
        this.logger.warn('No authorization token found', {
          operation: 'extractToken',
          requestId,
          headers: {
            authorization: request.headers.authorization
              ? 'present'
              : 'missing',
            cookie: request.headers.cookie ? 'present' : 'missing',
          },
          cookies: {
            auth_token: request.cookies?.[COOKIES.AUTH_TOKEN]
              ? 'present'
              : 'missing',
          },
        });
        throw new UnauthorizedException(MESSAGES.NO_TOKEN_PROVIDED);
      }

      this.logger.debug('Token extracted successfully', {
        operation: 'extractToken',
        requestId,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 10) + '...',
      });

      // Get user from Supabase using token
      const startTime = Date.now();
      const {
        data: { user },
        error,
      } = await this.supabaseService.getClient().auth.getUser(token);

      const authTime = Date.now() - startTime;

      if (error || !user) {
        this.logger.error('Token validation failed', {
          operation: 'getUser',
          requestId,
          error: error?.message || 'User not found',
          authTime: `${authTime}ms`,
          timestamp: new Date().toISOString(),
        });
        throw new UnauthorizedException(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
      }

      // Fetch user from database to get role and country
      const dbUser = await this.usersRepository.findById(user.id);

      if (!dbUser) {
        this.logger.error('User not found in database', {
          operation: 'findById',
          requestId,
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
        });
        throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND_IN_DATABASE);
      }

      // Attach user info to request with role and country
      (request as any).user = {
        id: user.id,
        email: user.email,
        role: dbUser.role,
        country: dbUser.country,
        supabaseUser: user, // Full user object for advanced use cases
      };

      this.logger.log('Authentication successful', {
        operation: 'canActivate',
        requestId,
        userId: user.id,
        email: user.email,
        role: dbUser.role,
        country: dbUser.country,
        authTime: `${authTime}ms`,
        userMetadata: {
          emailVerified: user.email_confirmed_at ? true : false,
          lastSignIn: user.last_sign_in_at,
          createdAt: user.created_at,
        },
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      const errorName =
        error instanceof Error ? error.constructor.name : 'Unknown';

      this.logger.error('Authentication failed', {
        operation: 'canActivate',
        requestId,
        method: request.method,
        url: request.url,
        error: {
          message: errorMessage,
          name: errorName,
          stack:
            process.env.NODE_ENV === 'development' ? errorStack : undefined,
        },
        timestamp: new Date().toISOString(),
      });

      // Re-throw known exceptions, wrap unknown ones
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(MESSAGES.AUTHENTICATION_FAILED);
    }
  }

  /**
   * Extracts JWT token from Authorization header or cookies
   * @param request Express request object
   * @returns JWT token string or null if not found
   */
  private extractTokenFromRequest(request: Request): string | null {
    // Check Authorization header first (Bearer token)
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Fallback to auth_token cookie (set by login endpoint)
    const cookies = request.cookies;
    if (cookies?.[COOKIES.AUTH_TOKEN]) {
      return cookies[COOKIES.AUTH_TOKEN];
    }

    return null;
  }
}
