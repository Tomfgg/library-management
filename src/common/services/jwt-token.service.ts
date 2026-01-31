import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtTokenService {
    constructor(private readonly configService: ConfigService) { }

    sign(payload: object): string {
        return jwt.sign(payload, this.configService.get<string>('JWT_SECRET') as string);
    }

    verify(token: string): jwt.JwtPayload {
        try {
            return jwt.verify(token, this.configService.get<string>('JWT_SECRET') as string) as jwt.JwtPayload;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    decode(token: string): jwt.JwtPayload | string | null {
        return jwt.decode(token);
    }
}
