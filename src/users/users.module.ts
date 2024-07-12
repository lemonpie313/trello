import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
<<<<<<< HEAD
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
=======
import { Comment } from '../comments/entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
>>>>>>> a50d4c9 (update. 댓글 생성 기능)
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
