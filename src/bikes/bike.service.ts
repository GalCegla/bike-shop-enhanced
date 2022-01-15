import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Bike, ContractType, Prisma, Rental } from '@prisma/client';
import { RentalService } from 'src/rentals/rental.service';
import { PrismaService } from '../prisma.service';
import * as moment from 'moment';
import { isEmpty } from 'lodash';

@Injectable()
export class BikeService {
  constructor(
    private prisma: PrismaService,
    private rentalService: RentalService,
  ) {}

  async bike(
    bikeWhereUniqueInput: Prisma.BikeWhereUniqueInput,
  ): Promise<Bike | NotFoundException> {
    const bike = await this.prisma.bike.findUnique({
      where: bikeWhereUniqueInput,
    });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
    }
    return bike;
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
  }): Promise<Bike | NotFoundException> {
    try {
      const bike = await this.prisma.bike.update({ ...params });
      return bike;
    } catch (error) {
      throw new NotFoundException('Bike not found.');
    }
  }

  async deleteBike(where: Prisma.BikeWhereUniqueInput): Promise<Bike> {
    return this.prisma.bike.delete({ where });
  }

  async rentBike(
    rentalData: Prisma.RentalCreateInput,
  ): Promise<Rental | BadRequestException> {
    const bike = await this.bike({ id: rentalData.bike.connect.id });
    if (bike instanceof NotFoundException) {
      throw new NotFoundException(bike.message);
    }
    if (bike.isRented) {
      throw new BadRequestException('Bike is already rented.');
    }
    await this.updateBike({
      where: { id: rentalData.bike.connect.id },
      data: { isRented: true },
    });
    return this.rentalService.createRental(rentalData);
  }

  async returnBike(
    bikeId: string,
    userId: string,
  ): Promise<Rental | BadRequestException | NotFoundException> {
    const bike = await this.bike({ id: bikeId });
    if (bike instanceof NotFoundException) {
      throw new NotFoundException(bike.message);
    }
    if (!bike.isRented) {
      throw new BadRequestException('Bike is not rented.');
    }
    const rentalArray = await this.rentalService.rentals({
      where: { bikeId: bike.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    if (isEmpty(rentalArray)) {
      throw new NotFoundException('No rentals associated with bikes found.');
    }
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

    try {
      await this.updateBike({
        where: { id: bikeId },
        data: { isRented: false },
      });
      const updatedRental = await this.rentalService.updateRental({
        where: { id: rental.id },
        data: {
          returnedAt: now,
          bill,
        },
      });
      return updatedRental;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
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
