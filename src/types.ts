export enum CommandType {
  selectProfile = "mew.bundle.Select",
  createBundle = "mew.bundle.Create",
  editBundle = "mew.bundle.Edit",
  deleteBundle = "mew.bundle.Delete",
  disableExtension = "mew.extension.Disable",
  enableExtension = "mew.extension.Enable"
}

export enum SettingsContributionKey {
  selectProfile = "mew.bundle.Select",
  createBundle = "mew.bundle.Create",
  editBundle = "mew.bundle.Edit",
  deleteBundle = "mew.bundle.Delete",
  disableExtension = "mew.extension.Disable",
  enableExtension = "mew.extension.Enable"
}

export enum Scope {
  global,
  workspace
}

export type Bundle = {
  name: string,
  extensions: Extension[]
};

export type Profile = {
  name: string,
  bundles: Bundle[]
};

export type ExtensionDetail = {
  id: string,
  uuid: string,
  description: string,
  label: string
};

export type Extension = {
  id: string,
  uuid: string
};


export type PackageJson = {
	name: string,
	displayName: string,
  description: string,
  version: string,
  publisher: string,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __metadata: {
		id: string,
		publisherId: string,
		publisherDisplayName: string,
    installedTimestamp: number
  },
  [key: string]: any
};

export type ChooseExtensionsOptions = {
  availableExtensions: ExtensionDetail[],
  enabledExtensions: Extension[],
  placeHolder: string,
  title: string
};

export type ChooseBundleOptions = {
  availableBundles: Bundle[],
  enabledBundles: string[],
  placeHolder: string,
  title: string,
  canPickMany: boolean
};

export type EditBundleOptions = {
  availableBundles?: Bundle[],
  enabledBundles?: string[],
  placeHolder: string,
  title: string
};