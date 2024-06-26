export type Command = { name: string; args: string[] };

export function parseCommand(input: string): Command {
  const tokens = input.trim().split(/\s+/);
  const name = tokens.shift() || "";
  return { name, args: tokens };
}
