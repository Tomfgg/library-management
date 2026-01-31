import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';

export async function exportXlsx(data: any[], res: Response, filename: string) {
    if (!data.length) {
        throw new NotFoundException('No data to export');
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');

    sheet.columns = [
        { header: 'borrower', key: 'borrower' },
        { header: 'book', key: 'book' },
        { header: 'borrowedAt', key: 'borrowedAt' },
        { header: 'returnedAt', key: 'returnedAt' },
    ];

    sheet.columns = Object.keys(data[0]).map((k) => ({
        header: k,
        key: k,
    }));

    sheet.addRows(data);

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
}
