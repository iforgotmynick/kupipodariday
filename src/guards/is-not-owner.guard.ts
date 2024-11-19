import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class IsNotOwnerGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromToken = request.user.id;

    const user = await this.usersService.findOne(userIdFromToken);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userIdFromToken === user.id) {
      throw new ForbiddenException('You are not allowed to update this');
    }

    return true;
  }
}
