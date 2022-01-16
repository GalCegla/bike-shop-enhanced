import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental as RentalModel } from '@prisma/client';
import { UpdateRentalDTO } from './dto/update-rental.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('rentals')
export class RentalsController {
  // No POST - Rentals are created on bike rent. See bike.service.ts
  constructor(private rentalService: RentalService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Get a rental with an ID' })
  async getRentalById(
    @Param('id') id: string,
  ): Promise<RentalModel | NotFoundException> {
    const rental = await this.rentalService.rental({ id });
    if (!rental) {
      throw new NotFoundException('Rental not found.');
    }
    return rental;
  }

  @Get()
  @ApiOkResponse({ description: 'Get all rentals' })
  @ApiBearerAuth()
  async getAllRentals(): Promise<RentalModel[]> {
    return this.rentalService.rentals({});
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Update a rental using a rental ID' })
  async updateRental(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDTO,
  ): Promise<RentalModel | NotFoundException> {
    const rental = await this.rentalService.rental({ id });
    if (!rental) {
      throw new NotFoundException('Rental not found.');
    }

    return this.rentalService.updateRental({
      where: { id },
      data: updateRentalDto,
    });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a rental using a rental ID' })
  async deleteRental(
    @Param('id') id: string,
  ): Promise<RentalModel | NotFoundException> {
    const rental = await this.rentalService.rental({ id });
    if (!rental) {
      throw new NotFoundException('Rental not found.');
    }

    return this.rentalService.deleteRental({ id });
  }
}
