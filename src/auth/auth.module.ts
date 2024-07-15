import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './stategies/local.strategy';
import { JwtStrategy } from './stategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { Board } from 'src/boards/entities/board.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { ListsModule } from 'src/lists/lists.module';
import { Lists } from 'src/lists/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Board, Lists]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '12h' },
      }),
    }),
    BoardsModule,
    ListsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
