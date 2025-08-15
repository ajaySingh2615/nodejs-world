import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const authorsTable = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
});

export { authorsTable };
