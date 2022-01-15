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
import { BikeService } from './bike.service';
import { CreateBikeDTO } from './dto/create-bike.dto';
import { RentBikeDTO } from './dto/rent-bike.dto';
import { ReturnBikeDTO } from './dto/return-bike.dto';
import { UpdateBikeDTO } from './dto/update-bike.dto';

@Controller('bikes')
export class BikesController {
  constructor(private bikeService: BikeService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Get a bike with a bike ID' })
  async getBikeById(
    @Param('id') id: string,
  ): Promise<BikeModel | NotFoundException> {
    return this.bikeService.bike({ id });
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
    return this.bikeService.updateBike({ where: { id }, data: updateBikeDto });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a bike using a bike ID' })
  @ApiBearerAuth()
  async deleteBike(@Param('id') id: string): Promise<BikeModel> {
    return this.bikeService.deleteBike({ id });
  }

  @Put(':id/rent')
  @ApiOkResponse({ description: 'Rent a bike using a bike ID' })
  async rentBike(
    @Body() rentBikeDto: RentBikeDTO,
    @Param('id') id: string,
  ): Promise<RentalModel | BadRequestException> {
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
    return this.bikeService.returnBike(id, returnBikeDto.userId);
  }
}
