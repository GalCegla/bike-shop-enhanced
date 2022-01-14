import { Size } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateBikeDTO {
  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(Size)
  @IsOptional()
  size?: Size;
}
