export function argParser(line) {
  const [cmd, ...args] = line.trim().split(" ");
  let parsedArgs;
  let inputIndex;
  let outputIndex;
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
    case "count":
      inputIndex = args.indexOf("--input");
      parsedArgs = args[inputIndex + 1];
      break;
    case "hash": {
      inputIndex = args.indexOf("--input");
      const algIndex = args.indexOf("--algorithm");
      const saveIndex = args.indexOf("--save");
      const filePath = inputIndex === -1 ? undefined : args[inputIndex + 1];
      const alg = algIndex === -1 ? "sha256" : args[algIndex + 1];
      const save = saveIndex === -1 ? false : true;
      parsedArgs = [filePath, alg, save];
      break;
    }
    case "hash-compare": {
      inputIndex = args.indexOf("--input");
      const hashIndex = args.indexOf("--hash");
      const algIndex = args.indexOf("--algorithm");
      const filePath = inputIndex === -1 ? undefined : args[inputIndex + 1];
      const hashPath = hashIndex === -1 ? undefined : args[hashIndex + 1];
      const alg = algIndex === -1 ? "sha256" : args[algIndex + 1];
      parsedArgs = [filePath, hashPath, alg];
      break;
    }
    case "encrypt": {
      inputIndex = args.indexOf("--input");
      outputIndex = args.indexOf("--output");
      const passIndex = args.indexOf("--password");
      const filePath = inputIndex === -1 ? undefined : args[inputIndex + 1];
      const outputPath = outputIndex === -1 ? undefined : args[outputIndex + 1];
      const password = passIndex === -1 ? undefined : args[passIndex + 1];
      parsedArgs = [filePath, outputPath, password];
      break;
    }
    case "decrypt": {
      inputIndex = args.indexOf("--input");
      outputIndex = args.indexOf("--output");
      const passIndex = args.indexOf("--password");
      const filePath = inputIndex === -1 ? undefined : args[inputIndex + 1];
      const outputPath = outputIndex === -1 ? undefined : args[outputIndex + 1];
      const password = passIndex === -1 ? undefined : args[passIndex + 1];
      parsedArgs = [filePath, outputPath, password];
      break;
    }
    case "log-stats": {
      inputIndex = args.indexOf("--input");
      outputIndex = args.indexOf("--output");
      const filePath = inputIndex === -1 ? undefined : args[inputIndex + 1];
      const outputPath = outputIndex === -1 ? undefined : args[outputIndex + 1];
      parsedArgs = [filePath, outputPath];
      break;
    }
    default:
      break;
  }

  return [cmd, parsedArgs];
}
