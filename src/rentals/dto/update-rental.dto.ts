import { ApiProperty } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateRentalDTO {
  @IsEnum(ContractType)
  @IsOptional()
  @ApiProperty({ type: String, description: 'contract type' })
  contractType?: ContractType;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean, description: 'is the rental payed' })
  isPayed?: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty({ type: Number, description: 'bill' })
  bill?: number;
}
