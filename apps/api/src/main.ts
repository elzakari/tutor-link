import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { InvalidConfigError, loadAppConfig } from "./config";

/**
 * Validates process.env before anything else starts. A bad or incomplete
 * local environment must fail fast with a message naming every missing or
 * invalid variable (S1-02 acceptance criteria), not surface as a confusing
 * failure once Nest, Prisma or a provider client tries to use it.
 */
function loadConfigOrExit() {
  try {
    return loadAppConfig(process.env);
  } catch (error) {
    if (error instanceof InvalidConfigError) {
      // No Nest logger yet at this point — bootstrap() hasn't created the
      // app — so this is a deliberate, direct console write.
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

async function bootstrap() {
  const config = loadConfigOrExit();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  await app.listen(config.port);
}

void bootstrap();
