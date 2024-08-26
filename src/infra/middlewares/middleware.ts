import { jwtSecret } from '@/common/constants';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async use(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = await this.jwtService.verifyAsync(token, {
          secret: jwtSecret,
        });

        const user = await this.prismaService.user.findFirst({
          where: {
            email: decoded.email,
          },
        });

        if (!user) {
          throw new UnauthorizedException('Invalid token');
        }

        req.userId = user.id;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    next();
  }
}
