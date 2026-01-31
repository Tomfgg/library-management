import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtTokenService: JwtTokenService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }

        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        try {
            // Verify token
            const payload = this.jwtTokenService.verify(token);

            // Attach borrower ID to request
            request['user'] = { userId: payload.sub, email: payload.email };

            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
