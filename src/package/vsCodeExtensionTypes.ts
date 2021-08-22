/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

export const MANIFEST_CACHE_FOLDER = 'CachedExtensions';
export const USER_MANIFEST_CACHE_FILE = 'user';
export const BUILTIN_MANIFEST_CACHE_FILE = 'builtin';

export interface ITranslation {
	id: string;
	path: string;
}

export interface ILocalization {
	languageId: string;
	languageName?: string;
	localizedLanguageName?: string;
	translations: ITranslation[];
	minimalTranslations?: { [key: string]: string };
}

export interface ICommand {
	command: string;
	title: string;
	category?: string;
}

export interface IConfigurationProperty {
	description?: string;
	type: string | string[];
	default?: any;
	[k: string]: any;
}

export interface IConfiguration {
	title: string;
	properties: { [key: string]: IConfigurationProperty; };
}

export interface IDebugger {
	label?: string;
	type: string;
	runtime?: string;
}

export interface IGrammar {
	language: string;
}

export interface IJSONValidation {
	fileMatch: string | string[];
	url: string;
}

export interface IKeyBinding {
	command: string;
	key: string;
	when?: string;
	mac?: string;
	linux?: string;
	win?: string;
}

export interface ILanguage {
	id: string;
	extensions: string[];
	aliases: string[];
}

export interface IMenu {
	command: string;
	alt?: string;
	when?: string;
	group?: string;
}

export interface ISnippet {
	language: string;
}

export interface ITheme {
	label: string;
}

export interface IViewContainer {
	id: string;
	title: string;
}

export interface IView {
	id: string;
	name: string;
}

export interface IColor {
	id: string;
	description: string;
	defaults: { light: string, dark: string, highContrast: string };
}

export interface IWebviewEditor {
	readonly viewType: string;
	readonly priority: string;
	readonly selector: readonly {
		readonly filenamePattern?: string;
	}[];
}

export interface ICodeActionContributionAction {
	readonly kind: string;
	readonly title: string;
	readonly description?: string;
}

export interface ICodeActionContribution {
	readonly languages: readonly string[];
	readonly actions: readonly ICodeActionContributionAction[];
}

export interface IAuthenticationContribution {
	readonly id: string;
	readonly label: string;
}

export interface IWalkthroughStep {
	readonly id: string;
	readonly title: string;
	readonly description: string | undefined;
	readonly media:
	| { image: string | { dark: string, light: string, hc: string }, altText: string, markdown?: never }
	| { markdown: string, image?: never }
	readonly completionEvents?: string[];
	/** @deprecated use `completionEvents: 'onCommand:...'` */
	readonly doneOn?: { command: string };
	readonly when?: string;
}

export interface IWalkthrough {
	readonly id: string,
	readonly title: string;
	readonly description: string;
	readonly steps: IWalkthroughStep[];
	readonly when?: string;
}

export interface IStartEntry {
	readonly title: string;
	readonly description: string;
	readonly command: string;
	readonly when?: string;
	readonly category: 'file' | 'folder' | 'notebook';
}

export interface INotebookRendererContribution {
	readonly id: string;
}

export interface IExtensionContributions {
	commands?: ICommand[];
	configuration?: IConfiguration | IConfiguration[];
	debuggers?: IDebugger[];
	grammars?: IGrammar[];
	jsonValidation?: IJSONValidation[];
	keybindings?: IKeyBinding[];
	languages?: ILanguage[];
	menus?: { [context: string]: IMenu[] };
	snippets?: ISnippet[];
	themes?: ITheme[];
	iconThemes?: ITheme[];
	productIconThemes?: ITheme[];
	viewsContainers?: { [location: string]: IViewContainer[] };
	views?: { [location: string]: IView[] };
	colors?: IColor[];
	localizations?: ILocalization[];
	readonly customEditors?: readonly IWebviewEditor[];
	readonly codeActions?: readonly ICodeActionContribution[];
	authentication?: IAuthenticationContribution[];
	walkthroughs?: IWalkthrough[];
	startEntries?: IStartEntry[];
	readonly notebookRenderer?: INotebookRendererContribution[];
}

export interface IExtensionCapabilities {
	readonly virtualWorkspaces?: ExtensionVirtualWorkspaceSupport;
	readonly untrustedWorkspaces?: ExtensionUntrustedWorkspaceSupport;
}


export const ALL_EXTENSION_KINDS: readonly ExtensionKind[] = ['ui', 'workspace', 'web'];
export type ExtensionKind = 'ui' | 'workspace' | 'web';

export type LimitedWorkspaceSupportType = 'limited';
export type ExtensionUntrustedWorkspaceSupportType = boolean | LimitedWorkspaceSupportType;
export type ExtensionUntrustedWorkspaceSupport = { supported: true; } | { supported: false, description: string } | { supported: LimitedWorkspaceSupportType, description: string, restrictedConfigurations?: string[] };

export type ExtensionVirtualWorkspaceSupportType = boolean | LimitedWorkspaceSupportType;
export type ExtensionVirtualWorkspaceSupport = boolean | { supported: true; } | { supported: false | LimitedWorkspaceSupportType, description: string };

export interface IExtensionIdentifier {
	id: string;
	uuid?: string;
}

export const EXTENSION_CATEGORIES = [
	'Azure',
	'Data Science',
	'Debuggers',
	'Extension Packs',
	'Education',
	'Formatters',
	'Keymaps',
	'Language Packs',
	'Linters',
	'Machine Learning',
	'Notebooks',
	'Programming Languages',
	'SCM Providers',
	'Snippets',
	'Testing',
	'Themes',
	'Visualization',
	'Other',
];

export interface IExtensionManifest {
	readonly name: string;
	readonly displayName?: string;
	readonly publisher: string;
	readonly version: string;
	readonly engines: { readonly vscode: string };
	readonly description?: string;
	readonly main?: string;
	readonly browser?: string;
	readonly icon?: string;
	readonly categories?: string[];
	readonly keywords?: string[];
	activationEvents?: string[];
	readonly extensionDependencies?: string[];
	readonly extensionPack?: string[];
	readonly extensionKind?: ExtensionKind | ExtensionKind[];
	contributes?: IExtensionContributions;
	readonly repository?: { url: string; };
	readonly bugs?: { url: string; };
	readonly enableProposedApi?: boolean;
	readonly api?: string;
	readonly scripts?: { [key: string]: string; };
	readonly capabilities?: IExtensionCapabilities;
}
