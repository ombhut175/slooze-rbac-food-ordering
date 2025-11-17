/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from '../../core/database/repositories/orders.repository';
import { RestaurantsRepository } from '../../core/database/repositories/restaurants.repository';
import { OrderItemsRepository } from '../../core/database/repositories/order-items.repository';
import { MockPaymentService } from './mock-payment.service';
import type { OrderEntity } from '../../core/database/repositories/orders.repository';
import type { RestaurantEntity } from '../../core/database/repositories/restaurants.repository';

describe('OrdersService - Country Scoping', () => {
  let service: OrdersService;
  let ordersRepository: OrdersRepository;
  let restaurantsRepository: RestaurantsRepository;

  const mockIndiaOrders: OrderEntity[] = [
    {
      id: 'order-in-1',
      userId: 'user-in-1',
      restaurantId: 'restaurant-in-1',
      country: 'IN',
      status: 'DRAFT',
      totalAmountCents: 1000,
      currency: 'INR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'order-in-2',
      userId: 'user-in-2',
      restaurantId: 'restaurant-in-2',
      country: 'IN',
      status: 'PAID',
      totalAmountCents: 2000,
      currency: 'INR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUSOrders: OrderEntity[] = [
    {
      id: 'order-us-1',
      userId: 'user-us-1',
      restaurantId: 'restaurant-us-1',
      country: 'US',
      status: 'DRAFT',
      totalAmountCents: 1500,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'order-us-2',
      userId: 'user-us-2',
      restaurantId: 'restaurant-us-2',
      country: 'US',
      status: 'PAID',
      totalAmountCents: 2500,
      currency: 'USD',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockAllOrders: OrderEntity[] = [...mockIndiaOrders, ...mockUSOrders];

  const mockIndiaRestaurant: RestaurantEntity = {
    id: 'restaurant-in-1',
    name: 'India Restaurant',
    country: 'IN',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUSRestaurant: RestaurantEntity = {
    id: 'restaurant-us-1',
    name: 'US Restaurant',
    country: 'US',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrdersRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const mockRestaurantsRepository = {
    findByIdOrThrow: jest.fn(),
  };

  const mockOrderItemsRepository = {};

  const mockMockPaymentService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
        {
          provide: RestaurantsRepository,
          useValue: mockRestaurantsRepository,
        },
        {
          provide: OrderItemsRepository,
          useValue: mockOrderItemsRepository,
        },
        {
          provide: MockPaymentService,
          useValue: mockMockPaymentService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    restaurantsRepository = module.get<RestaurantsRepository>(
      RestaurantsRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Country-scoped order access', () => {
    it('should return only India orders for MANAGER-IN user', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockIndiaOrders);

      const result = await service.findAll('MANAGER', 'IN');

      expect(ordersRepository.findAll).toHaveBeenCalledWith(undefined, 'IN');
      expect(result).toEqual(mockIndiaOrders);
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.country === 'IN')).toBe(true);
    });

    it('should return only United States orders for MANAGER-US user', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockUSOrders);

      const result = await service.findAll('MANAGER', 'US');

      expect(ordersRepository.findAll).toHaveBeenCalledWith(undefined, 'US');
      expect(result).toEqual(mockUSOrders);
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.country === 'US')).toBe(true);
    });

    it('should return only India orders for MEMBER-IN user', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockIndiaOrders);

      const result = await service.findAll('MEMBER', 'IN');

      expect(ordersRepository.findAll).toHaveBeenCalledWith(undefined, 'IN');
      expect(result).toEqual(mockIndiaOrders);
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.country === 'IN')).toBe(true);
    });

    it('should return only United States orders for MEMBER-US user', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockUSOrders);

      const result = await service.findAll('MEMBER', 'US');

      expect(ordersRepository.findAll).toHaveBeenCalledWith(undefined, 'US');
      expect(result).toEqual(mockUSOrders);
      expect(result).toHaveLength(2);
      expect(result.every((o) => o.country === 'US')).toBe(true);
    });

    it('should return orders from all countries for ADMIN user', async () => {
      mockOrdersRepository.findAll.mockResolvedValue(mockAllOrders);

      const result = await service.findAll('ADMIN', 'IN');

      expect(ordersRepository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockAllOrders);
      expect(result).toHaveLength(4);
      expect(result.filter((o) => o.country === 'IN')).toHaveLength(2);
      expect(result.filter((o) => o.country === 'US')).toHaveLength(2);
    });
  });

  describe('Order creation with country assignment', () => {
    it('should automatically set order country to user country (IN) on creation', async () => {
      const userId = 'user-in-1';
      const userCountry = 'IN';
      const restaurantId = 'restaurant-in-1';

      mockRestaurantsRepository.findByIdOrThrow.mockResolvedValue(
        mockIndiaRestaurant,
      );

      const expectedOrder: OrderEntity = {
        id: 'new-order-id',
        userId,
        restaurantId,
        country: 'IN',
        status: 'DRAFT',
        totalAmountCents: 0,
        currency: 'INR',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersRepository.create.mockResolvedValue(expectedOrder);

      const result = await service.create(userId, userCountry, {
        restaurantId,
      });

      expect(restaurantsRepository.findByIdOrThrow).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ordersRepository.create).toHaveBeenCalledWith({
        userId,
        restaurantId,
        country: 'IN',
        currency: 'INR',
      });
      expect(result.country).toBe('IN');
      expect(result.userId).toBe(userId);
    });

    it('should automatically set order country to user country (US) on creation', async () => {
      const userId = 'user-us-1';
      const userCountry = 'US';
      const restaurantId = 'restaurant-us-1';

      mockRestaurantsRepository.findByIdOrThrow.mockResolvedValue(
        mockUSRestaurant,
      );

      const expectedOrder: OrderEntity = {
        id: 'new-order-id',
        userId,
        restaurantId,
        country: 'US',
        status: 'DRAFT',
        totalAmountCents: 0,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrdersRepository.create.mockResolvedValue(expectedOrder);

      const result = await service.create(userId, userCountry, {
        restaurantId,
      });

      expect(restaurantsRepository.findByIdOrThrow).toHaveBeenCalledWith(
        restaurantId,
      );
      expect(ordersRepository.create).toHaveBeenCalledWith({
        userId,
        restaurantId,
        country: 'US',
        currency: 'USD',
      });
      expect(result.country).toBe('US');
      expect(result.userId).toBe(userId);
    });
  });
});
