import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { RentalService } from './rental.service';
import { Rental as RentalModel } from '@prisma/client';
import { UpdateRentalDTO } from './dto/update-rental.dto';

@Controller('rentals')
export class RentalsController {
  // No POST - Rentals are created on bike rent. See bike.service.ts
  constructor(private rentalService: RentalService) {}

  @Get(':id')
  async getRentalById(@Param('id') id: string): Promise<RentalModel> {
    return this.rentalService.rental({ id });
  }

  @Get()
  async getAllRentals(): Promise<RentalModel[]> {
    return this.rentalService.rentals({});
  }

  @Put(':id')
  async updateRental(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDTO,
  ) {
    return this.rentalService.updateRental({
      where: { id },
      data: updateRentalDto,
    });
  }

  @Delete(':id')
  async deleteRental(@Param('id') id: string): Promise<RentalModel> {
    return this.rentalService.deleteRental({ id });
  }
}
