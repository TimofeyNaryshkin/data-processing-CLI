export function argParser(line) {
  const [cmd, ...args] = line.trim().split(" ");
  let parsedArgs;
  let inputIndex
  let outputIndex
  switch (cmd) {
    case "cd":
      parsedArgs = args[0];
      break;
    case "csv-to-json":
      inputIndex = args.indexOf("--input");
      outputIndex = args.indexOf("--output");
      parsedArgs = [args[inputIndex + 1], args[outputIndex + 1]];
      break;
    case "json-to-csv":
      inputIndex = args.indexOf("--input");
      outputIndex = args.indexOf("--output");
      parsedArgs = [args[inputIndex + 1], args[outputIndex + 1]];
      break;
    default:
      break;
  }

  return [cmd, parsedArgs];
}
