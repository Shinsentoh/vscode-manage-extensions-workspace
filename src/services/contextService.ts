﻿import { Disposable, ExtensionContext } from "vscode";
import { Container, Service } from "typedi";
import * as Constants from "../constants";

@Service()
class ContextService implements Disposable {
  constructor(public context: ExtensionContext) {
    this.context = Container.get(Constants.contextContainerKey);
    Container.remove(Constants.contextContainerKey);
  }

  public extensionDirectoryName(): string {
    const name = this.context.extension.packageJSON.name;
    const version = this.context.extension.packageJSON.version;
    const publisher = this.context.extension.packageJSON.publisher;
    return `${publisher}.${name}-${version}`.toLowerCase();
  }

  destroy = () => this.dispose(); // typeDI compatibility instead of dispose()

  dispose() {
    console.log("dispose contextService");
    return;
  }
}

export default ContextService;