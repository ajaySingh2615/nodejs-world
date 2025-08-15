import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: integer().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export { usersTable };
