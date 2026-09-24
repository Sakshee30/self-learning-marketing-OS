import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { API_CONFIG, type ApiConfig, WEBSITE_API_BODY_LIMIT_BYTES } from "./config/api-config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: WEBSITE_API_BODY_LIMIT_BYTES }),
    { bufferLogs: true },
  );
  const config = app.get<ApiConfig>(API_CONFIG);

  if (config.websiteOrigins.length > 0) {
    const allowedOrigins = new Set(config.websiteOrigins);
    app.enableCors({
      credentials: false,
      methods: ["GET", "POST", "OPTIONS"],
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed"), false);
      },
    });
  }

  app.enableShutdownHooks();
  await app.listen(config.port, config.host);
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown startup failure";
  process.stderr.write(`Website API failed to start: ${message}\n`);
  process.exitCode = 1;
});
