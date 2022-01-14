import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
