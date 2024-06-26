import { SDirectory } from "./fileSystem";

export type Environment = {
  variables: { [key: string]: string };
  currentDirectory: SDirectory;
  rootDirectory: SDirectory;
};

export function createEnvironment(root: SDirectory): Environment {
  return {
    variables: {},
    currentDirectory: root,
    rootDirectory: root,
  };
}
