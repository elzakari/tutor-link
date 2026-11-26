import { loadAppConfig } from "./load-app-config";
import { InvalidConfigError } from "./config.errors";

function validEnv(): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "test",
    PORT: "3001",
    DATABASE_URL: "postgresql://tutor_link:tutor_link_dev@localhost:5432/tutor_link",
    REDIS_URL: "redis://localhost:6379",
    S3_ENDPOINT: "localhost",
    S3_PORT: "9000",
    S3_USE_SSL: "false",
    S3_REGION: "us-east-1",
    S3_ACCESS_KEY: "tutor_link",
    S3_SECRET_KEY: "tutor_link_dev_minio",
    S3_PRIVATE_BUCKET: "tl-private",
    S3_PUBLIC_BUCKET: "tl-public-assets",
    SMTP_HOST: "localhost",
    SMTP_PORT: "1025",
  };
}

describe("loadAppConfig", () => {
  it("returns a typed AppConfig when every required variable is present and valid", () => {
    const config = loadAppConfig(validEnv());

    expect(config).toEqual({
      nodeEnv: "test",
      port: 3001,
      database: { url: "postgresql://tutor_link:tutor_link_dev@localhost:5432/tutor_link" },
      redis: { url: "redis://localhost:6379" },
      storage: {
        endpoint: "localhost",
        port: 9000,
        useSsl: false,
        region: "us-east-1",
        accessKey: "tutor_link",
        secretKey: "tutor_link_dev_minio",
        privateBucket: "tl-private",
        publicBucket: "tl-public-assets",
      },
      mail: { host: "localhost", port: 1025 },
    });
  });

  it("applies defaults for NODE_ENV, PORT and the bucket names when they are omitted", () => {
    const env = validEnv();
    delete env.NODE_ENV;
    delete env.PORT;
    delete env.S3_PRIVATE_BUCKET;
    delete env.S3_PUBLIC_BUCKET;

    const config = loadAppConfig(env);

    expect(config.nodeEnv).toBe("development");
    expect(config.port).toBe(3001);
    expect(config.storage.privateBucket).toBe("tl-private");
    expect(config.storage.publicBucket).toBe("tl-public-assets");
  });

  it("throws InvalidConfigError naming a single missing required variable", () => {
    const env = validEnv();
    delete env.DATABASE_URL;

    expect(() => loadAppConfig(env)).toThrow(InvalidConfigError);
    try {
      loadAppConfig(env);
      throw new Error("loadAppConfig should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidConfigError);
      expect((error as InvalidConfigError).problems).toEqual(
        expect.arrayContaining([expect.stringContaining("DATABASE_URL")]),
      );
      expect((error as InvalidConfigError).message).toContain("DATABASE_URL");
    }
  });

  it("names every missing or invalid variable when several are wrong", () => {
    const env = validEnv();
    delete env.REDIS_URL;
    delete env.SMTP_HOST;
    env.S3_PORT = "not-a-number";

    try {
      loadAppConfig(env);
      throw new Error("loadAppConfig should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidConfigError);
      const problems = (error as InvalidConfigError).problems;
      expect(problems).toEqual(
        expect.arrayContaining([
          expect.stringContaining("REDIS_URL"),
          expect.stringContaining("SMTP_HOST"),
          expect.stringContaining("S3_PORT"),
        ]),
      );
    }
  });
});
