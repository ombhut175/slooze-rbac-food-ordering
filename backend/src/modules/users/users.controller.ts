import {
  Controller,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserRoleDto, UpdateUserCountryDto } from './dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/helpers/api-response.helper';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/role')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user role (ADMIN only)',
    description:
      'Update the role of a user. Only ADMIN users can perform this action. Admins cannot remove their own ADMIN role.',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'User role updated successfully',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          role: 'MANAGER',
          country: 'IN',
          isEmailVerified: true,
          createdAt: '2023-11-01T10:00:00.000Z',
          updatedAt: '2023-12-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or admin attempting to remove own ADMIN role',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot remove your own ADMIN role',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/role',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User does not have ADMIN role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Access denied. Required role: ADMIN',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/role',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/role',
      },
    },
  })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    this.logger.log(`Update user role request for user: ${id}`, {
      operation: 'updateUserRole',
      userId: id,
      newRole: updateRoleDto.role,
      adminUserId: currentUserId,
      timestamp: new Date().toISOString(),
    });

    const updatedUser = await this.usersService.updateUserRole(
      id,
      updateRoleDto.role,
      currentUserId,
    );

    return successResponse(updatedUser, 'User role updated successfully');
  }

  @Patch(':id/country')
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user country (ADMIN only)',
    description:
      'Update the country assignment of a user. Only ADMIN users can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'User country updated successfully',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'User country updated successfully',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          role: 'MEMBER',
          country: 'US',
          isEmailVerified: true,
          createdAt: '2023-11-01T10:00:00.000Z',
          updatedAt: '2023-12-01T10:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      example: {
        statusCode: 400,
        message: 'Country must be one of: IN, US',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/country',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User does not have ADMIN role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Access denied. Required role: ADMIN',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/country',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users/:id/country',
      },
    },
  })
  async updateUserCountry(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateUserCountryDto,
  ) {
    this.logger.log(`Update user country request for user: ${id}`, {
      operation: 'updateUserCountry',
      userId: id,
      newCountry: updateCountryDto.country,
      timestamp: new Date().toISOString(),
    });

    const updatedUser = await this.usersService.updateUserCountry(
      id,
      updateCountryDto.country,
    );

    return successResponse(updatedUser, 'User country updated successfully');
  }

  @Get()
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users (ADMIN only)',
    description:
      'Retrieve a list of all users in the system. Only ADMIN users can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'admin@example.com',
            role: 'ADMIN',
            country: 'IN',
            isEmailVerified: true,
            createdAt: '2023-11-01T10:00:00.000Z',
            updatedAt: '2023-12-01T10:00:00.000Z',
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            email: 'user@example.com',
            role: 'MEMBER',
            country: 'US',
            isEmailVerified: true,
            createdAt: '2023-11-02T10:00:00.000Z',
            updatedAt: '2023-12-02T10:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User does not have ADMIN role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Access denied. Required role: ADMIN',
        timestamp: '2023-12-01T10:00:00.000Z',
        path: '/api/users',
      },
    },
  })
  async getAllUsers() {
    this.logger.log('Get all users request', {
      operation: 'getAllUsers',
      timestamp: new Date().toISOString(),
    });

    const users = await this.usersService.getAllUsers();

    return successResponse(users, 'Users retrieved successfully');
  }
}
