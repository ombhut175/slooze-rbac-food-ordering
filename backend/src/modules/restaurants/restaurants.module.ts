import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { DatabaseModule } from '../../core/database/database.module';
import { SupabaseModule } from '../../core/supabase/supabase.module';

/**
 * Module for restaurant and menu management
 * Provides country-scoped access to restaurants based on user role
 */
@Module({
  imports: [DatabaseModule, SupabaseModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
