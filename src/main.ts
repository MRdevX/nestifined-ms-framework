import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app/app.module";
import { AllExceptionsFilter } from "./app/core/filters/all-exceptions.filter";
import logger from "./logger";

async function bootstrap(): Promise<void> {
  let app: INestApplication;

  try {
    app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    const { port, host, apiPrefix, env, name, cors } = config.get("app");

    app.use(helmet());
    app.enableCors({
      origin: cors === "true" ? true : cors,
      credentials: true,
    });

    app.setGlobalPrefix(apiPrefix, { exclude: ["/", "/health"] });
    app.enableVersioning({ type: VersioningType.URI });

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: env === "production",
        disableErrorMessages: env === "production",
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter(config));

    if (env !== "production") {
      const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle(name)
          .setVersion("1.0.0")
          .setDescription(`${name} API Documentation`)
          .addBearerAuth()
          .build(),
      );
      SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    }

    await app.listen(port, host);
    logger.info(`🚀 ${name} started on ${await app.getUrl()}`);
    logger.info(`📋 Environment: ${env}`);

    app.enableShutdownHooks();
    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string): Promise<void> => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info(`🛑 ${signal} received, shutting down gracefully...`);
      try {
        await app.close();
        logger.info("✅ Application closed successfully");
        process.exit(0);
      } catch (error) {
        logger.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("❌ Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  logger.error("❌ Bootstrap failed:", error);
  process.exit(1);
});
