import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { createDecipheriv, scrypt, scryptSync } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

export async function decrypt(args) {
  try {
    if (args.some((v) => !v)) {
      throw new Error();
    }

    const inputPath = path.resolve(state.cwd, args[0]);
    const outputPath = path.resolve(state.cwd, args[1]);

    const input = createReadStream(inputPath);
    const output = createWriteStream(outputPath);

    let headerParsed = false;
    let decipher;
    let tail = Buffer.alloc(0);

    const decryptTransform = new Transform({
      transform(chunk, _enc, cb) {
        let data = Buffer.concat([tail, chunk]);

        if (!headerParsed) {
          const salt = data.subarray(0, 16);
          const iv = data.subarray(16, 28);

          const key = scryptSync(args[2], salt, 32);

          decipher = createDecipheriv("aes-256-gcm", key, iv);
          data = data.subarray(28);
          headerParsed = true;
        }

        if (data.length > 16) {
          this.push(decipher.update(data.subarray(0, data.length - 16)));
          tail = data.subarray(data.length - 16);
        } else {
          tail = data;
        }
        cb();
      },

      flush(cb) {
        decipher.setAuthTag(tail);
        this.push(decipher.final());
        cb();
      },
    });

    await pipeline(input, decryptTransform, output);
  } catch (e) {
    console.log("Operation failed", e.message);
  }
}
