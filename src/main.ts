import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 8000;

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('falltect')
    .setDescription('2023 DSM hackathon')
    .setVersion('1.0.0')
    .addTag('hackathon')
    .build()
  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, doc);

  app.enableCors();

  await app.listen(port);
}
bootstrap();
