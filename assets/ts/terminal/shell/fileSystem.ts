export class SFileSystemItem {
  name: string;
  parent?: SDirectory;
  constructor(name: string, parent?: SDirectory) {
    this.name = name;
    this.parent = parent;
  }
}

export class SFile extends SFileSystemItem {
  content: string;
  constructor(name: string, content: string = "", parent?: SDirectory) {
    super(name, parent);
    this.content = content;
  }
}

export class SDirectory extends SFileSystemItem {
  files: { [key: string]: SFile } = {};
  subdirectories: { [key: string]: SDirectory } = {};
  constructor(name: string, parent?: SDirectory) {
    super(name, parent);
  }

  addFile(file: SFile) {
    this.files[file.name] = file;
  }

  addDirectory(directory: SDirectory) {
    this.subdirectories[directory.name] = directory;
  }
}
