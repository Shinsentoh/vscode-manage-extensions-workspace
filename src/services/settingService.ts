import * as vscode from "vscode";
import { Disposable } from "vscode";
import { Service } from "typedi";
import { SettingsContribKey } from "../constants";
import ContextService from "./contextService";

@Service()
class SettingService implements Disposable {
  constructor(private _ctxService: ContextService) {
    this._ctxService.context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(this.configurationChanged)
    );
  }
  dispose() {
  }

  private configurationChanged(event: vscode.ConfigurationChangeEvent) {
    for (const settingKey of Object.values(SettingsContribKey))
    {
      if (event.affectsConfiguration(settingKey)) {
        vscode.window.showInformationMessage(`Updated ${settingKey} setting`);
      }
    }
  }

  public getUserIgnoredExtensions(): string[] {
    return vscode.workspace.getConfiguration('mew.extensions').get('ignoredList') as string[];
  }
}

export default SettingService;