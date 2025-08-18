import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(async function (req, res, next) {
  try {
    const tokenHeader = req.headers["authorization"];

    // Header Authorization: Bearer <token>

    if (!tokenHeader) {
      return next();
    }

    if (!tokenHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ error: "unauthorization must start with Bearer" });
    }

    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
});

app.get("/test", (req, res) => {
  return res.json({
    message: "Hello World",
  });
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
