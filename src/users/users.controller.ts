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
import bcrypt from 'bcrypt';

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
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ): Promise<UserModel> {
    const { password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({ ...data, password: hashedPassword });
  }

  @Put(':id')
  async updateUser(
    @Body() data: { name?: string; email?: string; password?: string },
    @Param('id') id: string,
  ): Promise<UserModel> {
    if (!data.password) {
      return this.userService.updateUser({ where: { id }, data });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userService.updateUser({
      where: { id },
      data: { ...data, password: hashedPassword },
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id });
  }
}
