import { Service } from "typedi";
import * as vscode from "vscode";

import * as Constant from "../constants";
import { Extension, ExtensionDetail, Scope } from "../types";
import ContextService from "./contextService";
import SettingService from "./settingService";
import StorageService from "./storageService";

@Service()
class ExtensionService implements vscode.Disposable {
  private _oldVsCodeExtensionIdList: string = '';
  private _isExtensionsCached = false;

  constructor(
    private _ctxService: ContextService,
    private _storageService: StorageService,
    private _settingsService: SettingService
  ) {
    this.initialize();
  }

  /**
   * preload the cache for available extensions.
   * @returns a list of {@link ExtensionDetail} or undefined
   */
  public async preLoadExtensionsCache() {
    this.setAvailableExtensionsCache();
  }

  /**
   * return the cached availalbe extensions. if cache doesn't exist, populate it by parsing the extensions folder content.
   * @returns a list of {@link ExtensionDetail} or undefined
   */
  private async setAvailableExtensionsCache() {
    if (!this._isExtensionsCached) {
      const installedExtensions = await this._storageService.getInstalledExtensions();
      const ignoredExtensions = this.getIgnoredExtensions();
      const availableExtensions = installedExtensions.filter(i => !ignoredExtensions.includes(i.id));
      this._isExtensionsCached = true;
      // store datas async
      this._storageService.store(Constant.appInstalledExtensionsKey, availableExtensions, Scope.global);
      return installedExtensions;
    }
  }

  /**
   * Get ignored extensions defined by user, the vscode-remote one and this one (mew).
   * @returns list of Extension Id to ignore
   */
  private getIgnoredExtensions(): string[] {
    // ignore this extension and the vscode remote one as, user could
    // wrongly pick the remote ones and block himself while opening a remote folder.
    const ignoredList = [ "shinsentoh.vscode-manage-extensions-workspaces" ];

    const userIgnoredExtensions = this._settingsService.getUserIgnoredExtensions();

    return [...ignoredList, ...userIgnoredExtensions];
  }

  /**
   * Listen to [un]installed changes on the extensions View Panel from VS Code
   */
  private initialize() {
    this._oldVsCodeExtensionIdList = vscode.extensions.all.map(i => i.id).sort().join(',');
    // invalidate cache when extensions are installed or uninstalled from VS Code
    this._ctxService.context.subscriptions.push(
      vscode.extensions.onDidChange(_ => this.handleExtensionsViewListChanged),
      // invalidate extensions cache when mew settings are changed.
      this._settingsService.onDidChangeIgnoredExtensions(_ => this._isExtensionsCached = false)
    );
  }

  dispose() {
    this._oldVsCodeExtensionIdList = '';
  }

  // For now, it removes extensions cache when extensions list has changed
  // ...
  // idea for future use =>
  // 1: ask if user wants to add the new extension to the active bundles he uses.
  // 2: ask if user wants to remove the missing extensions from the active bundles that were using them.
  private handleExtensionsViewListChanged() {
    const extensionsIdList = vscode.extensions.all.map(i => i.id).sort().join(',');
    // if extensions number changed since last time
    if (extensionsIdList !== this._oldVsCodeExtensionIdList) {
      // invalidate cache
      this._isExtensionsCached = false;
      this._oldVsCodeExtensionIdList = extensionsIdList;
    }
  }

  /**
   * Get all avalaible extensions available for this VS Code instance even disabled ones.
   * Use a cache. this cache will be invalidate if an extension is installed or uninstalled from VS Code.
   * @returns list of {@link ExtensionDetail}
   */
  public async getAvailableExtensions(): Promise<ExtensionDetail[]> {
    // creates cache if not set
    await this.setAvailableExtensionsCache();

    const cachedExtensions = await this._storageService.getState<ExtensionDetail[]>(Constant.appInstalledExtensionsKey, Scope.global);
    return cachedExtensions ?? [];
  }

  /**
   * Retrieve the list of enabled extensions for this workspace
   * @returns list of {@link Extension}
   */
  public async getEnabledExtensions(): Promise<Extension[]> {
    return  vscode.extensions.all
      .filter((e) =>  !/.*(?:\\\\|\/)resources(?:\\\\|\/)app(?:\\\\|\/)extensions(?:\\\\|\/).*/i.test(e.extensionPath)) // ignore internal extensions
      .filter((e) => !e.id.startsWith('vscode.') && !e.id.startsWith('ms-vscode'))
      .filter((e) => e?.packageJSON.uuid !== undefined)
      .map(item =>({
        id: `${item.id.toLowerCase()}`,
        uuid: item?.packageJSON.uuid
      }) as Extension);
  }

}

export default ExtensionService;