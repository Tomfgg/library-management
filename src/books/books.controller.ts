import { Controller, Post, Body, Get, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BadRequestException } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() dto: CreateBookDto) {
        return this.booksService.create(dto);
    }

    @Get()
    findAll(
        @Query('key') key?: string,
        @Query('value') value?: string,
    ) {
        // Both or none
        if ((key && !value) || (!key && value)) {
            throw new BadRequestException('Both search key and value must be provided together');
        }

        if (key && value) {
            return this.booksService.search(key, value);
        }

        return this.booksService.findAll();
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('At least one field must be provided');
        }

        return this.booksService.update(+id, dto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string) {
        return this.booksService.remove(+id);
    }
}
