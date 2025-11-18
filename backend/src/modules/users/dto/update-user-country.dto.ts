import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCountryDto {
  @ApiProperty({
    description: 'User country to assign',
    example: 'IN',
    enum: ['IN', 'US'],
  })
  @IsEnum(['IN', 'US'], {
    message: 'Country must be one of: IN, US',
  })
  @IsNotEmpty({ message: 'Country is required' })
  country!: 'IN' | 'US';
}
