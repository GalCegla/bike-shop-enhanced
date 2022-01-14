import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RentalService } from 'src/rentals/rental.service';
import { BikeService } from './bike.service';
import { BikesController } from './bikes.controller';

@Module({
  imports: [],
  controllers: [BikesController],
  providers: [PrismaService, BikeService, RentalService],
})
export class BikesModule {}
