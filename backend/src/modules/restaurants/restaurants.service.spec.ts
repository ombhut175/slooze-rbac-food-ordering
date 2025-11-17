/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsRepository } from '../../core/database/repositories/restaurants.repository';
import type { RestaurantEntity } from '../../core/database/repositories/restaurants.repository';

describe('RestaurantsService - Country Scoping', () => {
  let service: RestaurantsService;
  let repository: RestaurantsRepository;

  const mockIndiaRestaurants: RestaurantEntity[] = [
    {
      id: 'restaurant-in-1',
      name: 'India Restaurant 1',
      country: 'IN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'restaurant-in-2',
      name: 'India Restaurant 2',
      country: 'IN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUSRestaurants: RestaurantEntity[] = [
    {
      id: 'restaurant-us-1',
      name: 'US Restaurant 1',
      country: 'US',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'restaurant-us-2',
      name: 'US Restaurant 2',
      country: 'US',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockAllRestaurants: RestaurantEntity[] = [
    ...mockIndiaRestaurants,
    ...mockUSRestaurants,
  ];

  const mockRestaurantsRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: RestaurantsRepository,
          useValue: mockRestaurantsRepository,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    repository = module.get<RestaurantsRepository>(RestaurantsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Country-scoped access', () => {
    it('should return only India restaurants for MANAGER-IN user', async () => {
      mockRestaurantsRepository.findAll.mockResolvedValue(mockIndiaRestaurants);

      const result = await service.findAll('MANAGER', 'IN');

      expect(repository.findAll).toHaveBeenCalledWith('IN');
      expect(result).toEqual(mockIndiaRestaurants);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.country === 'IN')).toBe(true);
    });

    it('should return only United States restaurants for MANAGER-US user', async () => {
      mockRestaurantsRepository.findAll.mockResolvedValue(mockUSRestaurants);

      const result = await service.findAll('MANAGER', 'US');

      expect(repository.findAll).toHaveBeenCalledWith('US');
      expect(result).toEqual(mockUSRestaurants);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.country === 'US')).toBe(true);
    });

    it('should return only India restaurants for MEMBER-IN user', async () => {
      mockRestaurantsRepository.findAll.mockResolvedValue(mockIndiaRestaurants);

      const result = await service.findAll('MEMBER', 'IN');

      expect(repository.findAll).toHaveBeenCalledWith('IN');
      expect(result).toEqual(mockIndiaRestaurants);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.country === 'IN')).toBe(true);
    });

    it('should return only United States restaurants for MEMBER-US user', async () => {
      mockRestaurantsRepository.findAll.mockResolvedValue(mockUSRestaurants);

      const result = await service.findAll('MEMBER', 'US');

      expect(repository.findAll).toHaveBeenCalledWith('US');
      expect(result).toEqual(mockUSRestaurants);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.country === 'US')).toBe(true);
    });

    it('should return restaurants from all countries for ADMIN user', async () => {
      mockRestaurantsRepository.findAll.mockResolvedValue(mockAllRestaurants);

      const result = await service.findAll('ADMIN', 'IN');

      expect(repository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockAllRestaurants);
      expect(result).toHaveLength(4);
      expect(result.filter((r) => r.country === 'IN')).toHaveLength(2);
      expect(result.filter((r) => r.country === 'US')).toHaveLength(2);
    });
  });
});
