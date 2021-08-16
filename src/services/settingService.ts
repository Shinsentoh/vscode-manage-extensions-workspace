import * as vscode from "vscode";
import { Service } from "typedi";
import { SettingsContribKey } from "../constants";
import ContextService from "./contextService";
import { AutoTask, AutoTaskExtensions } from "../types";

@Service()
class SettingService implements vscode.Disposable {
  private _ignoredExtensionsChangeEmitter = new vscode.EventEmitter<void>();
  private _settings: { [k:string]: any } = {};
  private static readonly _ignoredRemoteExtensions = [
    "ms-vscode-remote.remote-ssh",
    "ms-vscode-remote.remote-ssh-edit",
    "ms-vscode-remote.remote-wsl",
    "ms-vscode-remote.remote-container"
  ];

  constructor(private _ctxService: ContextService) {
    this._ctxService.context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(this.configurationChanged, this)
    );

    this.loadConfiguration();
  }

  dispose() {
    this._settings = {};
    this._ignoredExtensionsChangeEmitter.dispose();
  }

  private loadConfiguration() {
    const contribConfigurations: string[] = Object.values(SettingsContribKey);
    contribConfigurations.forEach((val) => {
        this.processConfiguraton(val);
    }, this);
  }

  private configurationChanged(event: vscode.ConfigurationChangeEvent) {
    const contribConfigurations: string[] = Object.values(SettingsContribKey);
    contribConfigurations.forEach((val) => {
      if (event.affectsConfiguration(val)) {
        this.processConfiguraton(val);
        if (SettingsContribKey.ignoredList === val || SettingsContribKey.ignoredRemote === val) {
          this._ignoredExtensionsChangeEmitter.fire();
        }
      }
    }, this);
  }

  private processConfiguraton(val: string) {
    // first we split the section and the config
    // ie: 'mew.ignoredListExtensions' becomes 'mew.extensions' and 'ignoreList'
    const index = val.lastIndexOf('.');
    const section = val.substring(0, index);
    const config = val.substring(index+1, val.length);
    this._settings[val] = vscode.workspace.getConfiguration(section).get(config);
  }

  public getUserIgnoredExtensions(): string[] {
    const ignoredExtensions: string[] = this._settings[SettingsContribKey.ignoredList] ?? [];
    if (this.ignoreRemoteExtensions === true) {
      return [...ignoredExtensions, ...SettingService._ignoredRemoteExtensions];
    }
    return ignoredExtensions;
  }

  public readonly onDidChangeIgnoredExtensions: vscode.Event<void> = this._ignoredExtensionsChangeEmitter.event;

  public get ignoreRemoteExtensions(): boolean  { return this._settings[SettingsContribKey.ignoredRemote] ?? false; }
  public get autoInstall(): AutoTask            { return this._settings[SettingsContribKey.autoInstall]   ?? AutoTask.prompt; }
  public get autoRemove():  AutoTaskExtensions  { return this._settings[SettingsContribKey.autoRemove]    ?? AutoTaskExtensions.prompt; }
  public get autoLoad():    AutoTask            { return this._settings[SettingsContribKey.autoLoad]      ?? AutoTask.prompt; }
  public get autoAdd():     AutoTaskExtensions  { return this._settings[SettingsContribKey.autoAdd]       ?? AutoTaskExtensions.prompt; }
}

export default SettingService;