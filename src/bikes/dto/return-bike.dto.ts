import { IsString } from 'class-validator';

export class ReturnBikeDTO {
  @IsString()
  userId: string;
}
