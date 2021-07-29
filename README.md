# MEW - Manage your Extensions by Workspaces

Goal: let you bundle some extensions into profiles to use for a workspace.
Apply one or more profiles on any workspace.

Let's say you want to open a NestJs project (where you must activate SonarQube) that plays with a mssql database, and the project is hosted on Azure repos:
- you might create a first bundle/profile 'nestjs' with extensions like nestjs Snippets, eslint, auto Close tag, and so on.
- another one with Sql server, sql tools, ...
- and one with azure tools, azure repos, pipelines, ...

Then you'd pick those three as a combined bundle/profile for this NestJs project.

Whereas on another project you'll work with reactjs extensions, still using a sql server database but hosted on GitHub.

And of course you could totally have X projects opened and using the same one and only profile for all your NodeJs projets and having another project using one or a bunch of profiles to work with .Net Core and mysql, etc.

## Features

- create a bundle/profile that have one or many extensions accessible from any vsCode instance.
- edit a profile (add/remove extensions)
- select one or many bundle/profile and enable it's extensions settings for a specific workspace.
- delete a profile

### Nice to have:
- add a statusBar with the selected profile name loaded or 'multiple' for many profiles or 'none' if no profile is selected. clicking on it would let you select profiles to apply again.
- when creating a profile, check beforehand extensions in the list, based on vsCode current extensions state (enable/disable).
- have an optional project file settings like a .mew file that would let a team configure a list of extensions to be used for this project. You'd need to already have this extension installed and a setting set to auto load to have those extensions enabled automatically.
- When extensions are installed while profiles are in use, let user choose if it should be added to those profiles (add user settings to prevent prompt or automatically add it without asking)
- Check if the extension 'Settings Sync' keep our workspaces configuration of selected bundles/profiles across multiple computers.
- investigate if all vscode windows that share the same active profile, can be reloaded if this profile is edited.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**