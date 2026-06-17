import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("服务器未配置 DATABASE_URL。");
  }

  client ??= postgres(process.env.DATABASE_URL, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15
  });

  return client;
}
