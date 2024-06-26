import { Environment } from "./environment";
import { Shell } from "./shell";

export interface Command {
  execute(args: string[], env: Environment): string;
}

export interface Plugin {
  register(shell: Shell): void;
}
