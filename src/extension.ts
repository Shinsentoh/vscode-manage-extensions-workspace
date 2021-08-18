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

  registerCommands(context);
  registerKeysToSync(context);

  initialize();
}

function registerCommands(context: vscode.ExtensionContext) {
  const bundleService = Container.get(BundleService);

  // Registration commands
  context.subscriptions.push(
    vscode.commands.registerCommand(CommandsContribKey.createBundle, async () => { bundleService.createBundle(); }),
    vscode.commands.registerCommand(CommandsContribKey.selectProfile, async () => { bundleService.selectBundles(); }),
    vscode.commands.registerCommand(CommandsContribKey.editBundle, async () => { bundleService.editBundle(); }),
    vscode.commands.registerCommand(CommandsContribKey.deleteBundle, async () => { bundleService.deleteBundle(); }),
    // vscode.commands.registerCommand(CommandType.disableExtension, DisableExtension),
    // vscode.commands.registerCommand(CommandType.enableExtension, EnableExtension)
  );
}

function registerKeysToSync(context: vscode.ExtensionContext) {
  context.globalState.setKeysForSync([Constants.appInstalledExtensionsKey, Constants.appBundlesKey]);
}

function initialize() {
  const profileService = Container.get(ProfileService);
  profileService.updateStatusBar();
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('vscode-manage-extensions-workspaces is desactivated.');
  Container.reset();
}
