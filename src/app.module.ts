import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './configs/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UsersModule,
    BoardsModule,
    ListsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [NotificationsGateway],
})
export class AppModule {}
