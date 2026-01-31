import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateBorrowerDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
