import * as vscode from "vscode";
import { Service } from "typedi";
import { Bundle, ChooseBundleOptions, ChooseExtensionsOptions, Extension } from "../types";

@Service()
class UIService implements vscode.Disposable {
  /**
   * Let you choose extensions to add to a bundle from a QuickPickItem list.
   * @param availableExtensions extensions that are available to pick from.
   * @param enabledExtensions extensions which will be selected by default.
   * @param placeHolder placeholder to give more information.
   * @param title title of the QuickPickItem dialog
   * @returns a list of selected {@link Extension}
   */
  public async chooseExtensions(chooseExtensionsOptions: ChooseExtensionsOptions) : Promise<Extension[] | undefined>
  {
    // create extension list
    const extensionSelectionList = chooseExtensionsOptions.availableExtensions.map(ext => {
      return {
        label: ext.label || ext.id,
        description: ext.label ? ext.id : undefined,
        detail: ext.description || " - - - - - ",
        picked: chooseExtensionsOptions.enabledExtensions.some(i => i.id === ext.id)
      } as vscode.QuickPickItem;
    });

    // show and select extensions
    const selected = await vscode.window.showQuickPick(extensionSelectionList, {
      placeHolder: chooseExtensionsOptions.placeHolder,
      title: chooseExtensionsOptions.title,
      canPickMany: true }
    );
    if (selected) {
      // return selected extensions
      return chooseExtensionsOptions.availableExtensions.filter(e => selected.some(i => i.description === e.id)).map(e => e as Extension);
    }
    return undefined;
  }

 /**
   * Let you choose bundles to add to a profile from a QuickPickItem list.
   * @param availableExtensions extensions that are available to pick from.
   * @param enabledExtensions extensions which will be selected by default.
   * @param placeHolder placeholder to give more information.
   * @param title title of the QuickPickItem dialog
   * @returns a list of selected {@link Bundle}
   */
  public async chooseBundles(chooseBundleOptions: ChooseBundleOptions) : Promise<Bundle[] | undefined>
  {
    // create bundle list
    const bundleSelectionList = chooseBundleOptions.availableBundles.map(({name}) => {
      return {
        label: name,
        picked: chooseBundleOptions.enabledBundles.some(e => e === name)
      } as vscode.QuickPickItem;
    });

    // show and select bundles
    let selectedBundlesNames: string[] = [];
    if (chooseBundleOptions.canPickMany) {
      // Can pick many items
      const selectedBundles = await vscode.window.showQuickPick(bundleSelectionList, {
        canPickMany: true,
        placeHolder: chooseBundleOptions.placeHolder,
        title: chooseBundleOptions.title
      });
      if (!selectedBundles) { return undefined; }
      selectedBundlesNames = selectedBundles?.map(i => i.label) ?? [];
    }
    else {
      // One pick only
      const selectedBundle = await vscode.window.showQuickPick(bundleSelectionList, {
        canPickMany: false,
        placeHolder: chooseBundleOptions.placeHolder,
        title: chooseBundleOptions.title
      });
      if (!selectedBundle) { return undefined; }
      selectedBundlesNames.push(selectedBundle.label);
    }

    return chooseBundleOptions.availableBundles.filter(i => selectedBundlesNames.includes(i.name));
  }

  /**
   *
   * @param bundles Let you choose a bundle name, doesn't allow existing names.
   * @returns the bundle name or 'undefined' if name is empty
   */
  public async getBundleName(bundles: Bundle[] | undefined) : Promise<string | undefined> {
    let bundleName: string | undefined;
    let placeHolder = "Choose a bundle name";
    while (true) {
      bundleName = await vscode.window.showInputBox({ placeHolder, title: "Create new bundle" });

      if (bundleName && bundles?.some(i => i.name === bundleName)) {
        placeHolder = `The bundle \"${bundleName}\" already exists, find another name`;
        continue;
      } else if (!bundleName) {
        return;
      }

      break;
    }

    return bundleName;
  }

  destroy = () => this.dispose(); // typeDI compatibility instead of dispose()

  dispose() {
    return;
  }
}

export default UIService;