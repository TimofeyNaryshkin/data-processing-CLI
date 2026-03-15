import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";

export async function hash(args) {
  const supportedAlgs = ["sha256", "md5", "sha512"];

  try {
    if (!supportedAlgs.includes(args[1]) || !args[0]) {
      throw new Error();
    }

    const filePath = path.resolve(state.cwd, args[0]);
    const input = createReadStream(filePath);
    const hash = createHash(args[1]);

    await pipeline(input, hash);
    const newHash = `${args[1]}: ${hash.digest("hex")}`;
    if (args[2]) {
      const output = createWriteStream(
        path.resolve(state.cwd, `${args[0]}.${args[1]}.txt`),
      );
      await pipeline(newHash, output);
    } else {
      console.log(newHash);
    }
  } catch (e) {
    console.log("Operation failed", e.message);
  }
}
