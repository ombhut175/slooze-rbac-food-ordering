import { Module } from '@nestjs/common';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import { DatabaseModule } from '../../core/database/database.module';
import { SupabaseModule } from '../../core/supabase/supabase.module';

/**
 * Module for payment method management
 * Provides CRUD operations for payment methods with ADMIN-only access for create/update
 */
@Module({
  imports: [DatabaseModule, SupabaseModule],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
