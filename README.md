![Screenshot](assets/images/banner.png)

# MEW - Workspace Extensions Manager

Goal: Create Bundles of extensions to use for a project/workspace.
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
- :bulb: have an optional project file settings like a .mew file that would let a team configure a list of extensions to be used for this project, show a prompt that would allow you to install and load them (add a 'never ask me again'  option per project ?). Must handle TrustedWorkspace opt-in before doing anything (https://code.visualstudio.com/api/extension-guides/workspace-trust)
- :bulb: add a setting 'tbd' set to true, in order to install (if necessary) and load the extensions specified in the .mew file automatically when opening the project/workspace.
- :bulb: When extensions are installed while bundles are in use, let user choose if it should be added to the current bundles in use (add a setting to prevent prompt or automatically add it without asking)
- :bulb: When extensions are uninstalled while bundles are in use, let user choose if it should be removed from the current bundles in use (add a setting to prevent prompt or automatically remove it without asking)
- :bulb: Check if the extension 'Settings Sync' can keep our workspaces configuration of selected bundles across computers.
- :bulb: investigate if all vscode windows that share the same active bundle, could be reloaded if this bundle was edited. (based on a setting)
- :bulb: determine what to do when an extension state changes from the extension viewpanel
- :bulb: add settings to specify :
    - should we reload window when active bundle is edited ? all windows that shares the same active bundle ?
    - auto install and load extensions from .mewrc.json (never, prompt, load only, install only, always)
    - extensions ignored list
- :bulb: add localization on package. (very last priority)
- :white_check_mark: add webpack to bundle vsix package.
- :white_check_mark: Download automatically the right sqlite3 driver for your platform at first run, if it doesn't exists, notify user, he won't be able to use this extension at all.
- :bulb: Add unit tests using Jest
- :bulb: Add a logger and/or vscode-extension-telemetry to get fatal exceptions on azure insights ?

## Extension Settings

to do

## Requirements

you need nodeJS >= 14.x and VS Code >= 1.57.0

## First run
`npm install -g yarn`\
`yarn`\
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
