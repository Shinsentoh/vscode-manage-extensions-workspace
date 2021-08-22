import * as vscode from "vscode";
import * as path from "path";
import { readdir, existsSync as fsExistsSync } from "fs";
import { promisify } from "util";
import * as i18n from "vscode-nls-i18n";
import { Service } from "typedi";

import * as Constant from "../constants";
import * as Utils from "../utils";
import { Extension, ExtensionDetail, PackageJson, Scope } from "../types";
import ContextService from "./contextService";

const fsReadDir = promisify(readdir);
@Service()
class StorageService implements vscode.Disposable {
  constructor(private _ctxService: ContextService) {

  }

  public async store<T = any>(key: string, state: T, scope = Scope.global): Promise<boolean> {
    try {
      if (Scope.global === scope) {
        await this._ctxService.context.globalState.update(key, state);
      }
      else {
        await this._ctxService.context.workspaceState.update(key, state);
      }
    }
    catch(e) {
      console.debug(e);
      return false;
    }
    return true;
  }

  public async getState<T = any>(key: string, scope = Scope.global) : Promise<T | undefined>{
    try {
      if (Scope.global === scope) {
        return this._ctxService.context.globalState.get<T>(key);
      }
      else {
        return this._ctxService.context.workspaceState.get<T>(key);
      }
    }
    catch(e) {
      console.debug(e);
    }
  }

  /**
   * Read VS Code Extension directory and each extension package.json files to extract {@link ExtensionDetail} information
   * @returns list of {@link ExtensionDetail}
   */
  public async getInstalledExtensions() : Promise<ExtensionDetail[]> {
    const extensionsPath = this.getExtensionsPath();
    let extensions: ExtensionDetail[] = [];
    let obsolete: string[] = [];

    // get the obsolete extensions, that will be removed later.
    if (fsExistsSync(path.join(extensionsPath, '.obsolete'))) {
      obsolete = Object.keys(Utils.loadJSON(path.join(extensionsPath, '.obsolete')));
    }

    // get all the extension directories
    const extensionsDirectories = await fsReadDir(extensionsPath);

    await Promise.all(
      extensionsDirectories.map(async (name) => {
        // extensions
        if (fsExistsSync(path.join(extensionsPath, name)) && !obsolete.includes(name)) {
          const packageJsonPath = path.join(extensionsPath, name);

          if (!fsExistsSync(path.join(packageJsonPath, 'package.json'))) {
            console.debug(`Could not find package.json for extension '${name}'.`);
            return;
          }

          let info: PackageJson;
          try {
            info = Utils.loadJSON<PackageJson>(path.join(packageJsonPath, 'package.json'));
          }
          catch(e) {
            console.debug(e);
            return;
          }

          if (!info!.__metadata || !info!.__metadata.id) { return; } // happens with extensions installed from .vsix

          // Handle i18n translations in package.json
          // replace %some.text.key% with its translation value if extension uses i18n (vscode-nls)
          if (fsExistsSync(path.join(packageJsonPath, 'package.nls.json'))) {
            i18n.init(packageJsonPath);
            Object.keys(info).forEach(key => {
              let val = info[key];
              if (typeof val === 'string' && val.indexOf('%') === 0) {
                info[key] = i18n.localize(val.replace(/%/g, ''));
              }
            });
          }

          extensions.push({
            id: `${info.publisher.toLowerCase()}.${info.name.toLowerCase()}`,
            uuid: info.__metadata.id,
            label: info.displayName || info.name,
            description: info.description
          });
        }
      }),
    );

    return extensions.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * disable wrapper for {@link StorageService.setWorkspaceExtensionsState}
   */
  public disableWorkspaceExtensions(disabledExtensions: Extension[]) {
    return this.setWorkspaceExtensionsState(disabledExtensions, "disabled");
  }

  /**
   * disable wrapper for {@link StorageService.setWorkspaceExtensionsState}
   */
  public enableWorkspaceExtensions(enabledExtensions: Extension[]) {
    return this.setWorkspaceExtensionsState(enabledExtensions, "enabled");
  }

  /**
   * We must open the db and insert manually rather than use the workspaceState because workspaceState
   * set the colum key to the name of this extension and create an object of our key
   * that wrap our extension list and put those in the value column ...
   * @param extensions: list of {@link Extension} to enable or disable
   * @param state: "enabled" | "disabled"
   */
  private setWorkspaceExtensionsState(extensions: Extension[], state: "enabled" | "disabled") {
    const dbPath = Utils.getParentPath(this._ctxService.context.storageUri?.fsPath);

    try {
      const sqlite3 = require('sqlite3');
      const db = new sqlite3.Database(`${dbPath}${Utils.platformSlash}state.vscdb`);
      db
        .prepare("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)")
        .run(`${Constant.workspaceExtensionsStateKey}/${state}`, JSON.stringify(extensions));
      db.close();
    }
    catch(e: any) {
        console.debug(e);
    }
  }

  /**
   * The idea here is to get the parent directory of this extension which must be the vscode Extensions folder
   * if installed through marketplace or with a .vsix.
   * _______________________
   * @debug_only The only downside is when you debug this extension, this extension runs in its repo folder,
   * therefore we fallback to the default VS Code Extensions folder (see {@link Utils.getDefaultVSCodeExtensionsPath}).
   * If you don't use the default folders listed in getDefaultVSCodeExtensionsPath(),
   * then add a env variable 'CUSTOM_VSCODE_EXTENSIONS_FOLDER' in the launch.json
   * but don't commit this change please.
   * @returns VS Code Extensions path
   */
  private getExtensionsPath() : string {
    let actualPath: string | undefined;
    // get this extension parent directory
    actualPath = Utils.getParentPath(this._ctxService.context.extensionUri?.fsPath);
    if (!actualPath || !fsExistsSync(path.join(actualPath, this._ctxService.extensionDirectoryName()))) {
      // handle debug case, not using the default vs code extensions folder.
      if (process.env.CUSTOM_VSCODE_EXTENSIONS_FOLDER) {
        return process.env.CUSTOM_VSCODE_EXTENSIONS_FOLDER;
      }
      // else get the default path
      actualPath = Utils.getDefaultVSCodeExtensionsPath();
    }
    return actualPath;
  }

  destroy = () => this.dispose(); // typeDI compatibility instead of dispose()

  dispose() {
    console.log("dispose StorageService");
    this._ctxService.dispose();
  }
}

export default StorageService;