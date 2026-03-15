import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Worker } from "node:worker_threads";
import { state } from "../state.js";

export async function logStats(args) {
  try {
    if (args.some((v) => !v)) {
      throw new Error();
    }

    const filePath = path.resolve(state.cwd, args[0]);
    const outputPath = path.resolve(state.cwd, args[1]);
    const workerPath = path.resolve(import.meta.dirname, "../workers/logWorker.js");

    const { size } = await fs.stat(filePath);
    const cores = os.cpus().length;
    const chunkSize = Math.ceil(size / cores);

    const fd = await fs.open(filePath);
    const boundaries = [0];

    for (let i = 1; i < cores; i++) {
      const pos = i * chunkSize;
      if (pos >= size) break;
      const buf = Buffer.alloc(256);
      await fd.read(buf, 0, 256, pos);
      const nlIdx = buf.indexOf(10);
      if (nlIdx !== -1) {
        boundaries.push(pos + nlIdx + 1);
      }
    }
    boundaries.push(size);
    await fd.close();

    const results = await Promise.all(
      boundaries.slice(0, -1).map((start, i) => {
        const end = boundaries[i + 1];
        return new Promise((resolve, reject) => {
          const worker = new Worker(workerPath, {
            workerData: { filePath, start, end },
          });
          worker.on("message", resolve);
          worker.once("error", reject);
        });
      })
    );

    const merged = { total: 0, levels: {}, status: {}, paths: {}, responseTimeSum: 0 };

    for (const partial of results) {
      merged.total += partial.total;
      merged.responseTimeSum += partial.responseTimeSum;

      for (const [key, val] of Object.entries(partial.levels)) {
        merged.levels[key] = (merged.levels[key] || 0) + val;
      }
      for (const [key, val] of Object.entries(partial.status)) {
        merged.status[key] = (merged.status[key] || 0) + val;
      }
      for (const [key, val] of Object.entries(partial.paths)) {
        merged.paths[key] = (merged.paths[key] || 0) + val;
      }
    }

    const topPaths = Object.entries(merged.paths)
      .map(([p, count]) => ({ path: p, count }))
      .sort((a, b) => b.count - a.count);

    const output = {
      total: merged.total,
      levels: merged.levels,
      status: merged.status,
      topPaths,
      avgResponseTimeMs: Math.round((merged.responseTimeSum / merged.total) * 100) / 100,
    };

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
  } catch (e) {
    console.log("Operation failed");
  }
}
