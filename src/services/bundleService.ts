import * as vscode from "vscode";
import { Service } from "typedi";
import { Bundle, Extension, Scope } from "../types";
import * as Constant from "../constants";
import * as Utils from "../utils";
import StorageService from "./storageService";
import ExtensionService from "./extensionService";
import ProfileService from "./profileService";
import UIService from "./uiService";

@Service()
class BundleService implements vscode.Disposable {
  constructor(
    private _storageService: StorageService,
    private _profileService: ProfileService,
    private _extensionService: ExtensionService,
    private _uiService: UIService,
  ) {}

  /**
   * Select Bundles of extensions to be used for this workspace
   * @returns list of {@link Bundle} or undefined if none selected.
   */
  public async selectBundles(): Promise<Bundle[] | undefined> {
      // Checking whether the workspace is open
      const folders = vscode.workspace.workspaceFolders;
      if (!folders) {
        vscode.window.showErrorMessage("Working folder not found, open a folder an try again.");
        return;
      }

      // Get and check bundles
      const bundles = await this.getBundles() ?? [];
      if (bundles.length === 0) {
        vscode.window.showErrorMessage("No bundles found, please create a bundle first.");
        return;
      }

      // Generate items
      const enabledBundles = await this._profileService.getCurrentProfileBundles() ?? [];
      const selectedBundles = await this._uiService.chooseBundles({
        availableBundles: bundles,
        enabledBundles: enabledBundles,
        placeHolder: "The selected bundles will be used for this workspace",
        title: `Select one or more bundles for this workspace: "${vscode.workspace.name}"`,
        canPickMany: true
      });
      // if user escaped the prompt or clicked elsewhere, do nothing.
      if (!selectedBundles) { return; }

      // prompt a warning if no bundle is in use and none were selected (confirmed with enter or ok).
      if (selectedBundles.length <= 0 && enabledBundles.length <= 0) {
        vscode.window.showWarningMessage("No bundles selected, none applied.");
        return;
      }

      // if bundles are in use but user did not select any bundles
      const selectedBundlesNames = selectedBundles.map(i => i.name);
      if (enabledBundles.sort().join('') === selectedBundlesNames.sort().join('')) { return; }

      await this.applyBundles(selectedBundles);

      // set the current profile in the statusBar
      await this._profileService.setCurrentProfile(selectedBundlesNames);

      // Reloading the window to apply extensions
      vscode.commands.executeCommand("workbench.action.reloadWindow");

      return selectedBundles;
  }

  public async applyBundles(enabledBundles: Bundle[], availableExtensions?: Extension[]): Promise<void> {
    if (!availableExtensions) {
      availableExtensions = await this._extensionService.getAvailableExtensions();
    }

    // merge and deduplicate bundles extensions into an array of extension
    const enabledExtensions = Utils.uniqueArray(...enabledBundles.flatMap(i => i.extensions));
    // all available extensions except the enabled ones.
    const disabledExtensions = availableExtensions.filter(i => enabledBundles.length > 0 && enabledExtensions.findIndex(s => s.id === i.id) === -1);

    this._storageService.enableWorkspaceExtensions(enabledExtensions);
    this._storageService.disableWorkspaceExtensions(disabledExtensions);
  }

  /**
   * Prompt for a bundle Name, then ask for extensions to this bundle and save it.
   * If no extension is chosen, bundle is not created.
   * @returns a {@link Bundle} if created, undefined if it failed or the user didn't specify any extension to add to this bundle.
   */
  public async createBundle(): Promise<Bundle | undefined> {
    this._extensionService.preLoadExtensionsCache();
    const bundles = await this.getBundles() ?? [];

    // choose a bundle name
    const bundleName = await this._uiService.getBundleName(bundles);
    if (!bundleName) { return; }

    // choose the extensions to include.
    const enabledExtensions = await this._extensionService.getEnabledExtensions();
    const availableExtensions = await this._extensionService.getAvailableExtensions();
    const selectedExtensions = await this._uiService.chooseExtensions({
      availableExtensions: availableExtensions,
      enabledExtensions: enabledExtensions,
      placeHolder: "Filter extensions",
      title: `Select extensions for bundle "${bundleName}"`
    }) ?? [];

    await this.saveBundle(bundleName, selectedExtensions, bundles);

    return { name: bundleName, extensions: selectedExtensions } as Bundle;
  }

