Simple [vite](https://github.com/vitejs/vite) plugin to generate typescript path mapping base on vite aliases

# Install

```
npm i --save-dev vite-plugin-typescript-path-aliases
```

```js
// tsconfig.json
{
  "extends": ["vite-plugin-typescript-path-aliases/paths"]
}
```

```js
// vite.config
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { typescriptPathAliases } from 'vite-plugin-typescript-path-aliases';

export default defineConfig({
  plugins: [typescriptPathAliases()],
  resolve: {
    alias: [
      {
        find: '@example',
        replacement: fileURLToPath(new URL('src', import.meta.url)),
      },
    ],
  },
});
```

**Note**: You need to restart vite to apply the changes<br />

Now you can import files as
```js
import myFile from '@example/my-file';
```
