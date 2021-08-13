/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-throw-literal */
const fs = require("fs"),
  path = require("path");
const packagePath = path.resolve(path.join(__dirname, "../../sqlite3/package.json"));
const packageJson = loadJSON(packagePath);
const bindingPath = getModulePath(packageJson);
const targetDir = path.resolve(path.join(__dirname, bindingPath));
module.exports = exports = require(path.join(targetDir, "node_sqlite3.node"));

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path));
}

function templateOptions(packageJson) {
  const napiVersionArray = packageJson.binary.napi_versions;
  return options = {
    name : packageJson.name,
    version: packageJson.version,
    toolset: '',
    napi_build_version: napiVersionArray[napiVersionArray.length - 1],
    platform: process.platform,
    arch: process.arch
  };
}

function getModulePath(packageJson) {
  const options = templateOptions(packageJson);
  return evalTemplate(path.join("../", packageJson.binary.module_path), options);
}

function evalTemplate(template, opts) {
  Object.keys(opts).forEach((key) => {
    const pattern = '{' + key + '}';
    while (template.indexOf(pattern) > -1) {
      template = template.replace(pattern, opts[key]);
    }
  });
  return template;
}
