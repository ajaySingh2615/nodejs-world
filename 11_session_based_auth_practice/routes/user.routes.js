import express from "express";
import db from "../db/index.js";
import { userSessions, usersTable } from "../db/schema.js";
import { error, table } from "console";
import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

const router = express.Router();

router.get("/", async (req, res) => {
  const sessionId = req.headers["session-id"];
  if (!sessionId) {
    return res.status(401).json({ error: "you are not logged in" });
  }

  const [data] = await db
    .select({
      id: userSessions.id,
      userId: userSessions.userId,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(userSessions)
    .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
    .where((table) => eq(table.id, sessionId));

  if (!data) {
    return res.status(401).json({ error: "you are not logged in" });
  }

  return res.status(200).json({ data });
}); // returns current logged in user

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (existingUser) {
    return res
      .status(400)
      .json({ error: `users with email ${email} already exists` });
  }

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHash("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password: hashedPassword, salt })
    .returning({ id: usersTable.id });

  return res.status(201).json({ userId: user.id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!existingUser) {
    return res
      .status(404)
      .json({ error: `user with email ${email} not found` });
  }

  const salt = existingUser.salt;
  const existingHashedPassword = existingUser.password;

  const newHash = createHash("sha256", salt).update(password).digest("hex");

  if (newHash !== existingHashedPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // create a session
  const [session] = await db
    .insert(userSessions)
    .values({
      userId: existingUser.id,
    })
    .returning({ id: userSessions.id });

  return res.status(200).json({ status: "success", sessionId: session.id });
});
router.post("/logout");

export default router;
