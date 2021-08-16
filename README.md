![Screenshot](assets/images/banner.png)

# MEW - Workspace Extensions Manager

Goal: Create Bundles of extensions to have only the necessary extensions enabled for a project and limit memory usage while having different VS Code instance run another set of extensions.\
Apply one or more bundles of extensions on any project/workspace.

In a few words, bundles are a set of extensions designed to load these latter on a specific project without worrying of your ESlint extension running on a different powershell project for instance.

You are in charge, use them as you like!

## Features

### Main features

- :white_check_mark: create bundles that have one or more extensions, shared across any VS Code instance (sharing the same User Profile).
- :white_check_mark: edit a bundle (add/remove extensions)
- :white_check_mark: delete a profile
- :white_check_mark: select one or more bundle(s) and load extensions for current project/workspace.

### Nice to have:
- :white_check_mark: While in the Add/remove extensions list, handle extension that uses i18n in their package.json (ie: %extension.displayName.title% becomes 'whatever value was set for this language or fallback to english in the package.nsl.[lang].json')
- :white_check_mark: add a statusBar with the selected bundle name loaded or 'bundles ...' for many bundles or 'none' if no bundle is selected. Clicking it let you choose bundles to use for this project/workspace.
- :white_check_mark: when creating a bundle, precheck the currently active extensions in VS Code.
- :bulb: have an optional project file settings like a .mew file that would let a team configure a list of extensions to be used for this project, show a prompt that would allow you to install and load them. Must handle TrustedWorkspace opt-in before doing anything (https://code.visualstudio.com/api/extension-guides/workspace-trust)
- :bulb: When extensions are installed while bundles are in use, let user choose if it should be added to the current bundles in use
- :bulb: When extensions are uninstalled while bundles are in use, let user choose if it should be removed from the current bundles in use (add a setting to prevent prompt or automatically remove it without asking)
- :bulb: Check if the extension 'Settings Sync' can keep our workspaces configuration of selected bundles across computers.
- :bulb: investigate if all vscode windows that share the same active bundle, could be reloaded if this bundle was edited. (based on a setting)
- :bulb: determine what to do when an extension state changes from the extension viewpanel
- :bulb: add settings to specify :
    - should we reload window when active bundle is edited ? all windows that shares the same active bundle ?
- :bulb: add localization on package. (very last priority)
- :white_check_mark: add webpack to bundle vsix package.
- :white_check_mark: Download automatically the right sqlite3 driver for your platform at first run, if it doesn't exists, notify user, he won't be able to use this extension at all.
- :bulb: Add unit tests using Jest
- :bulb: Add a logger and/or vscode-extension-telemetry to get fatal exceptions on azure insights ?

## Extension Settings

- `mew.ignoredListExtensions`:\
Extensions's state won't be changed by MEW, these extensions won't be listed when creating or editing bundles.
- `mew.ignoreRemoteExtensions`: \
Ignore VS Code Remote extensions. Same as the above ignoredList for:
  - `ms-vscode-remote.remote-ssh`,
  - `ms-vscode-remote.remote-ssh-edit`,
  - `ms-vscode-remote.remote-wsl`,
  - `ms-vscode-remote.remote-container`
- `mew.workspace.autoLoad`: \
When a .mewrc.json is found in the current workspace/folder, what should MEW do about loading those extensions ?
  - `Ask you` Prompt: 'Some extensions to load were found inside the .mewrc.json, What should MEW do with it ?', Actions: 'Don't ask me again', 'Always load them', 'Load them & keep asking me'.
  - `Keep calm & sleep` Let MEW sleeps. No future prompts.
  - `Always do it` Always load extensions when opening a workspace or a folder.
- `mew.workspace.autoInstall`: \
When a .mewrc.json is found in the current workspace/folder, what should MEW do about installing those missing extensions ?
  - `Ask you` Prompt: 'Some extensions listed inside the .mewrc.json aren't installed yet, Whatd should MEW do with it ?', Actions: 'Don't ask me again', 'Always Install them', 'Install them & keep asking me'.
  - `Keep calm & sleep` Let MEW sleeps. No future prompts.
  - `Always do it` will always installed missing extensions from .mewrc.json after opening a folder/workspace.
- `mew.extensions.autoAdd`:
Whenever an extension is installed, what should MEW do with it ?
  - `Keep calm & sleep`: Let MEW sleeps. No future prompts.
  - `Auto-edit all active`: Add the extension to all current active bundles automatically. No prompt.
  - `Let you select bundle(s)`: Select the bundle(s) where you want to add the new extension.
  - `Ask you`: Prompt 'Which bundle(s) should MEW add the extension ${extensionName} to ? 'Don't ask me again', 'All active' and 'Select', 'None'.
- `mew.extensions.autoRemove`: \Whenever an extension is uninstalled, what should MEW do with it ?
  - `Keep calm & sleep`: Let MEW sleeps. No future prompts.
  - `Auto-edit all active`: Remove the extension from all current active bundles automatically. No prompt.
  - `Let you select bundle(s)`: Select the bundle(s) where you want to remove the extension.
  - `Ask you`: Prompt 'Which bundle(s) should MEW remove the extension ${extensionName} from ? 'Don't ask me again', 'All active' and 'Select', 'None'.

## Requirements

you need nodeJS >= 14.x and VS Code >= 1.57.0

## First run

```
npm install -g yarn
yarn
```
F5 to debug (choose 'Debug Extension' if prompted)

-----------------------------------------------------------------------------------------------------------

## Usage Example

### Use Case 1

Let's say you want to open a NestJs project (where you must activate SonarQube) that plays with a mssql database, and the project is hosted on Azure repos:
- you might create a first bundle/profile 'nestjs' with extensions like nestjs Snippets, eslint, auto Close tag, and so on.
- another one with Sql server, sql tools, ...
- and one with azure tools, azure repos, pipelines, ...

Then you'd pick those three bundles as a combined profile for this NestJs project.

That's great but what about projects using reactjs extensions, still using a sql server database but hosted on GitHub ?
Well, just create a bundle for reactJs and another for GitHub extensions and pick the already existing one for sql server. they will be active for this second projet, while the first one will still have his set of activs bundles.

All your projects where you set some bundles to be used will be reopened with their extensions list.

### Use Case 2

You could totally have X projects opened and using the same one and only profile for all your NodeJs projets and having another project using one or a bunch of bundles to work with .Net Core, mysql, docker, etc.

### use case 3

You could also have a bundle that pack all the extensions used by a specific company for all its projects and another for a second company or a unique bundle for all your projects.
