import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

const DIARY = {};
const EMAILS = new Set();

// Hey, Here is my car - Please park it and give me back a token
// email -> Unique car Number
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (EMAILS.has(email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // create a token for the user
  const token = `${Date.now()}`;
  // Do a entry in the diary
  DIARY[token] = { name, email, password };

  return res.status(201).json({
    message: "User created successfully",
    token,
  });
});

app.post("/me", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  if (!(token in DIARY)) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const entry = DIARY[token];
  return res.json({
    message: "User details",
    name: entry.name,
    email: entry.email,
  });
});

app.post("/private-data", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const entry = DIARY[token];
  return res.json({
    message: "Private data accessed successfully",
    name: entry.name,
    email: entry.email,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
