import { BadRequestException } from '@nestjs/common';
import { BooksController } from './books.controller';

describe('BooksController', () => {
    let controller: BooksController;
    const mockService: any = {
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new BooksController(mockService);
    });

    describe('create', () => {
        it('delegates to service.create', async () => {
            mockService.create.mockResolvedValue({ id: 1 });
            const res = await controller.create({ title: 't' } as any);
            expect(res).toEqual({ id: 1 });
            expect(mockService.create).toHaveBeenCalledWith({ title: 't' });
        });
    });

    describe('findAll', () => {
        it('throws when only one query present', () => {
            expect(() => controller.findAll('key', undefined as any)).toThrow(BadRequestException);
            expect(() => controller.findAll(undefined as any, 'value')).toThrow(BadRequestException);
        });

        it('calls search when both provided', () => {
            controller.findAll('title', 'x');
            expect(mockService.search).toHaveBeenCalledWith('title', 'x');
        });

        it('calls findAll when none provided', () => {
            controller.findAll(undefined, undefined);
            expect(mockService.findAll).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('throws when dto empty', () => {
            expect(() => controller.update('1', {} as any)).toThrow(BadRequestException);
        });

        it('delegates to service.update', () => {
            controller.update('2', { title: 'y' } as any);
            expect(mockService.update).toHaveBeenCalledWith(2, { title: 'y' });
        });
    });

    describe('remove', () => {
        it('delegates to service.remove', () => {
            controller.remove('3');
            expect(mockService.remove).toHaveBeenCalledWith(3);
        });
    });
});
