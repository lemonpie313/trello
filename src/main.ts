import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  // 글로벌 URL 프리픽스 설정
  app.setGlobalPrefix('api', { exclude: ['/health-check'] });

  // 글로벌 파이프라인 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Trello Clone')
    .setDescription('API description of Trello project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);
}

bootstrap();
