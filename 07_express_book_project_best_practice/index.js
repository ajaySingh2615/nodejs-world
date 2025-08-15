import express from "express";
import { loggerMiddleware } from "./middlewares/logger.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(loggerMiddleware);

app.use("/books", bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Book API endpoints available at http://localhost:${port}/books`);
});
