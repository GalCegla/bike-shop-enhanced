import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BikesModule } from './bikes/bikes.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, BikesModule, RentalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
