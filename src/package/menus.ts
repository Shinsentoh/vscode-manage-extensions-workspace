import { CommandsContribKey } from '../constants';
import { IMenu } from "./vsCodeExtensionTypes";

export function getMenus(): { [context: string]: IMenu[] } {
  return {
    "extension/context": [
      {
        when: "extensionStatus == installed && workbenchState != empty",
        command: CommandsContribKey.enableExtension,
        group: "navigation"
      },
      {
        when: "extensionStatus == installed && workbenchState != empty",
        command: CommandsContribKey.disableExtension,
        group: "navigation"
      }
    ],
    // disabling context menu from command Palette
    commandPalette: [
      {
        when: "false",
        command: CommandsContribKey.enableExtension
      },
      {
        when: "false",
        command: CommandsContribKey.disableExtension
      }
    ]
  };
}