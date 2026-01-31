import { Controller, Post, Body, UseGuards, Param, ParseIntPipe, Get } from '@nestjs/common';
import { BorrowingService } from './borrowings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('borrowings')
export class BorrowingController {
    constructor(private readonly borrowingService: BorrowingService) { }

    @Post('checkout/:id')
    @UseGuards(JwtAuthGuard)
    checkout(
        @CurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.borrowingService.checkout(userId, id);
    }

    @Post('return/:id')
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
