import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authEntity } from './entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([authEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
