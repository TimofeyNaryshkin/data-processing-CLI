import { parentPort, workerData } from "node:worker_threads";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const { filePath, start, end } = workerData;

const stream = createReadStream(filePath, { start, end: end - 1, encoding: "utf-8" });
const rl = createInterface({ input: stream });

const stats = { total: 0, levels: {}, status: {}, paths: {}, responseTimeSum: 0 };

rl.on("line", (line) => {
  if (!line) return;
  const parts = line.split(" ");
  if (parts.length < 7) return;

  const [, level, , statusCode, responseTime, , reqPath] = parts;

  stats.total++;
  stats.levels[level] = (stats.levels[level] || 0) + 1;

  const statusClass = `${statusCode[0]}xx`;
  stats.status[statusClass] = (stats.status[statusClass] || 0) + 1;

  stats.paths[reqPath] = (stats.paths[reqPath] || 0) + 1;
  stats.responseTimeSum += Number(responseTime);
});

rl.on("close", () => {
  parentPort.postMessage(stats);
});
