CREATE SCHEMA "apartment_schema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartment_schema"."apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"address" text NOT NULL,
	"price" text NOT NULL,
	"src" text NOT NULL
);
