import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
