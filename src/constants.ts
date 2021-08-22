/* eslint-disable @typescript-eslint/naming-convention */
export const appName = "MEW";
export const appKey = "mew";
export const appBundlesKey = `${appKey}:global/bundles`;
export const appProfilesKey = `${appKey}:global/profiles`;
export const appInstalledExtensionsKey = `${appKey}:global/installedExtensions`;

export const currentProfileKey = `${appKey}:workspace/currentProfile`;
export const lastProfileSyncedDateKey = `${appKey}:workspace/lastProfileSyncedDate`;

export const workspaceExtensionsStateKey = 'extensionsIdentifiers';

export const contextContainerKey = 'contextContainerKey';

/**
 * Using class here instead of enums because we can iterate over those properties, which can't be done on enums
 * and we have access to the name of the class as well.
 * See SettingService.configurationChanged() for use case.
 */
export class CommandsContribKey {
  public static readonly selectProfile = "mew.extension.select";
  public static readonly createBundle = "mew.bundle.create";
  public static readonly editBundle = "mew.bundle.edit";
  public static readonly deleteBundle = "mew.bundle.delete";
  public static readonly disableExtension = "mew.extension.disable";
  public static readonly enableExtension = "mew.extension.enable";
}

// see CommandsContribKey comment.
export class SettingsContribKey {
  public static readonly ignoredList = "mew.ignoredListExtensions";
  public static readonly ignoredRemote = "mew.ignoreRemoteExtensions";
  public static readonly syncWorkspacesProfile = "mew.syncWorkspacesProfile";
  public static readonly actionStatusBar = "mew.actionStatusBar";
  public static readonly autoLoad = "mew.workspace  .autoLoad";
  public static readonly autoInstall = "mew.workspace.autoInstall";
  public static readonly autoAdd = "mew.extensions.autoAdd";
  public static readonly autoRemove = "mew.extensions.autoRemove";
}
