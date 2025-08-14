import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.end("home page");
});

app.get("/contact-us", (req, res) => {
  res.end("You can contact me at my email address");
});

app.post("/tweets", (req, res) => {
  res.status(201).end("Tweet created successfully");
});

app.get("/tweets", (req, res) => {
  res.end("Tweets page");
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
