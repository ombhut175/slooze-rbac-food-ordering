import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MockPaymentService } from './mock-payment.service';
import { DatabaseModule } from '../../core/database/database.module';
import { SupabaseModule } from '../../core/supabase/supabase.module';

/**
 * Module for order management
 * Provides country-scoped access to orders based on user role
 */
@Module({
  imports: [DatabaseModule, SupabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, MockPaymentService],
  exports: [OrdersService, MockPaymentService],
})
export class OrdersModule {}
