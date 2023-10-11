import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";
import { ApartmentInsertModel, apartmentsTable } from "@/lib/db/schema";
import webScrapper from "@/lib/web-scrapper";

const client = new Client(process.env.DB_URL!);

try {
  await client.connect();
  console.log("Connected to database");
} catch (e) {
  console.log(e);
}

const db = drizzle(client);
await migrate(db, { migrationsFolder: ".drizzle" });

export const insertApartment = async (apartment: ApartmentInsertModel) => {
  console.log("Inserting apartment:" + JSON.stringify(apartment));
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

/**
 * Returns the number of apartments in the database
 * Needs to be optimized, currently it loads all apartments into memory
 */
export const getApartmentCount = async () => {
  //TODO - find better way to get count
  const apartments = await db.select().from(apartmentsTable).execute();
  return apartments.length;
};

export const initialize = async () => {
  const count = await getApartmentCount();

  if (count < 500) {
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
      console.log("Error inserting apartment:" + err);
    }
  }
  if (count > 500) {
    console.log("Number of apartments in database is invalid: " + count);
  }
};

export default db;
