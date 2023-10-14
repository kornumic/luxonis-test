import { serial, text, pgSchema } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const apartmentSchema = pgSchema("apartment_schema");
export const apartmentsTable = apartmentSchema.table("apartments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  price: text("price").notNull(),
  src: text("src").notNull(),
});

export type ApartmentSelectModel = InferSelectModel<typeof apartmentsTable>;
export type ApartmentInsertModel = InferInsertModel<typeof apartmentsTable>;
