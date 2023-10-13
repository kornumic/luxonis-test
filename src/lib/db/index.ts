import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";
import { ApartmentInsertModel, apartmentsTable } from "@/lib/db/schema";
import webScrapper from "@/lib/web-scrapper";
import { sql } from "drizzle-orm";

const client = new Client(process.env.DATABASE_URL!);

try {
  await client.connect();
  console.log("Connected to database");
} catch (e) {
  console.log(e);
  throw new Error("Internal Server Error");
}
const db = drizzle(client);

await migrate(db, {
  migrationsFolder: "./src/lib/db/migrations",
}).catch((error) => {
  console.log(`Error migrating database: ${error}`);
  throw new Error("Internal Server Error");
});

export const insertApartment = async (apartment: ApartmentInsertModel) => {
  // console.log("Inserting apartment:" + JSON.stringify(apartment));
  await db.insert(apartmentsTable).values(apartment).execute();
};

export const getApartments = async (offset: number, limit: number) => {
  return await db
    .select()
    .from(apartmentsTable)
    .offset(offset)
    .limit(limit)
    .execute();
};

export const deleteApartments = async () => {
  await db.delete(apartmentsTable);
};

export const getApartmentCount = async () => {
  const apartments = (
    await db
      .select({ totalApartments: sql`COUNT(*)` })
      .from(apartmentsTable)
      .execute()
  )[0];
  return apartments.totalApartments as number;
};

let initializationInProgress = false;

export const initialize = async () => {
  let count = await getApartmentCount();

  if (count < 500 && !initializationInProgress) {
    initializationInProgress = true;
    const apartments = await webScrapper();
    try {
      let success = 0;
      for (let apartment of apartments) {
        await insertApartment(apartment);
        success++;
      }
      console.log(
        "Database has been initialized from scraped data, total: " + success,
      );
    } catch (err) {
      throw new Error("Internal Server Error");
    } finally {
      initializationInProgress = false;
    }
  }
  count = await getApartmentCount();
  if (count > 500) {
    console.log(
      "WARNING: Number of apartments in database is invalid: " + count,
    );
  }
};

export default db;
