import { Module } from '@nestjs/common';
import { BorrowingService } from './borrowings.service';
import { BorrowingController } from './borrowings.controller';

@Module({
    controllers: [BorrowingController],
    providers: [BorrowingService],
})
export class BorrowingModule { }
