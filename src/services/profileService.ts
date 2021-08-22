import * as vscode from "vscode";
import { Service } from "typedi";

import * as Constants from "../constants";
import { ActionStatusBar, Profile, ProfileList, Scope } from "../types";
import ContextService from "./contextService";
import StorageService from "./storageService";
import SettingService from "./settingService";

@Service()
class ProfileService implements vscode.Disposable {
  private _statusBarItem: vscode.StatusBarItem;

  constructor(
    private _ctxService: ContextService,
    private _storageService: StorageService,
    private _settingService: SettingService
  ) {
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    this.setStatusBarCommand(this._settingService.actionStatusBar);
    this._ctxService.context.subscriptions.push(
      this._statusBarItem,
      this._settingService.onDidChangeStatusBarCommand(val => this.setStatusBarCommand(val))
    );
  }

  public async updateStatusBar(): Promise<void> {
    const bundles = await this.getCurrentProfileBundles() ?? [];
    let profileLabel = 'none';
    let profileTooltip = profileLabel;

    if (bundles.length > 1) {
      profileLabel = `${bundles.length} bundles`;
      profileTooltip = bundles.join('\'\n- \'');
    }
    else if (bundles.length === 1) {
      profileTooltip = profileLabel = bundles[0];
      profileLabel = profileLabel.length > 10 ? "1 bundle" : profileLabel;
    }

    this._statusBarItem.text = `$(extensions) ${profileLabel}`;
    this._statusBarItem.tooltip = `using bundles:\n- '${profileTooltip}'`;
    this._statusBarItem.show();
  }

  private setStatusBarCommand(action: string) {
    switch (action) {
      case ActionStatusBar.select:
        this._statusBarItem.command = Constants.CommandsContribKey.selectProfile;
        break;
      case ActionStatusBar.commands:
      default:
        // for people not using shortcuts
        this._statusBarItem.command = {
          command: "workbench.action.quickOpen",
          arguments: [ `>${Constants.appName}:` ]
        } as vscode.Command;
        break;
    }
  }

  public async setCurrentProfile(bundleNames: string[] | undefined) {
    if (bundleNames) {
      const profileKey = this.profileKey;
      if (profileKey) {
        await this.upsertProfile(profileKey, bundleNames);
        await this.updateStatusBar();
      }
    }
  }

  public async getCurrentProfileBundles(): Promise<string[] | undefined> {
    const profile = await this.getCurrentProfile();
    return profile?.bundleNames;
  }

  private async upsertProfile(profileKey: string, bundleNames: string[]) {
    const profiles = await this.getProfiles() ?? {};
    const now = new Date();
    // set synced to false, we are adding or updating this profile.
    const newProfile: Profile = { lastChanges: now, bundleNames: bundleNames };
    profiles[profileKey] = newProfile;
    await this.saveProfiles(profiles);
    await this._storageService.store<Date>(Constants.lastProfileSyncedDateKey, now, Scope.workspace);
  }

  public async saveProfiles(profiles: ProfileList | undefined) {
    await this._storageService.store(Constants.appProfilesKey, profiles ?? {});
  }

  public async getProfiles(): Promise<ProfileList> {
    return await this._storageService.getState<ProfileList>(Constants.appProfilesKey) ?? {};
  }

  public async getCurrentProfile(): Promise<Profile | undefined> {
    const profileKey = this.profileKey;
    if (profileKey) {
      const profiles = await this.getProfiles() ?? {};
      return profiles[profileKey];
    }
  }

  public get profileKey(): string | undefined {
    return vscode.workspace.name;
  }

  destroy = () => this.dispose(); // typeDI compatibility instead of dispose()

  dispose() {
    console.log("dispose profileService");
    this._statusBarItem.dispose();
    this._ctxService.dispose();
    this._storageService.dispose();
    this._settingService.dispose();
  }
}

export default ProfileService;
