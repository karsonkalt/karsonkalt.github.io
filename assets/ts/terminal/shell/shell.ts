import { parseCommand } from "./parser";
import { Environment, createEnvironment } from "./environment";
import { SDirectory } from "./fileSystem";
import { Command, Plugin } from "./plugin";

export class Shell {
  private env: Environment;
  private commands: { [key: string]: Command };

  constructor() {
    const rootDirectory = new SDirectory("/");
    this.env = createEnvironment(rootDirectory);
    this.commands = {};
  }

  registerCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  loadPlugin(plugin: Plugin) {
    plugin.register(this);
  }

  execute(input: string): string {
    if (input.includes("|")) {
      const commands = input.split("|").map((cmd) => cmd.trim());
      let output = this.execute(commands[0]);
      for (let i = 1; i < commands.length; i++) {
        output = this.execute(`${commands[i]} <<< "${output}"`);
      }
      return output;
    }

    if (input.includes("<<<")) {
      const [cmd, stdin] = input.split("<<<").map((str) => str.trim());
      const { name, args } = parseCommand(cmd);
      args.push(stdin);
      return this.runCommand(name, args);
    }

    const { name, args } = parseCommand(input);
    return this.runCommand(name, args);
  }

  private runCommand(name: string, args: string[]): string {
    const command = this.commands[name];
    if (!command) {
      return `Command not found: ${name}`;
    }
    return command.execute(args, this.env);
  }

  getPrompt(): string {
    let dir = this.env.currentDirectory;
    const path = [];
    while (dir.parent) {
      path.unshift(dir.name);
      dir = dir.parent;
    }
    return `/${path.join("/")}$ `;
  }
}
