import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function csvToJson(paths) {
  const inputPath = path.resolve(state.cwd, paths[0]);
  const outputPath = path.resolve(state.cwd, paths[1]);

  try {
    if (
      path.extname(inputPath) !== ".csv" ||
      path.extname(outputPath) !== ".json"
    ) {
      throw new Error();
    }

    let buffer = "";
    const keys = [];
    const result = [];
    const input = createReadStream(inputPath);
    const output = createWriteStream(outputPath);

    const csvToJsonTransform = new Transform({
      transform(chunk, enc, cb) {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        lines.forEach((l, i) => {
          if (i === 0) {
            l.split(",").forEach((el) => keys.push(el));
          } else {
            const jsonLine = {};
            l.split(",").forEach((el, j) => (jsonLine[keys[j]] = el));
            result.push(jsonLine);
          }
        });
        cb();
      },
      flush(cb) {
        const formatted = result
          .map((item) => "  " + JSON.stringify(item))
          .join(",\n");
        this.push("[\n" + formatted + "\n]");
        cb();
      },
    });

    await pipeline(input, csvToJsonTransform, output);
  } catch (e) {
    console.log("Operation failed");
  }
}
