import { pgTable, uuid, varchar, text, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authorsTable } from "./author.models.js";

const booksTable = pgTable(
  "books",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    authorId: uuid()
      .references(() => authorsTable.id)
      .notNull(),
  },
  (table) => ({
    searchIndexOnTitle: index("title_index").using(
      "gin",
      sql`to_tsvector('english', ${table.title})`
    ),
  })
);

export { booksTable };
