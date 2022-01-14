import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Bike as BikeModel, ContractType, Prisma } from '@prisma/client';
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
  async getBikeById(@Param('id') id: string): Promise<BikeModel> {
    return this.bikeService.bike({ id });
  }

  @Get()
  async getAllBikes(): Promise<BikeModel[]> {
    return this.bikeService.bikes({});
  }

  @Post()
  async createBike(@Body() createBikeDto: CreateBikeDTO): Promise<BikeModel> {
    return this.bikeService.createBike(createBikeDto);
  }

  @Put(':id')
  async updateBike(
    @Body() updateBikeDto: UpdateBikeDTO,
    @Param('id') id: string,
  ): Promise<BikeModel> {
    return this.bikeService.updateBike({ where: { id }, data: updateBikeDto });
  }

  @Delete(':id')
  async deleteBike(@Param('id') id: string): Promise<BikeModel> {
    return this.bikeService.deleteBike({ id });
  }

  @Put(':id/rent')
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
  async returnBike(
    @Param('id') id: string,
    @Body() returnBikeDto: ReturnBikeDTO,
  ): Promise<RentalModel | BadRequestException> {
    return this.bikeService.returnBike(id, returnBikeDto.userId);
  }
}
