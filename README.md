![Screenshot](assets/images/banner.png)

# MEW - Workspace Extensions Manager

Goal: MEW will let you define bundles that you can select (one or many) and use for a specific workspace.\
You can define a bundle once and use it on different workspaces along with other bundles if needed.\
Those bundles are available through all VS Code instances, but when you select one or more bundle(s) for a workspace, that set of extensions only apply to this specific workspace.\
Meaning that you can have bundles A, D and I for the Folder 1 (first vs code instance) and bundles A, B and C for folder 2 (2nd vs code instance), and so on with as many folder you want.\

Create as many bundles as you want, use them as you like!

## Vocabulary
bundle: a set of VS Code extensions.\
profile: a set of selected bundles per workspace.\
workspace: a folder or [multi-root workspace](https://code.visualstudio.com/docs/editor/workspaces#_multiroot-workspaces).\

## Features

### Main features

- :white_check_mark: create bundles that have one or more extensions, shared across any VS Code instance (VS Code instances need to share the same user profile directory).
- :white_check_mark: edit a bundle (add/remove extensions from it).
- :white_check_mark: delete one or more bundles.
- :white_check_mark: select one or more bundle(s) and load extensions for current workspace.

### Nice to have:
- :white_check_mark: While in the Add/Remove extensions list, handle extension that uses i18n in their package.json (ie: %extension.displayName.title% becomes 'whatever value was set for this language or fallback to english in the package.nsl[.lang].json')
- :white_check_mark: add a statusBar with the selected bundle name loaded or 'N bundles' for many bundles or 'none' if no bundle is selected. Clicking on it opens the command palette filtered on MEW available commands. (mostly for people that doesn't use command palette shortcut, could add a user setting to directly select bundles to use for this workspace instead)
- :white_check_mark: when creating a bundle, precheck the currently active extensions in VS Code.
- :bulb: have an optional project file settings like a .mewrc.json file that would let a team configure a list of extensions to be used for this project, show a prompt that would allow you to install missing ones and load them (see [`mew.workspace.autoLoad` and `mew.workspace.autoLoad`](#mewrcjson) for details). Must handle TrustedWorkspace opt-in before doing anything (https://code.visualstudio.com/api/extension-guides/workspace-trust)
- :bulb: When extensions are installed while bundles are in use, let user choose if it should be added to the current bundles in use (see [`mew.workspace.autoAdd`](#extension-view-panel) for details)
- :bulb: When extensions are uninstalled while bundles are in use, let user choose if it should be removed from the current bundles in use (see [`mew.workspace.autoRemove`](#extension-view-panel) for details)
- :white_check_mark: 'Settings Sync' should keep our bundles across computers.
- :bulb: 'Settings Sync' should keep our workspaces configuration across computers.
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
## Settings Sync Configuration
### Using VS Code Settings Sync
After turning it on, you'll get your bundles from any synced machine.\
At this moment (August 2021), VS Code doesn't support sharing workspace settings/state.
### Using Settings Sync Extensions
After turning it on, you'll get your bundles from any synced machine.\
Workspace settings: Settings Sync Extensions can copy workspace settings over but right now VS Code workspace ID strategy doesn't give the same ID for a folder if you don't exactly have the same absolute path on n different machines.\
Meaning that d:\repos\vs-code on machine A and e:\sources\vs-code on machien B doesn't produce the same ID for their workspace state folders (which is not a bug, it's normal) but it prevents us to copy over our extensions set by folder and get it automatically on the other end.
### Plan for Workspace Settings Sync
MEW will offer a setting to keep a global state of which folder is using which bundles (in order to minimize memory usage for those who won't use this feature). This global state will be used to reload the right extensions when opening a folder.\
MEW is still thinking about the folder ID..., although folder name only is tempting, problems could arise if 2+ projects had the same fodler name.\
MEW could take the git repository to check if it's the same "project", but it should have to support all version control system and what about people who don't use them ?
MEW is still thinking, feel free to help by contribuing !.
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