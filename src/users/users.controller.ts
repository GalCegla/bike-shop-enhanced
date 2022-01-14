import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id });
  }

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<UserModel> {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Put(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDTO,
    @Param('id') id: string,
  ): Promise<UserModel> {
    if (!updateUserDto.password) {
      return this.userService.updateUser({
        where: { id },
        data: updateUserDto,
      });
    }
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    return this.userService.updateUser({
      where: { id },
      data: { ...updateUserDto, password: hashedPassword },
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id });
  }
}
