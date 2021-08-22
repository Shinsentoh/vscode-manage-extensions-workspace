import {CommandsContribKey, appName} from '../constants';
import * as vsTypes from "./vsCodeExtensionTypes";

export function getCommands(): vsTypes.ICommand[] {
  return [
    {
      command: CommandsContribKey.selectProfile,
      title: "Select bundle(s)",
      category: appName
    },
    {
      command: CommandsContribKey.createBundle,
      title: "Create bundle",
      category: appName
    },
    {
      command: CommandsContribKey.editBundle,
      title: "Edit bundle",
      category: appName
    },
    {
      command: CommandsContribKey.deleteBundle,
      title: "Delete bundle(s)",
      category: appName
    },
    {
      command: CommandsContribKey.disableExtension,
      title: "Disable (bundle)",
      category: appName
    },
    {
      command: CommandsContribKey.enableExtension,
      title: "Enable (bundle)",
      category: appName
    }
  ];
}