import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { authorsTable } from "./author.models.js";

const booksTable = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  authorId: uuid()
    .references(() => authorsTable.id)
    .notNull(),
});

export { booksTable };
