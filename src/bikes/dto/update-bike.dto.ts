import { ApiProperty } from '@nestjs/swagger';
import { Size } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateBikeDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'color' })
  color?: string;

  @IsEnum(Size)
  @IsOptional()
  @ApiProperty({ type: String, description: 'size' })
  size?: Size;
}
