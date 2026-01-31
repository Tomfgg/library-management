import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { LoginDto } from './dto/login.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user.decorator';

@Controller('borrowers')
export class BorrowersController {
    constructor(private readonly borrowersService: BorrowersService) { }

    @Get()
    @UseGuards(AdminGuard)
    findAll() {
        return this.borrowersService.findAll();
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    update(@CurrentUserId() userId: number, @Body() dto: UpdateBorrowerDto) {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('At least one field must be provided');
        }

        return this.borrowersService.update(userId, dto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    remove(@CurrentUserId() userId: number) {
        return this.borrowersService.remove(userId);
    }

    @Post('register')
    register(@Body() dto: CreateBorrowerDto) {
        return this.borrowersService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.borrowersService.login(dto);
    }

}
