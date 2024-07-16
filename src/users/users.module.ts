import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Comment } from '../comments/entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
