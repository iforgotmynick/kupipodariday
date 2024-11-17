import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Request() req): Promise<User> {
    return req.user;
  }

  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getOwnWishes(@Request() req): Promise<Wish[]> {
    return this.usersService
      .findOneByUsername(req.user.name)
      .then((user) => user.wishes);
  }

  @Get(':id')
  findOne(@Param('id') username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':id/wishes')
  getWishes(@Param('id') username: string): Promise<Wish[]> {
    return this.usersService
      .findOneByUsername(username)
      .then((user) => user.wishes);
  }

  @Post('find')
  findMany(@Body() { query }: { query: string }): Promise<User[]> {
    return this.usersService.findBySearch(query);
  }
}
