import { ApiProperty } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class RentBikeDTO {
  @IsEnum(ContractType)
  @ApiProperty({ type: String, description: 'contract type' })
  contractType: ContractType;

  @IsString()
  @ApiProperty({ type: String, description: 'user ID' })
  userId: string;
}
