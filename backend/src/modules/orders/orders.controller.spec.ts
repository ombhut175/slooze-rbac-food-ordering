import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

describe('OrdersController - Authorization', () => {
  let rolesGuard: RolesGuard;

  const mockOrdersService = {
    checkout: jest.fn(),
    cancel: jest.fn(),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        RolesGuard,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders/:id/checkout', () => {
    it('should reject MEMBER user with 403', () => {
      const memberUser: AuthenticatedRequest['user'] = {
        id: 'member-user-id',
        email: 'member@test.com',
        role: 'MEMBER',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: memberUser,
          }),
        }),
      } as any;

      // Test that RolesGuard throws ForbiddenException
      expect(() => rolesGuard.canActivate(mockContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow ADMIN user to access checkout', () => {
      const adminUser: AuthenticatedRequest['user'] = {
        id: 'admin-user-id',
        email: 'admin@test.com',
        role: 'ADMIN',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: adminUser,
          }),
        }),
      } as any;

      // Test that RolesGuard allows access
      const result = rolesGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should allow MANAGER user to access checkout', () => {
      const managerUser: AuthenticatedRequest['user'] = {
        id: 'manager-user-id',
        email: 'manager@test.com',
        role: 'MANAGER',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: managerUser,
          }),
        }),
      } as any;

      // Test that RolesGuard allows access
      const result = rolesGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('POST /orders/:id/cancel', () => {
    it('should reject MEMBER user with 403', () => {
      const memberUser: AuthenticatedRequest['user'] = {
        id: 'member-user-id',
        email: 'member@test.com',
        role: 'MEMBER',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: memberUser,
          }),
        }),
      } as any;

      // Test that RolesGuard throws ForbiddenException
      expect(() => rolesGuard.canActivate(mockContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow ADMIN user to access cancel', () => {
      const adminUser: AuthenticatedRequest['user'] = {
        id: 'admin-user-id',
        email: 'admin@test.com',
        role: 'ADMIN',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: adminUser,
          }),
        }),
      } as any;

      // Test that RolesGuard allows access
      const result = rolesGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should allow MANAGER user to access cancel', () => {
      const managerUser: AuthenticatedRequest['user'] = {
        id: 'manager-user-id',
        email: 'manager@test.com',
        role: 'MANAGER',
        country: 'IN',
        supabaseUser: {} as any,
      };

      // Mock the reflector to return required roles
      mockReflector.get.mockReturnValue(['ADMIN', 'MANAGER']);

      // Create mock execution context
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: managerUser,
          }),
        }),
      } as any;

      // Test that RolesGuard allows access
      const result = rolesGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });
});
