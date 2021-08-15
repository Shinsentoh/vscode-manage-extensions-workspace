import "reflect-metadata";
import * as vscode from "vscode";
import { Container } from "typedi";

import "./issues/resolver";
import { CommandsContribKey } from "./constants";
import * as Constants from "./constants";
import ProfileService from "./services/profileService";
import BundleService from "./services/bundleService";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('vscode-manage-extensions-workspaces has been activated.');
  Container.set(Constants.contextContainerKey, context);
  const bundleService = Container.get(BundleService);
  const profileService = Container.get(ProfileService);

  // Registration commands
  context.subscriptions.push(
    vscode.commands.registerCommand(CommandsContribKey.createBundle, async () => { bundleService.createBundle(); }),
    vscode.commands.registerCommand(CommandsContribKey.selectProfile, async () => { bundleService.selectBundles(); }),
    vscode.commands.registerCommand(CommandsContribKey.editBundle, async () => { bundleService.editBundle(); }),
    vscode.commands.registerCommand(CommandsContribKey.deleteBundle, async () => { bundleService.deleteBundle(); }),
    // vscode.commands.registerCommand(CommandType.disableExtension, DisableExtension),
    // vscode.commands.registerCommand(CommandType.enableExtension, EnableExtension)
  );

  profileService.updateStatusBar();
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('vscode-manage-extensions-workspaces is disabled.');
  Container.reset();
}
