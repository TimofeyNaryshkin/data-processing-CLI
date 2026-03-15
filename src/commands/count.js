import path from "node:path";
import { state } from "../state.js";
import { createReadStream } from "node:fs";
import { error } from "node:console";

export function count(target) {
  const filePath = path.resolve(state.cwd, target);
  let buffer = "";

  try {
    if (!target) {
      throw new error();
    }
    const input = createReadStream(filePath);

    input.on("data", (chunk) => {
      buffer += chunk;
    });

    input.on("end", () => {
      const lines = buffer.split("\n");
      const words = buffer.split(" ");
      const chars = buffer.split("");
      console.log(`\nLines: ${lines.length}`);
      console.log(`Words: ${words.length}`);
      console.log(`Characters: ${chars.length}`);
    });
  } catch {
    console.log("Operation failed");
  }
}
