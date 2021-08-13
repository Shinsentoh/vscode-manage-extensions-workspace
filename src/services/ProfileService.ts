import * as vscode from "vscode";
import { Disposable } from "vscode";
import { Service } from "typedi";

import * as Constants from "../constants";
import { CommandType, Scope } from "../types";
import ContextService from "./contextService";
import StorageService from "./storageService";

@Service()
class ProfileService implements Disposable {
  private _statusBarItem: vscode.StatusBarItem;

  constructor(
    private _ctxService: ContextService,
    private _storageService: StorageService
  ) {
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    this._statusBarItem.command = CommandType.selectProfile;
    this._ctxService.context.subscriptions.push(this._statusBarItem);
  }

  dispose() {
  }

  public async updateStatusBar(): Promise<void> {
    if (this._ctxService.context) {
      const bundles = await this.getCurrentProfileBundles() ?? [];
      let profileLabel = 'none';
      let profileTooltip = profileLabel;

      if (bundles.length > 1) {
        profileLabel = `${bundles.length} bundles`;
        profileTooltip = bundles.join('\' | \'');
      }
      else if (bundles.length === 1) {
        profileTooltip = profileLabel = bundles[0];
      }

      this._statusBarItem.text = `$(extensions) ${profileLabel}`;
      this._statusBarItem.tooltip = `using bundles: '${profileTooltip}'`;
      this._statusBarItem.show();
    }
  }

  public async setCurrentProfile(bundleNames: string[] | undefined): Promise<void> {
    if (this._ctxService.context && bundleNames) {
      await this._storageService.store(Constants.currentProfileKey, bundleNames, Scope.workspace);
      await this.updateStatusBar();
    }
  }

  public async getCurrentProfileBundles(): Promise<string[] | undefined> {
    return this._storageService.getState<string[]>(Constants.currentProfileKey, Scope.workspace);
  }
}

export default ProfileService;