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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Get a user with an ID' })
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id });
  }

  @Get()
  @ApiOkResponse({ description: 'Get all users' })
  @ApiBearerAuth()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @Post()
  @ApiCreatedResponse({ description: 'Create a user' })
  @ApiBody({ type: CreateUserDTO })
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<UserModel> {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Update a user using a user ID' })
  @ApiBody({ type: UpdateUserDTO })
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
  @ApiOkResponse({ description: 'Delete a user using a user ID' })
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id });
  }
}
