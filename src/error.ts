export class PluginError extends Error {
	constructor(message: string) {
		super(`[eleventy-plugin-validate] ${message}`);
	}
}
