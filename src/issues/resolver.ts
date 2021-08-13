/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-throw-literal */
import fetch from 'node-fetch';
import * as vscode from 'vscode';
import { PackageJson } from '../types';
import * as utils from '../utils';
import * as fs from "fs";
import * as path from "path";
import * as tar from "tar";

async function loadSqlite3Bindings() {
  const sqliteFolder = path.resolve(path.join(__dirname, "node_modules/sqlite3"));
  const packagePath = path.join(sqliteFolder, "package.json");
  const packageJson = loadJSON(packagePath);
  const targetDir = path.resolve(getModulePath(packageJson, sqliteFolder));
  const bindingPath = path.join(targetDir, "node_sqlite3.node");

  if (!fs.existsSync(bindingPath)) {
    const url = getUrl(packageJson);

    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`response status ${res.status} ${res.statusText} on ${url}`);
      }
      // force creation of the directory with recursive
      fs.mkdirSync(targetDir, { recursive: true });
      await res.body.pipe(extract(targetDir));
    }
    catch (e) {
      const uninstall = "Uninstall";
      vscode.window.showErrorMessage(
        `Couldn't find sqlite3 drivers for your machine: ${process.platform}-${process.arch} and NodeJS ${process.version}.
        Sorry but MEW Extension can't work without it, do you want to uninstall this extension ?`
        , uninstall
        , "Dismiss"
      )
      .then((res) => {
        if (uninstall === res) {
          const packagePath = path.resolve(path.join(__dirname, "../package.json"));
          const packageJSON = loadJSON(packagePath);
          const packageName = utils.getExtensionNameFromPackageObject(packageJSON);

          vscode.commands
            .executeCommand('workbench.extensions.uninstallExtension', packageName)
            .then(
              (accepted) => {
                vscode.window.showInformationMessage(`'${packageJSON.displayName}' isn't installed anymore.`);
              },
              (rejected: string) => {
                if (rejected.indexOf("is not installed") > -1) {
                  return vscode.window.showInformationMessage(`'${packageJSON.displayName}' isn't installed anymore.`);
                }

                const goToExtensionPanel = "Go to Extension Panel";
                vscode.window.showWarningMessage(
                  `'${packageJSON.displayName}' extension couldn't commit seppuku itself. Bear with it or uninstall it manually from the extension panel.`,
                  goToExtensionPanel
                )
                .then((choice) => {
                  if (goToExtensionPanel === choice) {
                    vscode.commands.executeCommand('workbench.extensions.search', packageName);
                  }
                }
              );
            });
        }
      });
    }
  }
}

function loadJSON(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function extract(to: string, onentry?: any) {
  return tar.extract({
    cwd: to,
    strip: 1,
    onentry
  });
}

function templateOptions(packageJson: PackageJson) {
  const napiVersionArray = packageJson.binary.napi_versions;
  return {
    name : packageJson.name,
    version: packageJson.version,
    toolset: '',
    napi_build_version: napiVersionArray[napiVersionArray.length - 1],
    platform: process.platform,
    arch: process.arch
  };
}

function getModulePath(packageJson: any, sqlite3Folder: string) {
  const options = templateOptions(packageJson);
  return evalTemplate(path.join(sqlite3Folder, packageJson.binary.module_path), options);
}

function getUrl(packageJson: any) {
  const options = templateOptions(packageJson);
  let hostedPath = urlJoin(packageJson.binary.host, packageJson.binary.remote_path, packageJson.binary.package_name);
  hostedPath = evalTemplate(hostedPath, options);
  return correctUrl(hostedPath);
}

function urlJoin(...parts: string[]) {
  return parts.join('/').replace(/\/\//ig, '/');
}

function correctUrl(url: string) {
  return url.replace(/\/\//ig, '/').replace(/\/\.\//ig, '/').replace(/\:\/([a-zA-Z0-9]){1}/ig, '://$1');
}

function evalTemplate(template: string, opts: any) {
  Object.keys(opts).forEach((key) => {
    const pattern = '{' + key + '}';
    while (template.indexOf(pattern) > -1) {
      template = template.replace(pattern, opts[key]);
    }
  });
  return template;
}

loadSqlite3Bindings();