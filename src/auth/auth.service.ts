import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { BoardsService } from 'src/boards/boards.service';
import { ListsService } from 'src/lists/lists.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly boardsService: BoardsService,
    private readonly listsService: ListsService
  ) {}

  async signUp({ email, password, passwordConfirm, bio }: SignUpDto) {
    if (password !== passwordConfirm)
      throw new BadRequestException('두 비밀번호가 일치하지 않습니다.');

    const existEmail = await this.userRepository.findOneBy({ email });
    if (existEmail) throw new NotFoundException('존재하는 이메일입니다.');

    const passwordHash = this.configService.get<string>('PASSWORD_HASH');
    const hashedPassword = bcrypt.hashSync(password, passwordHash);

    const data = await this.userRepository.save({ email, password: hashedPassword, bio });

    return data;
  }

  async signIn(userId: number) {
    const payload = { id: userId };
    const accesstoken = this.jwtService.sign(payload);

    return accesstoken;
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');

    const comparedPassword = bcrypt.compareSync(password, user.password);
    if (!comparedPassword) throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    return user;
  }

  async validateMember(boardId: number, userId: number) {
    const member = await this.boardsService.findMember(userId, boardId);
    if (!member) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }
    return member;
  }

  async validateOwner(boardId: number, userId: number) {
    const member = await this.validateMember(boardId, userId);
    if (member.role !== 'owner') {
      throw new UnauthorizedException('오너만 접근할 수 있습니다.');
    }
    return member;
  }

  async validateListMember(listId: number, userId: number) {
    const list = await this.listsService.findOne(listId);
    if (!list) {
      throw new UnauthorizedException('존재하지 않는 리스트입니다.');
    }
    return this.validateMember(list.boardId, userId);
  }
}
