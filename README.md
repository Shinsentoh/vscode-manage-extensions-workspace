![Screenshot](assets/images/banner.png)

# MEW - Workspace Extensions Manager

MEW helps you reduce VS Code memory usage by specifying which extensions you want to enable by workspace.

MEW will let you define multiple bundles of extensions and use them for a specific workspace.\
You can define a bundle once and use it on different workspaces along with other bundles if needed.\
Meaning that you can have bundles A, B, C for the workspace 1 (first vs code instance) and bundles A and D for workspace 2 (2nd vs code instance), and so on with as many folder you want.

Create as many bundles as you want, use them as you like!

## Vocabulary
bundle: a set of VS Code extensions.\
profile: a set of selected bundles per workspace.\
workspace: a folder or [multi-root workspace](https://code.visualstudio.com/docs/editor/workspaces#_multiroot-workspaces).

## Features

### Main features

- :white_check_mark: create bundles that have one or more extensions, shared across any VS Code instance (VS Code instances need to share the same user profile directory).
- :white_check_mark: edit a bundle (add/remove extensions from it).
- :white_check_mark: delete one or more bundles.
- :white_check_mark: select one or more bundles and load extensions for current workspace.

### Nice to have:
- :white_check_mark: While in the Add/Remove extensions list, handle extension that uses i18n in their package.json (ie: %extension.displayName.title% becomes 'whatever value was set for this language or fallback to English in the package.nsl[.lang].json')
- :white_check_mark: add a statusBar with the selected bundle name loaded or 'N bundles' for many bundles or 'none' if no bundle is selected. Clicking on it opens the command palette filtered on MEW available commands. (mostly for people that doesn't use command palette shortcut, could add a user setting to directly select bundles to use for this workspace instead)
- :white_check_mark: when creating a bundle, pre-checked the currently active extensions in VS Code.
- :bulb: have an optional project file settings like a .mewrc.json file that would let a team configure a list of extensions to be used for this project, show a prompt that would allow you to install missing ones and load them (see [`mew.workspace.autoLoad` and `mew.workspace.autoLoad`](#mewrcjson) for details). Must handle TrustedWorkspace opt-in before doing anything (https://code.visualstudio.com/api/extension-guides/workspace-trust)
- :bulb: When extensions are installed while bundles are in use, let user choose if it should be added to the current bundles in use (see [`mew.workspace.autoAdd`](#extension-view-panel) for details)
- :bulb: When extensions are uninstalled while bundles are in use, let user choose if it should be removed from the current bundles in use (see [`mew.workspace.autoRemove`](#extension-view-panel) for details)
- :white_check_mark: 'Settings Sync' should keep our bundles across computers.
- :white_check_mark: 'Settings Sync' should keep our workspaces configuration across computers.
- :bulb: investigate if all vscode windows that share the same active bundle, could be reloaded if this bundle was edited. (based on a setting)
- :bulb: determine what to do when an extension is enabled or disabled from the extension viewpanel.
- :bulb: add localization on package. (very last priority)
- :white_check_mark: add webpack to bundle vsix package.
- :white_check_mark: Download automatically the right sqlite3 driver for your platform at first run, if it doesn't exists, notify user, he won't be able to use this extension at all and help him uninstall it.
- :bulb: Add unit tests using Jest
- :bulb: Add a logger and/or vscode-extension-telemetry to get fatal exceptions on azure insights ?
- :bulb: Add a performance logger, in dev only, to optimize memory usage.
## Extension Settings
### General
- `mew.ignoredListExtensions`:\
Extensions's state won't be changed by MEW, these extensions won't be listed when creating or editing bundles.
- `mew.ignoreRemoteExtensions`: \
Ignore VS Code Remote extensions. Same as the above ignoredList for:
  - `ms-vscode-remote.remote-ssh`,
  - `ms-vscode-remote.remote-ssh-edit`,
  - `ms-vscode-remote.remote-wsl`,
  - `ms-vscode-remote.remote-container`
- `mew.syncWorkspacesProfile`:\
Let you sync workspace's bundle(s) association over computers.\
example: opening a folder "MyFoder", selecting bundles, waiting ~ 1 min, will let you open the same "MyFolder" on another computer and have the same bundles enabled).
- `mew.actionStatusBar`:\
Let you choose the action performed when clicking on the MEW status bar:
either selecting bundles for opened workspace or list all MEW commands.
### .mewrc.json
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
### Extension View Panel

- `mew.extensions.autoAdd`:\
Whenever an extension is installed, what should MEW do with it ?
  - `Keep calm & sleep`: Let MEW sleeps. No future prompts.
  - `Auto-edit all active`: Add the extension to all current active bundles automatically. No prompt.
  - `Let you select bundle(s)`: Select the bundle(s) where you want to add the new extension.
  - `Ask you`: Prompt 'Which bundle(s) should MEW add the extension ${extensionName} to ? 'Don't ask me again', 'All active' and 'Select', 'None'.
- `mew.extensions.autoRemove`: \
Whenever an extension is uninstalled, what should MEW do with it ?
  - `Keep calm & sleep`: Let MEW sleeps. No future prompts.
  - `Auto-edit all active`: Remove the extension from all current active bundles automatically. No prompt.
  - `Let you select bundle(s)`: Select the bundle(s) where you want to remove the extension.
  - `Ask you`: Prompt 'Which bundle(s) should MEW remove the extension ${extensionName} from ? 'Don't ask me again', 'All active' and 'Select', 'None'.
## Settings Sync Configuration

You can either use VS Code built-in settings Sync, or the Settings Sync Extension.

After turning the "globalstate" and "extensions" settings sync, you'll get your bundles from any synced machine.\
In August 2021, VS Code doesn't support sharing workspace settings/state, so I reworked profiles code and added an option `mew.syncWorkspacesProfile` which will sync your chosen bundles for a specific workspace across your synced computers.

One limitation though: if one workspace is opened on X computers, and you change the bundles selection, the new configuration on other computers will be applied within a minute and you'll need to either reload VS Code window or (re)open the workspace.

## Requirements
you need nodeJS >= 14.x and VS Code >= 1.57.0
## First run
`npm install -g yarn` (if you don't already have yarn installed)\
`yarn`\
F5 to debug (choose 'Debug Extension' if prompted)
## Package as .vsix
`vsce package`

-----------------------------------------------------------------------------------------------------------
## Contributors
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Shinsentoh"><img src="https://avatars.githubusercontent.com/u/1506373?v=4" width="100px;" alt=""/><br /><sub><b>Shinsentoh</b></sub></a><br /><a href="https://github.com/Shinsentoh/vscode-manage-extensions-workspace/commits?author=Shinsentoh" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
