import { jwtSecret } from '@/common/constants';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = await this.jwtService.verifyAsync(token, {
          secret: jwtSecret,
        });

        req.userId = {
          id: decoded.id,
        };
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    next();
  }
}
