import { ContractType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class RentBikeDTO {
  @IsEnum(ContractType)
  contractType: ContractType;

  @IsString()
  userId: string;
}
