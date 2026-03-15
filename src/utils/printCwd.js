import { state } from "../state.js";

export function printCwd() {
  console.log(`You are currently in ${state.cwd}`);
}
