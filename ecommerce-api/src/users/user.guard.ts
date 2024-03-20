import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { USERID_API_PARAM } from 'src/configs/config';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.params[USERID_API_PARAM];
    if (!userId) {
      throw new BadRequestException('Invalid User ID');
    }
    try {
      const payload = await this.usersService.getUserById(userId);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.headers[USERID_API_PARAM] = payload;
    } catch {
      throw new BadRequestException('Invalid User ID');
    }
    return true;
  }
}
