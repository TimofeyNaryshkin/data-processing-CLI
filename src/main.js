import readline from "node:readline";
import os from "node:os";
import { state } from "./state";

const interactive = () => {
  const rl = readline.createInterface({ input, output });
  state.cwd = os.homedir()
  console.log("Welcome to Data Processing CLI!");
  console.log(`You are currently in ${state.cwd}`);
  rl.prompt();

  rl.on("line", (line) => {
    switch (line) {
      case "up":
        
        break;
      case "cd":
        
        break;
      case "ls":
        
        break;
      case "csv-to-json":
        
        break;
      case "json-to-csv":
        
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
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\nThank you for using Data Processing CLI!");
    process.exit();
  });
};

interactive();
