import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { apartments } from "@/app/api/apartments/route";

export const apartmentSchema = pgSchema("apartment_schema");
export const apartmentsTable = apartmentSchema.table("apartments", {
  id: serial("id").primaryKey(),
  title: text("title"),
  address: text("address"),
  price: text("price"),
  src: text("src"),
});

export type Apartment = InferSelectModel<typeof apartmentsTable>;
export type NewApartment = InferInsertModel<typeof apartmentsTable>;

export const getInitStatus = async () => {
  return apartments.length !== 500 ? "initializing" : "ready";
};
