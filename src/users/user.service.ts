import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | NotFoundException> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      ...params,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User | NotFoundException> {
    try {
      const user = await this.prisma.user.update({ ...params });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | NotFoundException> {
    try {
      const user = await this.prisma.user.delete({ where });
      return user;
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }
}
