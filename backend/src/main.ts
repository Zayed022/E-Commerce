import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // allow all during production
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000); // <-- important for Render
  console.log(`Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
