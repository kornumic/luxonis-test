import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "luxonis",
});

try {
  await client.connect();
  console.log("connected to db");
} catch (e) {
  console.log(e);
}
export const db = drizzle(client);
await migrate(db, { migrationsFolder: ".drizzle" });
