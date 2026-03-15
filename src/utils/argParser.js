export function argParser() {
  const args = process.argv.slice(2);
  switch (args[0]) {
    case "cd":
      return args[1];
    default:
      break;
  }
}
