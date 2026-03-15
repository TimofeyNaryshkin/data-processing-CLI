import path from "node:path";
import { state } from "./state.js";
import fs from "node:fs/promises";

export function up() {
  state.cwd = path.dirname(state.cwd);
}

export function cd(target) {
  if (!target) {
    console.log("Invalid input");
    return;
  }
  state.cwd = path.resolve(state.cwd, target);
}

export async function ls() {
  try {
    const data = await fs.readdir(state.cwd, { withFileTypes: true });
    const mapedData = [];
    for (const f of data) {
      const stats = await fs.stat(path.join(state.cwd, f.name));
      mapedData.push({
        name: f.name,
        type: stats.isFile() ? "file" : "folder",
      });
    }
    const folders = mapedData.filter((f) => f.type === "folder");
    const files = mapedData.filter((f) => f.type === "file");

    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    const sortedData = [...folders, ...files].map((f) => [f.name, f.type]);
    console.table(sortedData);
  } catch {
    console.log("Operation failed");
  }
}
