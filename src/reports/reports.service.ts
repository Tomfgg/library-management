import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getLast30Days } from 'src/common/utils/date.util';
import { exportXlsx } from 'src/common/utils/export.util';
import { Response } from 'express';


@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) { }

    async exportPerPeriod(from: Date, to: Date, res: Response) {
        const data = await this.prisma.borrowing.findMany({
            where: {
                borrowedAt: { gte: from, lte: to },
                returnedAt: null,
                dueDate: { lt: new Date() },
            },
            include: {
                borrower: true,
                book: true,
            },
        });

        const mapped = data.map(b => ({
            borrower: b.borrower.email,
            book: b.book.title,
            borrowedAt: b.borrowedAt,
            dueDate: b.dueDate,
        }));

        return exportXlsx(mapped, res, 'borrowings.xlsx');
    }

    async exportOverdueLastMonth(res: Response) {
        const { start, end } = getLast30Days();

        const data = await this.prisma.borrowing.findMany({
            where: {
                borrowedAt: { gte: start, lte: end },
                returnedAt: null,
                dueDate: { lt: new Date() },
            },
            include: {
                borrower: true,
                book: true,
            },
        });

        const mapped = data.map(b => ({
            borrower: b.borrower.email,
            book: b.book.title,
            borrowedAt: b.borrowedAt,
            dueDate: b.dueDate,
        }));

        return exportXlsx(mapped, res, 'overdue.xlsx');
    }

    async exportAllLastMonth(res: Response) {
        const { start, end } = getLast30Days();

        const data = await this.prisma.borrowing.findMany({
            where: {
                borrowedAt: { gte: start, lte: end },
            },
            include: {
                borrower: true,
                book: true,
            },
        });

        const mapped = data.map(b => ({
            borrower: b.borrower.email,
            book: b.book.title,
            borrowedAt: b.borrowedAt,
            returnedAt: b.returnedAt,
        }));

        return exportXlsx(mapped, res, 'borrowings.xlsx');
    }

}