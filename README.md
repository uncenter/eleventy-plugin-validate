# eleventy-plugin-validate

## Installation

```
npm i eleventy-plugin-validate
pnpm add eleventy-plugin-validate
yarn add eleventy-plugin-validate
bun add eleventy-plugin-validate
```

## Usage

Setup the plugin in the Eleventy config file.

**eleventy.config.js:**

<details>
    <summary>CJS</summary>

```js
const { plugin: pluginValidate, zod } = require('eleventy-plugin-validate');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		// Example configuration:
		schemas: [
			{
				// Run this schema on the 'posts' collection.
				// If you omit this property, the schema will run against
				// collection items from the 'all' collection.
				collections: ['posts'],
				// Add your Zod schema here,
				// using the `zod` re-exported from the plugin.
				// This should be a Zod object.
				schema: zod
					.object({
						title: zod.string(),
						description: zod.string(),
						draft: zod.boolean(),
					})
					// I suggest adding .strict() to your schema
					// for even more accurate validation.
					// With .strict(), extra properties
					// you have not specified in the schema object
					// will cause an error. For example, if you have an
					// optional property "edited", but you misspell it as
					// "edtied", .strict() will warn you!
					.strict(),
			},
		],
	});
};
```

</details>

<details>
    <summary>ESM (requires <code>@11ty/eleventy@v3</code>)</summary>

```js
import { plugin as pluginValidate, zod } from 'eleventy-plugin-validate';

export default (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		// Example configuration:
		schemas: [
			{
				// Run this schema on the 'posts' collection.
				// If you omit this property, the schema will run against
				// collection items from the 'all' collection.
				collections: ['posts'],
				// Add your Zod schema here,
				// using the `zod` re-exported from the plugin.
				// This should be a Zod object.
				schema: zod
					.object({
						title: zod.string(),
						description: zod.string(),
						draft: zod.boolean(),
					})
					// I suggest adding .strict() to your schema
					// for even more accurate validation.
					// With .strict(), extra properties
					// you have not specified in the schema object
					// will cause an error. For example, if you have an
					// optional property "edited", but you misspell it as
					// "edtied", .strict() will warn you!
					.strict(),
			},
		],
	});
};
```

</details>

Run Eleventy, and voila! The plugin will warn you about collection items that do not pass schema validation.

```
> eleventy --serve

[eleventy-plugin-validate][./posts/hello-world.md] title: expected a string but received boolean
[eleventy-plugin-validate][./posts/hello-world.md] description: expected a string but received number
[eleventy-plugin-validate][./posts/hello-world.md] draft: expected a boolean but received string
[11ty] Problem writing Eleventy templates: (more in DEBUG output)
[11ty] Invalid frontmatter data provided (via Error)
...
```

## License

[MIT](LICENSE)
