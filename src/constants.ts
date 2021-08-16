/* eslint-disable @typescript-eslint/naming-convention */
export const appKey = "mew";
export const appBundlesKey = `${appKey}:global/bundles`;
export const appProfilesKey = `${appKey}:global/profiles`;
export const appInstalledExtensionsKey = `${appKey}:global/installedExtensions`;

export const currentProfileKey = `${appKey}:workspace/currentProfile`;

export const workspaceExtensionsStateKey = 'extensionsIdentifiers';

export const contextContainerKey = 'contextContainerKey';

export class CommandsContribKey {
  public static readonly selectProfile = "mew.extension.select";
  public static readonly createBundle = "mew.bundle.create";
  public static readonly editBundle = "mew.bundle.edit";
  public static readonly deleteBundle = "mew.bundle.delete";
  public static readonly disableExtension = "mew.extension.disable";
  public static readonly enableExtension = "mew.extension.enable";
}

export class SettingsContribKey {
  public static readonly ignoredList = "mew.ignoredListExtensions";
  public static readonly ignoredRemote = "mew.ignoreRemoteExtensions";
  public static readonly autoLoad = "mew.workspace.autoLoad";
  public static readonly autoInstall = "mew.workspace.autoInstall";
  public static readonly autoAdd = "mew.extensions.autoAdd";
  public static readonly autoRemove = "mew.extensions.autoRemove";
}
