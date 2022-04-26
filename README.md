<br />
<p align="center">
  <img width="250px" src="./logo.png" alt="Pomodoros Logo" />
</p>

<h3 align="center">MACHEX (A React Chrome Extension Boilerplate)</h3>

## Features

- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
- [React 18](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Webpack 5](https://webpack.js.org/)
- [Webpack Dev Server 4](https://webpack.js.org/configuration/dev-server/)
- [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [Tailwind V3](https://tailwindcss.com/)
- [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app)
- [Prettier](https://prettier.io/)
- [Webpack-Automatic-Refresh](https://webpack.github.io/docs/webpack-dev-server.html#automatic-refresh)

## Getting Started

1. `git clone https://github.com/MahdiTa97/machex.git`
2. `cd machex`
3. `npm install`
4. `npm run start`
5. open the `chrome://extensions` URL and turn on developer mode from the top left and then click; on `Load Unpacked` and select the `build` folder.

## Scripts

- `start`
- `build`
- `prettier`

## Publishing

After the development of your extension run the command

```
$ NODE_ENV=production npm run build
```

Now, the content of the `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) for more info about publishing.

## TypeScript

The `Options` Page is implemented using TypeScript. Refer to `src/pages/Options/' for examples of how to do this.

## Content Scripts

Although this boilerplate uses the Webpack dev server, it's also prepared to write all your bundles files on the disk at every code change, so you can point, on your extension manifest, to the bundles that you want to use as [content scripts](https://developer.chrome.com/extensions/content_scripts), but you need to exclude these entry points from hot reloading [(why?)](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/issues/4#issuecomment-261788690). To do so you need to expose which entry points are content scripts on the `webpack.config.js` using the `chromeExtensionBoilerplate -> notHotReload` config. Look at the example below.

Let's say that you want to use the `myContentScript` entry point as the content script, so on your `webpack.config.js` you will configure the entry point and exclude it from hot reloadings, like this:

```js
{
  …
  entry: {
    myContentScript: "./src/js/myContentScript.js"
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["myContentScript"]
  }
  …
}
```

and on your `src/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["https://www.google.com/*"],
      "js": ["myContentScript.bundle.js"]
    }
  ]
}
```

## Secrets

If you develop an extension that talks to some APIs, you probably use different keys for testing and production. It is a good practice to avoid committing your secret keys and expose them to anyone with access to the repository.

To this task, this boilerplate imports the file `./secrets.<THE-NODE_ENV>.js` on your modules through the module named `secrets`, so you can do things like this:

_./secrets.development.js_

```js
export default { key: '123' };
```

_./src/popup.js_

```js
import secrets from 'secrets';
ApiCall({ key: secrets.key });
```

Files named `secret". *. js` have already been ignored in the repository.

## Credits
- It is largely derived from [lxieyang/chrome-extension-boilerplate-react] which itself is adapted from [samuelsimoes/chrome-extension-webpack-boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate).
