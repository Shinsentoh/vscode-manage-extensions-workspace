import fs from 'fs';
import { CommandsContribKey, appName } from '../constants';
import { loadJSON } from "../utils";
import * as vsTypes from "./vsCodeExtensionTypes";
import { getConfiguration } from './configuration';
import { getCommands } from './commands';
import { getMenus } from './menus';

export function renderPackageJSON(path: string) {
  try {
    let extensionManifest = loadJSON<vsTypes.IExtensionManifest>(path);
    extensionManifest.contributes = getContributes();
    extensionManifest.activationEvents = getActivationEvents();
    const packageJson = JSON.stringify(extensionManifest); //convert it back to json
    fs.writeFile(path, packageJson, { encoding: 'utf8' }, _ => {}); // write it back
  }
  catch (err) {
    console.error(err);
  }
}

function getContributes(): vsTypes.IExtensionContributions {
  const contributes: vsTypes.IExtensionContributions = {
    commands: getCommands(),
    menus: getMenus(),
    keybindings: [
      {
        command: CommandsContribKey.selectProfile,
        key: "ctrl+m ctrl+s"
      },
      {
        command: CommandsContribKey.createBundle,
        key: "ctrl+m ctrl+c"
      },
      {
        command: CommandsContribKey.editBundle,
        key: "ctrl+m ctrl+e"
      }
    ],
    configuration: getConfiguration()
  };
  return contributes;
}

function getActivationEvents(): string[] {
  const commands = Object.values(CommandsContribKey);
  const activationEvents = commands.map((val:string) => {
    return `onCommand:${val}`;
  });
  activationEvents.push("onStartupFinished");
  return activationEvents;
}