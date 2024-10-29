import helmet from 'helmet';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import logger from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const environment = config.get('app.env');

  app.enableShutdownHooks();

  app.connectMicroservice(config.get('s2s.options'));

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  app.setGlobalPrefix(config.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (environment !== 'production') {
    const options = new DocumentBuilder()
      .setTitle(process.env.npm_package_name)
      .setVersion(process.env.npm_package_version)
      .setDescription(process.env.npm_package_description)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.startAllMicroservices();
  await app.listen(config.get('app.port'), config.get('app.host'));

  logger.info(`Application is running on: ${await app.getUrl()}`);
  logger.info(`Environment: ${environment}`);
  logger.info(`API Documentation available at: ${await app.getUrl()}/docs`);
}

process.nextTick(bootstrap);
