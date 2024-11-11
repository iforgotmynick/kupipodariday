import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/services/hashing/hashing.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...otherUserData } = createUserDto;

    // Hash the password
    const hashedPassword = await this.hashingService.hashPassword(password);

    // Create the user entity with the hashed password
    const newUser = this.userRepository.create({
      ...otherUserData,
      password: hashedPassword,
    });

    // Save the user to the database
    return this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto?.password) {
      updateUserDto.password = await this.hashingService.hashPassword(
        updateUserDto.password,
      );
    }
    const user = await this.userRepository.update({ id }, updateUserDto);

    return user;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
