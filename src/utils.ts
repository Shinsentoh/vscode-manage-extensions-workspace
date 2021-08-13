import { readFileSync, existsSync } from "fs";
import { PackageJson } from "./types";

export const platformSlash = process.platform === "win32" ? "\\" : "/";

export function getParentPath(path: string | undefined) : string | undefined
{
  if (!path) { return; }
  const lastIndex = path.lastIndexOf(platformSlash);
  const parentPath = path.slice(0, lastIndex);
  return parentPath;
}

/**
 * Get the default VS Code extension directory for any platform.
 * @returns default vs code extension directory path
 */
 export function getDefaultVSCodeExtensionsPath(): string {
  // see default extension dir: https://code.visualstudio.com/docs/editor/extension-marketplace#_where-are-extensions-installed
  // Windows %USERPROFILE%\.vscode\extensions
  // macOS or Linux:
  // ~/.vscode/extensions or ~/.vscode-server/extensions
  switch (process.platform) {
    case "win32":
      return `${process.env.USERPROFILE}\\.vscode\\extensions\\`;
    case "darwin":
    case "linux":
    default:
      let path = `${process.env.HOME}/.vscode/extensions/`;
      if (!existsSync(path)) {
        path = `${process.env.HOME}/.vscode-server/extensions/`;
      }
      return path;
  }
}

export function loadJSON<T>(path: string) {
  return JSON.parse(readFileSync(path) as any) as T;
}

export function uniqueArray<T>(arrays: T[]) {
  return [...new Set([...arrays.map(o => JSON.stringify(o))])].map<T>(e => JSON.parse(e));
}

export function getExtensionNameFromPackagePath(packagePath: string) {
  const packageJSON = loadJSON<PackageJson>(packagePath);
  return getExtensionNameFromPackageObject(packageJSON);
}

export function getExtensionNameFromPackageObject(packageJson: any) {
  const name = packageJson.name;
  const publisher = packageJson.publisher;
  return `${publisher}.${name}`.toLowerCase();
}