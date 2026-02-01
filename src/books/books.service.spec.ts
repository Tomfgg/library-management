import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';

describe('BooksService', () => {
    let service: BooksService;
    const mockPrisma: any = {
        book: {
            findUnique: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        borrowing: {
            deleteMany: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        service = new BooksService(mockPrisma);
    });

    describe('create', () => {
        it('throws when isbn already exists', async () => {
            mockPrisma.book.findUnique.mockResolvedValue({ id: 1, isbn: '123' });

            await expect(
                service.create({ title: 'a', author: 'b', isbn: '123' } as any),
            ).rejects.toBeInstanceOf(BadRequestException);
            expect(mockPrisma.book.create).not.toHaveBeenCalled();
        });

        it('creates when isbn not present', async () => {
            mockPrisma.book.findUnique.mockResolvedValue(null);
            mockPrisma.book.create.mockResolvedValue({ id: 2, title: 'a' });

            const res = await service.create({ title: 'a', author: 'b', isbn: '234' } as any);
            expect(res).toEqual({ id: 2, title: 'a' });
            expect(mockPrisma.book.create).toHaveBeenCalledWith({ data: { title: 'a', author: 'b', isbn: '234' } });
        });
    });

    describe('findAll', () => {
        it('returns all books', async () => {
            mockPrisma.book.findMany.mockResolvedValue([{ id: 1 }]);
            const res = await service.findAll();
            expect(res).toEqual([{ id: 1 }]);
        });
    });

    describe('search', () => {
        it('throws for invalid key', async () => {
            await expect(service.search('invalid' as any, 'v')).rejects.toBeInstanceOf(BadRequestException);
        });

        it('searches with allowed key', async () => {
            mockPrisma.book.findMany.mockResolvedValue([{ id: 2 }]);
            const res = await service.search('title', 'hello');
            expect(res).toEqual([{ id: 2 }]);
            expect(mockPrisma.book.findMany).toHaveBeenCalledWith({ where: { title: { contains: 'hello', mode: 'insensitive' } } });
        });
    });

    describe('checkBookExists', () => {
        it('throws when not found', async () => {
            mockPrisma.book.findUnique.mockResolvedValue(null);
            await expect(service.checkBookExists(5)).rejects.toBeInstanceOf(NotFoundException);
        });

        it('resolves when found', async () => {
            mockPrisma.book.findUnique.mockResolvedValue({ id: 5 });
            await expect(service.checkBookExists(5)).resolves.toBeUndefined();
        });
    });

    describe('update', () => {
        it('updates when exists', async () => {
            mockPrisma.book.findUnique.mockResolvedValue({ id: 10 });
            mockPrisma.book.update.mockResolvedValue({ id: 10, title: 'x' });

            const res = await service.update(10, { title: 'x' } as any);
            expect(res).toEqual({ id: 10, title: 'x' });
            expect(mockPrisma.book.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { title: 'x' } });
        });
    });

    describe('remove', () => {
        it('deletes borrowings and book in a transaction', async () => {
            mockPrisma.book.findUnique.mockResolvedValue({ id: 20 });
            mockPrisma.$transaction.mockResolvedValue([{}, {}]);

            await expect(service.remove(20)).resolves.toBeUndefined();
            expect(mockPrisma.$transaction).toHaveBeenCalledWith([
                mockPrisma.borrowing.deleteMany({ where: { bookId: 20 } }),
                mockPrisma.book.delete({ where: { id: 20 } }),
            ]);
        });
    });
});
