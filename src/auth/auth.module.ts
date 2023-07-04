import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authEntity } from './entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      authEntity
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRETORPRIVATE'),
        signOptions: {
          expiresIn: '4h'
        },
        verifyOptions: {
          complete: false,
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
