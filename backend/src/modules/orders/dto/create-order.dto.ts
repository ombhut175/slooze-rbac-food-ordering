import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new order
 * Order will be created in DRAFT status with zero total
 */
export class CreateOrderDto {
  @ApiProperty({
    description: 'Restaurant ID for the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Restaurant ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurantId!: string;
}
