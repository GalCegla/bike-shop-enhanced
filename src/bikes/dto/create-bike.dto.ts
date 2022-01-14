import { ApiProperty } from '@nestjs/swagger';
import { Size } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateBikeDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'color' })
  color: string;

  @IsEnum(Size)
  @ApiProperty({ type: String, description: 'size' })
  size: Size;
}
