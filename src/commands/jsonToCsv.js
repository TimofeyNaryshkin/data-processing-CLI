import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function jsonToCsv(paths) {
  const inputPath = path.resolve(state.cwd, paths[0]);
  const outputPath = path.resolve(state.cwd, paths[1]);

  try {
    if (
      path.extname(inputPath) !== ".json" ||
      path.extname(outputPath) !== ".csv"
    ) {
      throw new Error();
    }

    let buffer = "";
    let result = "";
    const input = createReadStream(inputPath);
    const output = createWriteStream(outputPath);

    const jsonToCsvTransform = new Transform({
      transform(chunk, enc, cb) {
        buffer += chunk.toString();
        cb();
      },
      flush(cb) {
        const data = JSON.parse(buffer);
        result += Object.keys(data[0]).join(",") + "\n";
        for (const line of data) {
          result += Object.values(line).join(",") + "\n";
        }
        this.push(result);
        cb();
      },
    });

    await pipeline(input, jsonToCsvTransform, output);
  } catch (e) {
    console.log("Operation failed");
  }
}
