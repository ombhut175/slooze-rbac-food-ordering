import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for adding an item to an order
 * Item must belong to the order's restaurant
 */
export class AddOrderItemDto {
  @ApiProperty({
    description: 'Menu item ID to add to the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'Menu item ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Menu item ID is required' })
  menuItemId!: string;

  @ApiProperty({
    description: 'Quantity of the menu item',
    example: 2,
    minimum: 1,
  })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}
