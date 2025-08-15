import dotenv from "dotenv/config";
import db from "./db/index.js";
import { usersTable } from "./drizzle/schema.js";

async function getAllUsers() {
  const users = await db.select().from(usersTable);
  console.log(`users in DB`, users);
  return users;
}

async function createUsers({ id, name, email }) {
  await db.insert(usersTable).values({ id, name, email });
}

getAllUsers();
// createUsers({ id: 1, name: "mike", email: "mike@gmail.com" });
// createUsers({ id: 2, name: "mii", email: "mii@gmail.com" });
