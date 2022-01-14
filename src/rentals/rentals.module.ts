import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RentalService } from './rental.service';
import { RentalsController } from './rentals.controller';

@Module({
  imports: [],
  controllers: [RentalsController],
  providers: [PrismaService, RentalService],
})
export class RentalsModule {}
