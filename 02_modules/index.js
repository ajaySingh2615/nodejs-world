// Modules

// 1. Build in modules
// 2. Third party modules (External Modules) - npm install
// 3. Custom (my own modules)

// File system module
import fs from "fs";
console.log(fs);

const content = fs.readFileSync("notes.txt", "utf-8");
console.log(content);
