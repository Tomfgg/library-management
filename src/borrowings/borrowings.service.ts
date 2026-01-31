import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BorrowingService {
    constructor(private readonly prisma: PrismaService) { }

    private BORROW_DAYS = 14;

    async checkout(userId: number, bookId: number) {
        const existing = await this.prisma.borrowing.findFirst({
            where: {
                borrowerId: userId,
                bookId,
                returnedAt: null,
            },
        });

        if (existing) {
            throw new BadRequestException('You already borrowed this book');
        }

        const book = await this.prisma.book.findUnique({ where: { id: bookId } });

        if (!book) throw new NotFoundException('Book not found');
        if (book.availableQuantity <= 0) {
            throw new BadRequestException('Book not available');
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + this.BORROW_DAYS);

        return this.prisma.$transaction(async tx => {
            await tx.book.update({
                where: { id: bookId },
                data: { availableQuantity: { decrement: 1 } },
            });

            return tx.borrowing.create({
                data: {
                    borrowerId: userId,
                    bookId,
                    dueDate,
                },
            });
        });
    }

    async returnBook(userId: number, bookId: number) {
        const borrowing = await this.prisma.borrowing.findFirst({
            where: {
                bookId,
                borrowerId: userId,
                returnedAt: null,
            },
        });

        if (!borrowing) {
            throw new BadRequestException('No active borrowing found');
        }

        return this.prisma.$transaction(async tx => {
            await tx.book.update({
                where: { id: bookId },
                data: { availableQuantity: { increment: 1 } },
            });

            return tx.borrowing.update({
                where: { id: borrowing.id },
                data: { returnedAt: new Date() },
            });
        });
    }

    async myBorrowedBooks(userId: number) {
        return this.prisma.borrowing.findMany({
            where: {
                borrowerId: userId,
                returnedAt: null,
            },
            include: {
                book: true,
            },
        });
    }

    async overdue() {
        return this.prisma.borrowing.findMany({
            where: {
                returnedAt: null,
                dueDate: { lt: new Date() },
            },
            select: {
                id: true,
                borrowedAt: true,
                dueDate: true,

                borrower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        isbn: true,
                    },
                },
            },
        });
    }
}
