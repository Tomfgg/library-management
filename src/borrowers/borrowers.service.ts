import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateBorrowerDto } from './dto/create-borrower.dto';
import { UpdateBorrowerDto } from './dto/update-borrower.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenService } from 'src/common/services/jwt-token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BorrowersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly configService: ConfigService
    ) { }

    async findAll() {
        return this.prisma.borrower.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async checkBorrowerExists(id: number) {
        const borrower = await this.prisma.borrower.findUnique({ where: { id } });
        if (!borrower) throw new NotFoundException('Borrower not found');
    }

    async update(id: number, dto: UpdateBorrowerDto) {
        await this.checkBorrowerExists(id); // check exists

        const data: any = { ...dto };

        if (dto.password) {
            const saltRounds = Number(this.configService.get('SALT_ROUNDS'));
            data.password = await bcrypt.hash(dto.password, saltRounds);
        }

        return this.prisma.borrower.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
    }

    async remove(id: number) {
        await this.checkBorrowerExists(id); // check exists

        await this.prisma.$transaction([
            this.prisma.borrowing.deleteMany({
                where: { borrowerId: id },
            }),
            this.prisma.borrower.delete({
                where: { id },
            }),
        ]);
    }

    async register(dto: CreateBorrowerDto) {
        const existing = await this.prisma.borrower.findUnique({ where: { email: dto.email } });
        if (existing) throw new BadRequestException('Email already in use');

        const saltRounds = Number(this.configService.get('SALT_ROUNDS'));
        const hashed = await bcrypt.hash(dto.password, saltRounds);

        const user = await this.prisma.borrower.create({
            data: { name: dto.name, email: dto.email, password: hashed },
        });

        return { id: user.id, name: user.name, email: user.email };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.borrower.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtTokenService.sign(payload);

        return { access_token };
    }
}
