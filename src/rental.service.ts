import { Injectable } from '@nestjs/common';
import { Rental, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async rental(
    rentalWhereUniqueInput: Prisma.RentalWhereUniqueInput,
  ): Promise<Rental | null> {
    return this.prisma.rental.findUnique({ where: rentalWhereUniqueInput });
  }

  async rentals(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RentalWhereUniqueInput;
    where?: Prisma.RentalWhereInput;
    orderBy?: Prisma.RentalOrderByWithRelationInput;
  }): Promise<Rental[]> {
    return this.prisma.rental.findMany({ ...params });
  }

  async createRental(data: Prisma.RentalCreateInput): Promise<Rental> {
    return this.prisma.rental.create({ data });
  }

  async updateRental(params: {
    where: Prisma.RentalWhereUniqueInput;
    data: Prisma.RentalUpdateInput;
  }): Promise<Rental> {
    return this.prisma.rental.update({ ...params });
  }

  async deleteRental(where: Prisma.RentalWhereUniqueInput): Promise<Rental> {
    return this.prisma.rental.delete({ where });
  }
}