  /**
   * Prompt to choose bundles and then delete them.
   * @returns true if bundles were updated, false otherwise
   */
  public async deleteBundle(): Promise<boolean> {
    // Get and check bundles
    let bundles = await this.getBundles() ?? [];
    if (bundles.length === 0) {
      vscode.window.showErrorMessage("No bundles to delete.");
      return false;
    }

    // Generate items
    let selectedBundle = await this._uiService.chooseBundles({
      availableBundles: bundles,
      enabledBundles: [],
      placeHolder: "Search bundles",
      title: "Select a bundle to delete",
      canPickMany: true
    });

    // exit if no bundle was selected.
    if (!selectedBundle || selectedBundle.length <= 0) { return false; }

    // remove deleted bundle from global bundles list.
    bundles = bundles.filter(i => selectedBundle!.findIndex(b => b.name === i.name) === -1);
    const selectedBundleames: string[] = selectedBundle.map(i => i.name);

    if(await this.saveBundles(bundles)) {
      vscode.window.showInformationMessage(`Bundles: '${selectedBundleames.join("', '")}' successfully deleted!`);

      // remove deleted bundles from current Profile
      let currentProfile = await this._profileService.getCurrentProfileBundles();
      currentProfile = currentProfile?.filter(bundleName => selectedBundleames.indexOf(bundleName));
      this._profileService.setCurrentProfile(currentProfile);

      return true;
    }

    return false;
  }
  /**
   * Prompt to choose a bundle, then prompt forto choose which extensions to use for this bundle.
   * @returns the updated {@link Bundle} or undefined if nothing was changed.
   */
  public async editBundle(): Promise<Bundle | undefined> {
    this._extensionService.preLoadExtensionsCache();

    // Get and check bundles
    const bundles = await this.getBundles() ?? [];
    if (bundles.length === 0) {
      vscode.window.showErrorMessage("No bundles found, please create a bundle first.");
      return;
    }

    // Generate items
    const enabledBundles = await this._profileService.getCurrentProfileBundles() ?? [];
    let [selectedBundle] = await this._uiService.chooseBundles({
      availableBundles: bundles,
      enabledBundles: enabledBundles,
      placeHolder: "Filter bundles",
      title: "Select a bundle to edit",
      canPickMany: false
    }) ?? [];

    // exit if no bundle was selected.
    if (!selectedBundle) { return; }

    // choose the extensions to include.
    const availableExtensions = await this._extensionService.getAvailableExtensions();
    const selectedExtensions = await this._uiService.chooseExtensions({
      availableExtensions: availableExtensions,
      enabledExtensions: selectedBundle.extensions,
      placeHolder: "Filter extensions",
      title: `Select extensions for bundle "${selectedBundle.name}"`
    }) ?? [];
    // handle the case when we specify an extension ignoreList on the workspace level and an active bundle is edited.
    // we take the exising bundle and add the extensions that are not present in this workspace.
    const uniqueExtensions = Utils.uniqueArray<Extension>(...selectedBundle.extensions, ...selectedExtensions);

    await this.saveBundle(selectedBundle.name, uniqueExtensions, bundles);

    if (enabledBundles && enabledBundles.includes(selectedBundle.name)) {
      await this.askReloadActiveBundles();
    }
  }

  private async askReloadActiveBundles() {
    const reload = "Apply Changes";
    const self = this;
    vscode.window
      .showInformationMessage(`an active bundle was edited, would you like to apply those changes on this workspace ?`, reload)
      .then(async res => {
        if (reload === res) {
          self.reloadActiveBundles();
        }
      });
  }

  private async reloadActiveBundles() {
    const activeBundlesNames = await this._profileService.getCurrentProfileBundles() ?? [];
    const bundles = await this.getBundles(b => activeBundlesNames.includes(b.name)) ?? [];
    if (bundles) {
      await this.applyBundles(bundles);
      // Reloading the window to apply extensions
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
  }


  private async saveBundle(bundleName: string, selectedExtensions: Extension[], bundles?: Bundle[]) : Promise<boolean> {
    if (selectedExtensions.length > 0) {
      if (!bundles) {
        bundles = await this.getBundles() ?? [];
      }
      // creating bundle
      const bundle: Bundle = { name: bundleName, extensions: selectedExtensions };
      let existingBundleIndex = bundles.findIndex(i => i.name === bundle.name);
      if (existingBundleIndex === -1) {
        bundles = [...bundles, bundle];
      }
      else {
        bundles[existingBundleIndex] = bundle;
      }

      // saving bundles
      return this.saveBundles(bundles);
    }

    return false;
  }

  private async saveBundles(bundles?: Bundle[]) : Promise<boolean> {
    // save bundles
    return this._storageService.store(Constant.appBundlesKey, bundles);
  }

  /**
   * Returns all the existing bundles linked to this VS Code user-data-dir, otpionally filtered by predicate.
   */
  public async getBundles(
    predicate?: (value: Bundle, index: number, array: Bundle[]) => boolean
  ): Promise<Bundle[] | undefined> {
    const bundles = await this._storageService.getState<Bundle[]>(Constant.appBundlesKey);
    return bundles?.filter(predicate ?? (_ => true));
  }

    /**
   * Returns all the existing bundles Ids linked to this VS Code user-data-dir, otpionally filtered by predicate.
   */
  public getBundlesIds(bundles: Bundle[]): string[] {
    return Utils.uniqueArray(...bundles.flatMap(b => b.extensions.map(e => e.id)));
  }

  /**
   * returns existence of bundleName in the store.
   * @param bundleName BundleName to look for
   * @returns true if bundleName exists, false otherwise.
   */
  public async exists(bundleName: string): Promise<boolean> {
    const bundles = await this.getBundles(b => bundleName === b.name );
    return bundles !== undefined;
  }

  destroy = () => this.dispose(); // typeDI compatibility instead of dispose()

  dispose() {
    console.log("dispose bundleService");
    this._profileService.dispose();
    this._extensionService.dispose();
    this._storageService.dispose();
    this._uiService.dispose();
  }
}

export default BundleService;
