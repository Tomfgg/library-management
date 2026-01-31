import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const adminKey = request.headers['x-admin-key'];

        if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
            throw new ForbiddenException('Access denied. Admin key is invalid or missing.');
        }

        return true;
    }
}
