import { PLUGIN_PREFIX } from './utils';

export class PluginError extends Error {
	constructor(message: string) {
		super(`${PLUGIN_PREFIX} ${message}`);
	}
}
