import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { createCipheriv, randomBytes, scrypt } from "node:crypto";
import { pipeline } from "node:stream/promises";

export async function encrypt(args) {
  try {
    if (args.some((v) => !v)) {
      throw new Error();
    }

    const inputPath = path.resolve(state.cwd, args[0]);
    const outputPath = path.resolve(state.cwd, args[1]);

    const input = createReadStream(inputPath);
    const output = createWriteStream(outputPath);

    const salt = randomBytes(16);
    const iv = randomBytes(12);

    scrypt(args[2], salt, 32, async (error, derivedKey) => {
      if (error) {
        throw error;
      }
      const cipher = createCipheriv("aes-256-gcm", derivedKey, iv);

      output.write(salt);
      output.write(iv);
      await pipeline(input, cipher, output, { end: false });
      const authTag = cipher.getAuthTag();
      output.end(authTag);
    });
  } catch {
    console.log("Operation failed");
  }
}
