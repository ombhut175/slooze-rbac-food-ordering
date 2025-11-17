import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DrizzleService } from './drizzle.service';
import { UsersRepository } from './repositories/users.repository';
import { HealthCheckingRepository } from './repositories/health-checking.repository';
import { RestaurantsRepository } from './repositories/restaurants.repository';
import { OrdersRepository } from './repositories/orders.repository';
import { OrderItemsRepository } from './repositories/order-items.repository';
import { PaymentMethodsRepository } from './repositories/payment-methods.repository';
import { PaymentsRepository } from './repositories/payments.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    DrizzleService,
    UsersRepository,
    HealthCheckingRepository,
    RestaurantsRepository,
    OrdersRepository,
    OrderItemsRepository,
    PaymentMethodsRepository,
    PaymentsRepository,
  ],
  exports: [
    DrizzleService,
    UsersRepository,
    HealthCheckingRepository,
    RestaurantsRepository,
    OrdersRepository,
    OrderItemsRepository,
    PaymentMethodsRepository,
    PaymentsRepository,
  ],
})
export class DatabaseModule {}

// Note: DatabaseModule is imported in AppModule and its exports are available
// to any module that imports DatabaseModule
