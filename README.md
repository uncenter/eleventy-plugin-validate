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

```js
const { plugin as pluginValidate, zod } = require('eleventy-plugin-validate');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		schemas: [
			{
				// Run this schema on the 'posts' collection.
				collections: ['posts'],
				// Add your Zod schema here, using the `zod` exported from the plugin.
				schema: zod
					.object({
						title: zod.string(),
						description: zod.string(),
						draft: zod.boolean(),
					})
					.strict(),
			},
		],
	});
}
```

Make sure you have actual collections to validate.

**[input-folder]/[directory]/[directory-data-file].11tydata.js (e.g. src/posts/posts.11tydata.js):**

```js
module.exports = {
	tags: ['posts'],
};
```

Add an item for the collection(s) with some data!

**[input-folder]/[directory]/[file] (e.g. src/posts/hello-world.md):**

```yaml
---
title: true
description: 1
draft: 'string'
---
```

Run Eleventy, and voila!

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
