import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
    "http://localhost:5173",
    "https://e-commerce-rho-two-66.vercel.app/",
  ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000); // <-- important for Render
  console.log(`Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
