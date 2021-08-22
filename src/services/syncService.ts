import { Service } from "typedi";
import * as vscode from "vscode";

import * as Constants from "../constants";
import { Profile, Extension, Bundle, Scope } from "../types";

import ContextService from "./contextService";
import SettingService from "./settingService";
import ProfileService from "./profileService";
import BundleService from "./bundleService";
import ExtensionService from "./extensionService";
import StorageService from "./storageService";

@Service()
class SyncService implements vscode.Disposable {
  private _syncIntervalId: NodeJS.Timer | undefined;
  private readonly defaultSyncedKey = [Constants.appInstalledExtensionsKey, Constants.appBundlesKey];
  private readonly allSyncKey = [...this.defaultSyncedKey, Constants.appProfilesKey];

  constructor(
    private _ctxService: ContextService,
    private _settingService: SettingService,
    private _profileService: ProfileService,
    private _bundleService: BundleService,
    private _extensionService: ExtensionService,
    private _storageService: StorageService,
  ) {
    this._ctxService.context.subscriptions.push(
      this._settingService.onDidChangeSyncProfile(state => this.setSyncState(state), this)
    );
  }

  initialize() {
    this.setSyncState(this._settingService.syncWorkspaceProfile);
  }

  setSyncState(sync: boolean) {
    if(sync) {
      this.registerKeysToSync(true);
      if (!this._syncIntervalId) {
        this._syncIntervalId = setInterval(() => this.processDesynced(), 60000);
      }
    }
    else {
      this.registerKeysToSync();
      if (this._syncIntervalId) {
        clearInterval(this._syncIntervalId);
      }
    }
  }

  public async processDesynced() {
      // checking if bundles need to be overwritten for this workspace due to sync.
      const profile = await this._profileService.getCurrentProfile();
      if (await this.checkBundlesDesynced(profile)) {
        await this.resolveDesyncedBundles(profile);
      }
  }

  private async checkBundlesDesynced(profile: Profile | undefined): Promise<boolean> {
    if (!profile || !this._settingService.syncWorkspaceProfile) {
      return false;
    }

    const lastSyncedDate = await this._storageService.getState<Date>(Constants.lastProfileSyncedDateKey, Scope.workspace);
    // if lastSyncedDate is null or older than last changes
    return !lastSyncedDate || lastSyncedDate < profile.lastChanges;
  }

  private async resolveDesyncedBundles(profile: Profile | undefined) {
    if (!profile || !this._settingService.syncWorkspaceProfile) {
      return;
    }

    const bundles: Bundle[] = await this._bundleService.getBundles(i => profile.bundleNames.includes(i.name)) ?? [];
    const bundleIds = this._bundleService.getBundlesIds(bundles);
    const enabledExtensions: Extension[] = await this._extensionService.getEnabledExtensions();
    const enabledExtIds = enabledExtensions.map(e=>e.id);
    if (bundleIds.some(id => !enabledExtIds.includes(id))) {
      // if extensions from the bundles aren't enabled, we force our bundles extensions.
      this._bundleService.applyBundles(bundles);
      this.askUserToReload();
    }
    // we need to save that we already processed this data
    await this._storageService.store<Date>(Constants.lastProfileSyncedDateKey, profile.lastChanges, Scope.workspace);
  }

  private askUserToReload() {
    // todo: ask user to reload
    console.debug("askUserToReload not implemented");
  }

  private registerKeysToSync(sync: boolean = false) {
    this._ctxService.context.globalState.setKeysForSync(sync ? this.allSyncKey : this.defaultSyncedKey);
  }

  destroy() {
    this.dispose();
  }

  dispose() {
    console.log("dispose SyncService");
    if (this._syncIntervalId) {
      clearInterval(this._syncIntervalId);
    }
    this._ctxService.dispose();
    this._settingService.dispose();
    this._profileService.dispose();
    this._bundleService.dispose();
    this._extensionService.dispose();
    this._storageService.dispose();
  }
}

export default SyncService;