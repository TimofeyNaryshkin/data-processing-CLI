import readline from "node:readline";
import os from "node:os";
import { state } from "./state.js";
import { printCwd } from "./utils/printCwd.js";
import { cd, ls, up } from "./navigation.js";
import { argParser } from "./utils/argParser.js";
import { csvToJson } from "./commands/csvToJson.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";
import { count } from "./commands/count.js";
import { hash } from "./commands/hash.js";
import { hashCompare } from "./commands/hashCompare.js";
import { encrypt } from "./commands/encrypt.js";
import { decrypt } from "./commands/decrypt.js";

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
        await csvToJson(parsedArgs);
        break;
      case "json-to-csv":
        await jsonToCsv(parsedArgs);
        break;
      case "count":
        count(parsedArgs);
        break;
      case "hash":
        await hash(parsedArgs);
        break;
      case "hash-compare":
        await hashCompare(parsedArgs);
        break;
      case "encrypt":
        await encrypt(parsedArgs);
        break;
      case "decrypt":
        await decrypt(parsedArgs);
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
