import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateBookDto) {
        const existing = await this.prisma.book.findUnique({ where: { isbn: dto.isbn } });
        if (existing) throw new BadRequestException('isbn already in use');

        return this.prisma.book.create({ data: dto });
    }

    async findAll() {
        return this.prisma.book.findMany();
    }

    async search(key: string, value: string) {
        const allowedKeys = ['title', 'author', 'isbn'];
        if (!allowedKeys.includes(key)) {
            throw new BadRequestException(`Search key must be one of: ${allowedKeys.join(', ')}`);
        }

        const filter = {};
        filter[key] = { contains: value, mode: 'insensitive' };

        return this.prisma.book.findMany({
            where: filter,
        });
    }


    async checkBookExists(id: number) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        if (!book) throw new NotFoundException('Book not found');
    }

    async update(id: number, dto: UpdateBookDto) {
        await this.checkBookExists(id); // check exists
        return this.prisma.book.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.checkBookExists(id); // check exists
        await this.prisma.$transaction([
            this.prisma.borrowing.deleteMany({
                where: { bookId: id },
            }),
            this.prisma.book.delete({
                where: { id },
            }),
        ]);
    }
}
