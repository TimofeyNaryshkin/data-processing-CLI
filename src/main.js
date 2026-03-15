import readline from "node:readline";
import os from "node:os";
import { state } from "./state.js";
import { printCwd } from "./utils/printCwd.js";
import { handleLine } from "./repl.js";

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  state.cwd = os.homedir();
  console.log("Welcome to Data Processing CLI!");
  printCwd();
  rl.prompt();

  rl.on("line", (line) => handleLine(line, rl));

  rl.on("close", () => {
    console.log("\nThank you for using Data Processing CLI!");
    process.exit();
  });
};

interactive();
