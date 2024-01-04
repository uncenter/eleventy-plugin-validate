# eleventy-plugin-validate

## Installation

```
npm i eleventy-plugin-validate
pnpm add eleventy-plugin-validate
yarn add eleventy-plugin-validate
bun add eleventy-plugin-validate
```

## Usage

**eleventy.config.js:**

```js
const { plugin as pluginValidate, zod } = require('eleventy-plugin-validate');

module.exports = (eleventyConfig) => {
	eleventyConfig.addPlugin(pluginValidate, {
		schemas: [
			{
				// Run this schema on the 'posts' collection.
				collections: ['posts'],
                // Add your Zod schema here.
				schema: zod.object({ abc: zod.string() }),
			},
		],
	});
}
```

**[input-folder]/[directory]/[directory-data-file].11tydata.js (e.g. src/posts/posts.11tydata.js):**

```js
const { addValidations } = require('eleventy-plugin-validate');

module.exports = addValidations({
	tags: ['posts'],
});
```

**[input-folder]/[directory]/[file] (e.g. src/posts/index.md):**

```yaml
---
abc: true
---
Hello, world!
```

## License

[MIT](LICENSE)
