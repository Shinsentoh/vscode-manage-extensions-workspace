import {SettingsContribKey, appName} from '../constants';
import { AutoTask, AutoTaskExtensions } from '../types';
import * as vsTypes from "./vsCodeExtensionTypes";

export function getConfiguration(): vsTypes.IConfiguration {
  const properties: { [property:string] : any } = {};

  properties[SettingsContribKey.ignoredList] = {
    type: "array",
    default: [],
    items: {
      type: "string",
      pattern: "^[a-z0-9-]+\\.[a-z0-9-]+[a-z]+$",
      patternErrorMessage: "must follow the pattern `publisher.extension-name`. To find it you can right-click on the extension in the Extension panel and select 'Copy Extension Id'."
    },
    scope: "window",
    markdownDescription: "You won't be able to pick them for a bundle, their state won't be changed.",
    minItems: 0,
    uniqueItems: true
  };

  properties[SettingsContribKey.ignoredRemote] = {
    type: "boolean",
    default: false,
    scope: "window",
    markdownDescription: "Ignore VS Code Remote extensions. merged into the above ignoredList for:\n- `ms-vscode-remote.remote-ssh`\n - `ms-vscode-remote.remote-ssh-edit`\n - `ms-vscode-remote.remote-wsl`\n - `ms-vscode-remote.remote-container`"
  };

  properties[SettingsContribKey.syncWorkspacesProfile] = {
    type: "boolean",
    default: false,
    scope: "application",
    markdownDescription: "Once bundles are set for a workspace, opening the same workspace on a different synced machine will load the same set of bundles."
  };

  properties[SettingsContribKey.actionStatusBar] = {
    type: "string",
    default: `${appName} Commands`,
    enum: [
      `${appName} Commands`,
      "Select bundle(s)"
    ],
    enumDescriptions: [
      `${appName} will show all its commands`,
      `${appName} will let you select one or many bundles to use for the opened workspace.`
    ],
    scope: "application",
    markdownDescription: `when you click on ${appName} status bar, it will execute the following action:`
  };

  properties[SettingsContribKey.autoAdd] = {
    type: "string",
    default: AutoTaskExtensions.prompt,
    enum: [
      AutoTaskExtensions.prompt,
      AutoTaskExtensions.never,
      AutoTaskExtensions.all,
      AutoTaskExtensions.choose
    ],
    enumDescriptions: [
      `Prompt 'Which bundle(s) should ${appName} add the extension to ? 'Don't ask me again', 'All active' and 'Select', 'None'`,
      `Let ${appName} sleeps. No future prompts`,
      "Add the extension to all current active bundles automatically. No prompt",
      "Select the bundle(s) where you want to add the new extension."
    ],
    scope: "window",
    markdownDescription: `Whenever an extension is installed, what should ${appName} do with it ?`
  };

  properties[SettingsContribKey.autoRemove] = {
    type: "string",
    default: AutoTaskExtensions.prompt,
    enum: [
      AutoTaskExtensions.prompt,
      AutoTaskExtensions.never,
      AutoTaskExtensions.all,
      AutoTaskExtensions.choose
    ],
    enumDescriptions: [
      `Prompt 'Which bundle(s) should ${appName} remove the extension from ? 'Don't ask me again', 'All active' and 'Select', 'None'`,
      `Let ${appName} sleeps. No future prompts`,
      "Remove the extension from all current active bundles automatically. No prompt",
      "Select the bundle(s) where you want to remove the extension."
    ],
    scope: "window",
    markdownDescription: `Whenever an extension is uninstalled, what should ${appName} do with it ?`
  };

  properties[SettingsContribKey.autoLoad] = {
    type: "string",
    default: AutoTask.prompt,
    enum: [
      AutoTask.prompt,
      AutoTask.never,
      AutoTask.always
    ],
    enumDescriptions: [
      `Prompt: 'Some extensions to load were found inside the .mewrc.json, What should ${appName} do with it ?', Actions: 'Don't ask me again', 'Always load them', 'Load them & keep asking me'`,
      `Let ${appName} sleeps. No future prompts.`,
      "Always load extensions when opening a workspace or a folder. No future prompts."
    ],
    scope: "window",
    markdownDescription: `When a .mewrc.json is found in the current workspace/folder, what should ${appName} do about loading those extensions ?`
  };

  properties[SettingsContribKey.autoInstall] = {
    type: "string",
    default: AutoTask.prompt,
    enum: [
      AutoTask.prompt,
      AutoTask.never,
      AutoTask.always
    ],
    enumDescriptions: [
      `Prompt: 'Some extensions listed inside the .mewrc.json aren't installed yet, Whatd should ${appName} do with it ?', Actions: 'Don't ask me again', 'Always Install them', 'Install them & keep asking me'`,
      `Let ${appName} sleeps. No future prompts`,
      "Always install missing extensions when opening a workspace or a folder. No future prompts."
    ],
    scope: "window",
    markdownDescription: `When a .mewrc.json is found in the current workspace/folder, what should ${appName} do about installing those missing extensions ?`
  };

  //todo: activate these settings
  delete properties[SettingsContribKey.autoAdd];
  delete properties[SettingsContribKey.autoRemove];
  delete properties[SettingsContribKey.autoLoad];
  delete properties[SettingsContribKey.autoInstall];

  return {
    title: `${appName}`,
    properties: properties
  };
}