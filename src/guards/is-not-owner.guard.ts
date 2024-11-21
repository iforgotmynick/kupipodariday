import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class IsNotOwnerGuard implements CanActivate {
  constructor(
    @Inject(WishesService) private readonly wishesService: WishesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromToken = request.user.id;
    const wish = await this.wishesService.findOne(request.body.itemId);

    if (userIdFromToken === wish.owner) {
      throw new ForbiddenException('You are not allowed to update this');
    }

    return true;
  }
}
