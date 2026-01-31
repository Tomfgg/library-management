
import { Module, Global } from '@nestjs/common';
import { JwtTokenService } from './services/jwt-token.service';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
    providers: [
        JwtTokenService,
        AdminGuard,
        JwtAuthGuard
    ],
    exports: [
        JwtTokenService,
        AdminGuard,
        JwtAuthGuard
    ],
})
export class CommonModule { }
