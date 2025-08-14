import fs from "node:fs";

// Task: Read the content of notes.txt file

console.log("Start of the script");

// [Sync] => Blocking Operations
// const content = fs.readFileSync("notes.txt", "utf-8");
// console.log("Content of the file is: ", content);

// [Async] => Non-Blocking Operations
fs.readFile("notes.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("Error reading the file");
  } else {
    console.log("Content of the file is: ", data);
  }
});

console.log("End of the script");
