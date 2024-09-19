export const PLUGIN_PREFIX = '[eleventy-plugin-validate]';

export const log = {
	log(msg: string) {
		console.log(PLUGIN_PREFIX, msg);
	},

	error(msg: string) {
		console.error(PLUGIN_PREFIX, msg);
	},
};
