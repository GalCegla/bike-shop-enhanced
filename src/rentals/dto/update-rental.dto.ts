import { ContractType } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateRentalDTO {
  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsBoolean()
  @IsOptional()
  isPayed?: boolean;

  @IsInt()
  @IsOptional()
  bill?: number;
}
