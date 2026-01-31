import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BorrowersModule } from './borrowers/borrowers.module';
import { CommonModule } from './common/common.module';
import { BooksModule } from './books/books.module';
import { BorrowingModule } from './borrowings/borrowings.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        CommonModule,
        BorrowersModule,
        BooksModule,
        BorrowingModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
