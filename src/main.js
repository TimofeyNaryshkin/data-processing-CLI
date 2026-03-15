import readline from "node:readline";
import os from "node:os";
import { state } from "./state.js";
import { printCwd } from "./utils/printCwd.js";
import { cd, ls, up } from "./navigation.js";
import { argParser } from "./utils/argParser.js";
import { csvToJson } from "./commands/csvToJson.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  state.cwd = os.homedir();
  console.log("Welcome to Data Processing CLI!");
  printCwd();
  rl.prompt();

  rl.on("line", async (line) => {
    const [cmd, parsedArgs] = argParser(line);
    switch (cmd) {
      case "up":
        up();
        break;
      case "cd":
        cd(parsedArgs);
        break;
      case "ls":
        await ls();
        break;
      case "csv-to-json":
        await csvToJson(parsedArgs)
        break;
      case "json-to-csv":
        await jsonToCsv(parsedArgs)
        break;
      case "count":
        break;
      case "hash":
        break;
      case "hash-compare":
        break;
      case "encrypt":
        break;
      case "decrypt":
        break;
      case "log-stats":
        break;
      case "exit":
        rl.close();
        return;
      default:
        console.log("Invalid input");
        break;
    }
    printCwd();
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\nThank you for using Data Processing CLI!");
    process.exit();
  });
};

interactive();
