import { Size } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateBikeDTO {
  @IsString()
  color: string;

  @IsEnum(Size)
  size: Size;
}
