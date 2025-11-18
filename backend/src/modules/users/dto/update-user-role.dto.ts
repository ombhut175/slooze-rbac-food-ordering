import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'User role to assign',
    example: 'MANAGER',
    enum: ['ADMIN', 'MANAGER', 'MEMBER'],
  })
  @IsEnum(['ADMIN', 'MANAGER', 'MEMBER'], {
    message: 'Role must be one of: ADMIN, MANAGER, MEMBER',
  })
  @IsNotEmpty({ message: 'Role is required' })
  role!: 'ADMIN' | 'MANAGER' | 'MEMBER';
}
