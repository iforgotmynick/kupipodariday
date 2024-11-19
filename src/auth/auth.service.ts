import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashingService } from 'src/services/hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashingService: HashingService,
  ) {}
  private readonly logger = new Logger('AuthService');

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (user && this.hashingService.comparePassword(password, user.password)) {
      const { password: _, ...result } = user;

      return result;
    }

    return null;
  }
}
