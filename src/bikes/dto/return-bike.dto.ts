import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReturnBikeDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'user ID' })
  userId: string;
}
