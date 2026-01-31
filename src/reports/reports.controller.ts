import { Controller, Post, Body, UseGuards, Param, ParseIntPipe, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import type { Response } from 'express';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('borrowings-per-period')
    @UseGuards(AdminGuard)
    getAnalytics(
        @Query() query: AnalyticsQueryDto,
        @Res() res: Response,
    ) {
        const fromDate = new Date(query.from);
        const toDate = new Date(query.to);

        if (fromDate > toDate) {
            throw new BadRequestException('from must be before to');
        }

        if (toDate > new Date()) {
            throw new BadRequestException('to cannot be in the future');
        }

        return this.reportsService.exportPerPeriod(
            fromDate,
            toDate,
            res
        );
    }

    @Get('overdue-last-month')
    @UseGuards(AdminGuard)
    async exportOverdue(
        @Res() res: Response,
    ) {
        return this.reportsService.exportOverdueLastMonth(res);
    }

    @Get('borrowings-last-month')
    @UseGuards(AdminGuard)
    async exportAll(
        @Res() res: Response,
    ) {
        return this.reportsService.exportAllLastMonth(res);
    }


}