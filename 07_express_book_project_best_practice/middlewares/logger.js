import fs from "node:fs";

export function loggerMiddleware(req, res, next) {
  const log = `[${Date.now()}] ${req.method} ${req.path}`;
  fs.appendFileSync("logs.txt", log + "\n", "utf-8");
  next();
}
