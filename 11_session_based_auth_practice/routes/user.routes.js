import "dotenv/config";
import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";

const router = express.Router();

router.patch("/", async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "you are not logged in" });
  }

  const { name } = req.body;

  await db.update(usersTable).set({ name }).where(eq(usersTable.id, user.id));

  return res.status(200).json({ status: "success" });
});

router.get("/", async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "you are not logged in" });
  }
  return res.status(200).json({ user });
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

  const payload = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  console.log(process.env.JWT_SECRET);

  return res.status(200).json({ status: "success", token });
});
router.post("/logout");

export default router;
