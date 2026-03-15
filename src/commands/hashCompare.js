import path from "node:path";
import { state } from "../state.js";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export async function hashCompare(args) {
  const supportedAlgs = ["sha256", "md5", "sha512"];

  try {
    if (!supportedAlgs.includes(args[2]) || !args[0] || !args[1]) {
      throw new Error();
    }

    const filePath = path.resolve(state.cwd, args[0]);
    const hashPath = path.resolve(state.cwd, args[1]);
    const input = createReadStream(filePath);
    const comparedHash = await readFile(hashPath, 'utf-8');
    const hash = createHash(args[2]);

    await pipeline(input, hash);
    const newHash = hash.digest("hex");
    const formatedComparedHash = comparedHash.toLowerCase().split(" ")[1];
    const result =
      newHash.toLowerCase() === formatedComparedHash ? "OK" : "MISMATCH";
    console.log(result);
  } catch {
    console.log("Operation failed");
  }
}
