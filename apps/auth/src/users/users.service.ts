import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from './model/user.schema';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  private log = new Logger();
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUser: CreateUserDto) {
    await this.validateCreateUserDto(createUser);
    return this.userRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({
        email: createUserDto.email,
      });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ email });
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Credential is incorrect');
    }

    return user;
  }

  async getUser(getUserdto: GetUserDto) {
    return this.userRepository.findOne(getUserdto);
  }
}
