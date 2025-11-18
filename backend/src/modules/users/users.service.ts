import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../core/database/repositories';
import { MESSAGES } from '../../common/constants/string-const';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUserRole(userId: string, role: string, currentUserId: string) {
    const correlationId = crypto.randomUUID();

    this.logger.log('Updating user role', {
      operation: 'updateUserRole',
      correlationId,
      userId,
      newRole: role,
      adminUserId: currentUserId,
      timestamp: new Date().toISOString(),
    });

    try {
      // Prevent admin from removing their own admin role
      if (userId === currentUserId && role !== 'ADMIN') {
        this.logger.warn('Admin attempted to remove own ADMIN role', {
          operation: 'updateUserRole',
          correlationId,
          userId,
          newRole: role,
          timestamp: new Date().toISOString(),
        });
        throw new BadRequestException('Cannot remove your own ADMIN role');
      }

      // Get current user data before update
      const currentUser = await this.usersRepository.findById(userId);
      if (!currentUser) {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }

      const oldRole = currentUser.role;

      // Update the role
      const updatedUser = await this.usersRepository.updateUserRole(
        userId,
        role,
      );

      this.logger.log('User role updated successfully', {
        operation: 'updateUserRole',
        correlationId,
        userId,
        oldRole,
        newRole: role,
        adminUserId: currentUserId,
        updatedUser: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          country: updatedUser.country,
        },
        timestamp: new Date().toISOString(),
      });

      return updatedUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error('Failed to update user role', {
        operation: 'updateUserRole',
        correlationId,
        userId,
        newRole: role,
        adminUserId: currentUserId,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  async updateUserCountry(userId: string, country: string) {
    const correlationId = crypto.randomUUID();

    this.logger.log('Updating user country', {
      operation: 'updateUserCountry',
      correlationId,
      userId,
      newCountry: country,
      timestamp: new Date().toISOString(),
    });

    try {
      // Get current user data before update
      const currentUser = await this.usersRepository.findById(userId);
      if (!currentUser) {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }

      const oldCountry = currentUser.country;

      // Update the country
      const updatedUser = await this.usersRepository.updateUserCountry(
        userId,
        country,
      );

      this.logger.log('User country updated successfully', {
        operation: 'updateUserCountry',
        correlationId,
        userId,
        oldCountry,
        newCountry: country,
        updatedUser: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          country: updatedUser.country,
        },
        timestamp: new Date().toISOString(),
      });

      return updatedUser;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error('Failed to update user country', {
        operation: 'updateUserCountry',
        correlationId,
        userId,
        newCountry: country,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  async getAllUsers() {
    const correlationId = crypto.randomUUID();

    this.logger.log('Fetching all users for admin', {
      operation: 'getAllUsers',
      correlationId,
      timestamp: new Date().toISOString(),
    });

    try {
      const users = await this.usersRepository.findAll();

      this.logger.log('All users fetched successfully', {
        operation: 'getAllUsers',
        correlationId,
        count: users.length,
        timestamp: new Date().toISOString(),
      });

      return users;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';

      this.logger.error('Failed to fetch all users', {
        operation: 'getAllUsers',
        correlationId,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
}
