import { Controller, Post, Body, UseGuards, Param, ParseIntPipe, Get } from '@nestjs/common';
import { BorrowingService } from './borrowings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@Controller('borrowings')
export class BorrowingController {
    constructor(private readonly borrowingService: BorrowingService) { }

    @Post('checkout/:id')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @UseGuards(JwtAuthGuard)
    checkout(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.borrowingService.checkout(userId, id);
    }

    @Post('return/:id')
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @UseGuards(JwtAuthGuard)
    returnBook(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.borrowingService.returnBook(userId, id);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    myBorrowed(@CurrentUserId() userId: number) {
        return this.borrowingService.myBorrowedBooks(userId);
    }

    @Get('overdue')
    @UseGuards(AdminGuard)
    overdue() {
        return this.borrowingService.overdue();
    }
}
