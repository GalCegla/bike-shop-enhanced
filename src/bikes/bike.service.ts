import { Injectable } from '@nestjs/common';
import { Bike, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BikeService {
  constructor(private prisma: PrismaService) {}

  async bike(
    bikeWhereUniqueInput: Prisma.BikeWhereUniqueInput,
  ): Promise<Bike | null> {
    return this.prisma.bike.findUnique({ where: bikeWhereUniqueInput });
  }

  async bikes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BikeWhereUniqueInput;
    where?: Prisma.BikeWhereInput;
    orderBy?: Prisma.BikeOrderByWithRelationInput;
  }): Promise<Bike[]> {
    return this.prisma.bike.findMany({ ...params });
  }

  async createBike(data: Prisma.BikeCreateInput): Promise<Bike> {
    return this.prisma.bike.create({ data });
  }

  async updateBike(params: {
    where: Prisma.BikeWhereUniqueInput;
    data: Prisma.BikeUpdateInput;
  }): Promise<Bike> {
    return this.prisma.bike.update({ ...params });
  }

  async deleteBike(where: Prisma.BikeWhereUniqueInput): Promise<Bike> {
    return this.prisma.bike.delete({ where });
  }
}
