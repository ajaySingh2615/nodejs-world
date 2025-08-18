import express from "express";
import userRoutes from "./routes/user.routes.js";
import db from "./db/index.js";
import { userSessions, usersTable } from "./db/schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(async function (req, res, next) {
  const sessionId = req.headers["session-id"];
  if (!sessionId) {
    return next();
  }

  const [data] = await db
    .select({
      sessionId: userSessions.id,
      id: usersTable.id,
      userId: userSessions.userId,
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(userSessions)
    .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
    .where((table) => eq(table.sessionId, sessionId));

  if (!data) {
    return next();
  }

  req.user = data;
  next();
});

app.get("/", (req, res) => {
  return res.json({
    message: "Hello World",
  });
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
