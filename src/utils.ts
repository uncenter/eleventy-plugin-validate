import kleur from 'kleur';

export const log = {
	log(msg: string) {
		message(msg);
	},

	info(msg: string) {
		message(msg, 'warn', 'blue');
	},

	warn(msg: string) {
		message(msg, 'warn', 'yellow');
	},

	error(msg: string) {
		message(msg, 'error', 'red');
	},
};

/**
 * Formats the message to log.
 *
 * @param message The raw message to log.
 * @param type The error level to log.
 */
function message(
	message: string,
	type: 'log' | 'warn' | 'error' = 'log',
	color?: string,
) {
	const prefix = '[eleventy-plugin-icons] ';
	message = `${prefix}${message.split('\n').join(`\n${prefix}`)}`;
	if (color) {
		// @ts-expect-error - `color` can't index `kleur`.
		console[type](kleur[color](message));
	} else {
		console[type](message);
	}
}
