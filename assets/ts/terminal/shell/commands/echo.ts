import { Command, Plugin } from "../plugin";
import { Environment } from "../environment";
import { Shell } from "../shell";

export class EchoCommand implements Command {
  execute(args: string[], env: Environment): string {
    const redirectIndex = args.indexOf(">");
    if (redirectIndex > -1) {
      const fileName = args[redirectIndex + 1];
      if (!fileName) {
        return "echo: missing file name for redirection";
      }
      const content = args.slice(0, redirectIndex).join(" ");
      return this.writeFile(fileName, content, env);
    }
    return args.join(" ");
  }

  private writeFile(
    fileName: string,
    content: string,
    env: Environment
  ): string {
    if (!env.currentDirectory.files[fileName]) {
      env.currentDirectory.files[fileName] = { name: fileName, content: "" };
    }
    env.currentDirectory.files[fileName].content = content;
    return "";
  }
}

export class EchoPlugin implements Plugin {
  register(shell: Shell) {
    shell.registerCommand("echo", new EchoCommand());
  }
}
