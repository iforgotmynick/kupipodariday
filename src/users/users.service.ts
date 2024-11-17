import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
    const hashedPassword = await this.hashingService.hashPassword(password);
    const newUser = this.userRepository.create({
      ...otherUserData,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findBySearch(search: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [
        { username: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
    });

    return users;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    delete user.email;

    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await this.hashingService.hashPassword(
        updateUserDto.password,
      );
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }
}
