import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/auth/entity/auth.entity';
import { AuthService } from 'src/auth/auth.service';

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
  providers: [RecordService, AuthService],
  controllers: [RecordController]
})
export class RecordModule {}
