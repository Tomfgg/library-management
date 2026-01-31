import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use(bodyParser.json({ limit: '30mb' })); app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, }),);
    const configService = app.get(ConfigService);
    await app.listen(configService.get<string>('PORT') || 3000);
}
bootstrap();