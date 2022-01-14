import { BadRequestException, Injectable } from '@nestjs/common';
import { Bike, ContractType, Prisma, Rental } from '@prisma/client';
import { RentalService } from 'src/rentals/rental.service';
import { PrismaService } from '../prisma.service';
import * as moment from 'moment';

@Injectable()
export class BikeService {
  constructor(
    private prisma: PrismaService,
    private rentalService: RentalService,
  ) {}

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

  async rentBike(
    rentalData: Prisma.RentalCreateInput,
  ): Promise<Rental | BadRequestException> {
    const bike = await this.bike({ id: rentalData.bike.connect.id });
    if (bike.isRented) {
      throw new BadRequestException('Bike is already rented.');
    }
    await this.updateBike({
      where: { id: rentalData.bike.connect.id },
      data: { isRented: true },
    });
    return this.rentalService.createRental(rentalData);
  }

  async returnBike(bikeId: string, userId: string): Promise<Rental> {
    const bike = await this.bike({ id: bikeId });
    if (!bike.isRented) {
      throw new BadRequestException('Bike is not rented.');
    }
    const rentalArray = await this.rentalService.rentals({
      where: { bikeId: bike.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const rental = rentalArray[0];
    if (rental.returnedAt) {
      throw new BadRequestException(
        'This rental is over, the bike was already returned.',
      );
    }

    if (rental.userId !== userId) {
      throw new BadRequestException('This is not your bike.');
    }

    const now = new Date();
    const bill = billCalculator(now, rental.createdAt, rental.contractType);

    await this.updateBike({
      where: { id: bikeId },
      data: { isRented: false },
    });
    return this.rentalService.updateRental({
      where: { id: rental.id },
      data: {
        returnedAt: now,
        bill,
      },
    });
  }
}

function billCalculator(
  returnDate: Date,
  rentalDate: Date,
  contractType: ContractType,
) {
  let type: 'hours' | 'days' | 'weeks';
  let perUnit: number;
  switch (contractType) {
    case ContractType.HOUR:
      type = 'hours';
      perUnit = 20;
      break;
    case ContractType.DAY:
      type = 'days';
      perUnit = 50;
      break;
    case ContractType.WEEK:
      type = 'weeks';
      perUnit = 100;
      break;
  }
  let bill =
    Math.ceil(moment(returnDate).diff(moment(rentalDate), type)) * perUnit;

  if (!bill) {
    bill = perUnit;
  }

  return bill;
}
