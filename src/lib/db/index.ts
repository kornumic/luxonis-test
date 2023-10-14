import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";
import { ApartmentInsertModel, apartmentsTable } from "@/lib/db/schema";
import webScrapper from "@/lib/web-scrapper";
import { sql } from "drizzle-orm";

let db: NodePgDatabase | undefined = undefined;
let initializationInProgress = false;

export const getDb = async () => {
  if (db) {
    return db;
  }
  const client = new Client(process.env.DATABASE_URL!);
  try {
    await client.connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
  db = drizzle(client);
  await migrate(db, {
    migrationsFolder: "./src/lib/db/migrations",
  }).catch((error) => {
    console.log(`Error migrating database: ${error}`);
    throw new Error("Internal Server Error");
  });
  return db;
};

export const insertApartment = async (apartment: ApartmentInsertModel) => {
  // console.log("Inserting apartment:" + JSON.stringify(apartment));
  const db = await getDb();
  await db.insert(apartmentsTable).values(apartment).execute();
};

export const getApartments = async (offset: number, limit: number) => {
  const db = await getDb();
  return await db
    .select()
    .from(apartmentsTable)
    .offset(offset)
    .limit(limit)
    .execute();
};

export const deleteApartments = async () => {
  if (initializationInProgress) {
    return;
  }
  const db = await getDb();
  await db.delete(apartmentsTable);
};

export const getApartmentCount = async () => {
  const db = await getDb();
  const apartments = (
    await db
      .select({ totalApartments: sql`COUNT(*)` })
      .from(apartmentsTable)
      .execute()
  )[0];
  return apartments.totalApartments as number;
};

export const initialize = async () => {
  let count = await getApartmentCount();

  if (count < 500 && !initializationInProgress) {
    console.log("Initializing database.");
    initializationInProgress = true;
    const apartments = await webScrapper();
    try {
      let success = 0;
      console.log("Saving apartments to database...");
      for (let apartment of apartments) {
        await insertApartment(apartment);
        success++;
      }
      console.log(
        "Database has been initialized from scraped data, total: " + success,
      );
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error");
    } finally {
      initializationInProgress = false;
      count = await getApartmentCount();
    }
  }
  if (count > 500) {
    console.log(
      "WARNING: Number of apartments in database is invalid: " + count,
    );
  }
};
