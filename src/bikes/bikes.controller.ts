import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Bike as BikeModel, Prisma } from '@prisma/client';
import { Rental as RentalModel } from '@prisma/client';
import { isEmpty } from 'lodash';
import { RentalService } from 'src/rentals/rental.service';
import { BikeService } from './bike.service';
import { CreateBikeDTO } from './dto/create-bike.dto';
import { RentBikeDTO } from './dto/rent-bike.dto';
import { ReturnBikeDTO } from './dto/return-bike.dto';
import { UpdateBikeDTO } from './dto/update-bike.dto';

@Controller('bikes')
export class BikesController {
  constructor(
    private bikeService: BikeService,
    private rentalService: RentalService,
  ) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Get a bike with a bike ID' })
  async getBikeById(
    @Param('id') id: string,
  ): Promise<BikeModel | NotFoundException> {
    const bike = await this.bikeService.bike({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
    }
    return bike;
  }

  @Get()
  @ApiOkResponse({ description: 'Get all bikes' })
  @ApiBearerAuth()
  async getAllBikes(): Promise<BikeModel[]> {
    return this.bikeService.bikes({});
  }

  @Post()
  @ApiOkResponse({ description: 'Create a bike' })
  @ApiBearerAuth()
  async createBike(@Body() createBikeDto: CreateBikeDTO): Promise<BikeModel> {
    return this.bikeService.createBike(createBikeDto);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Update a bike using a bike ID' })
  @ApiBearerAuth()
  async updateBike(
    @Body() updateBikeDto: UpdateBikeDTO,
    @Param('id') id: string,
  ): Promise<BikeModel | NotFoundException> {
    const bike = await this.bikeService.bike({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
    }

    return this.bikeService.updateBike({ where: { id }, data: updateBikeDto });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a bike using a bike ID' })
  @ApiBearerAuth()
  async deleteBike(@Param('id') id: string): Promise<BikeModel> {
    const bike = await this.bikeService.bike({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
    }

    return this.bikeService.deleteBike({ id });
  }

  @Put(':id/rent')
  @ApiOkResponse({ description: 'Rent a bike using a bike ID' })
  async rentBike(
    @Body() rentBikeDto: RentBikeDTO,
    @Param('id') id: string,
  ): Promise<RentalModel | BadRequestException | NotFoundException> {
    const bike = await this.bikeService.bike({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
    }
    if (bike.isRented) {
      throw new BadRequestException('Bike is already rented.');
    }
    const data: Prisma.RentalCreateInput = {
      bike: { connect: { id } },
      contractType: rentBikeDto.contractType,
      user: { connect: { id: rentBikeDto.userId } },
    };
    return this.bikeService.rentBike(data);
  }

  @Put(':id/return')
  @ApiOkResponse({ description: 'Return a bike using a bike ID' })
  async returnBike(
    @Param('id') id: string,
    @Body() returnBikeDto: ReturnBikeDTO,
  ): Promise<RentalModel | BadRequestException | NotFoundException> {
    const bike = await this.bikeService.bike({ id });
    if (!bike) {
      throw new NotFoundException('Bike not found.');
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

    if (rental.userId !== returnBikeDto.userId) {
      throw new BadRequestException('This is not your bike.');
    }

    return this.bikeService.returnBike(id, rental);
  }
}
