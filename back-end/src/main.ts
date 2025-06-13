import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3001);
  console.log('Serviço rodando na porta: 3001');
}
bootstrap();
