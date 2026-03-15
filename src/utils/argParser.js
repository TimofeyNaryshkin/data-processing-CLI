export function argParser(line) {
  const [cmd, ...args] = line.trim().split(" ");
  let parsedArgs;
  switch (cmd) {
    case "cd":
      parsedArgs = args[0];
      break;
    case "csv-to-json":
      const inputIndex = args.indexOf("--input");
      const outputIndex = args.indexOf("--output");
      parsedArgs = [args[inputIndex + 1], args[outputIndex + 1]];
      break;
    default:
      break;
  }

  return [cmd, parsedArgs];
}
