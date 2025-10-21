import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app/app.module";
import { AllExceptionsFilter } from "./app/core/filters/all-exceptions.filter";
import logger from "./logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get("app.port");
  const host = config.get("app.host");
  const apiPrefix = config.get("app.apiPrefix");
  const env = config.get("app.env");
  const name = config.get("app.name");
  const cors = config.get("app.cors");

  app.enableShutdownHooks();
  app.use(helmet());
  app.enableCors({
    origin: cors === "true" ? true : cors,
    credentials: true,
  });
  app.setGlobalPrefix(apiPrefix, { exclude: ["/"] });
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(config));

  if (env !== "production") {
    const options = new DocumentBuilder()
      .setTitle(name)
      .setVersion("1.0.0")
      .setDescription(`${name} API Documentation`)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  await app.listen(port, host);
  const appUrl = await app.getUrl();
  logger.info(`Application is running on: ${appUrl}`);
  logger.info(`Environment: ${env}`);
  logger.info(`API Documentation available at: ${appUrl}/${apiPrefix}/docs`);
}

process.nextTick(bootstrap);
