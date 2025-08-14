import fs from "node:fs";

const content = fs.readFileSync("notes.txt", "utf-8");
console.log(content);

// fs.writeFileSync("copy.txt", "This is my new file", "utf-8");
fs.appendFileSync("copy.txt", "This is my new file2", "utf-8");

fs.mkdirSync("games/xyz/a", { recursive: true });
fs.rmdirSync("games/xyz");
