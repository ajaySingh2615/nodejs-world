import express from "express";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { error, table } from "console";
import { eq } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

const router = express.Router();

router.get("/"); // returns current logged in user
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
router.post("/login");
router.post("/logout");

export default router;
