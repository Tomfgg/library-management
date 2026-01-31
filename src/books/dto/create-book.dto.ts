import { IsString, IsInt, Min } from 'class-validator';

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsString()
    isbn: string;

    @IsInt()
    @Min(0)
    availableQuantity: number;

    @IsString()
    shelfLocation: string;
}
