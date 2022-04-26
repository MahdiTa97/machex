const webpack = require('webpack');
const path = require('path');
const fileSystem = require('fs-extra');
const env = require('./env');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

const ASSET_PATH = process.env.ASSET_PATH || '/';

const scriptDir = path.join(__dirname, '../src');

const alias = {
  'react-dom': '@hot-loader/react-dom',
};

// load the secrets
const secretsPath = path.join(scriptDir, 'secrets.' + env.NODE_ENV + '.js');

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

const entry = {
  newtab: path.join(scriptDir, 'pages', 'Newtab', 'index.jsx'),
  options: path.join(scriptDir, 'pages', 'Options', 'index.jsx'),
  popup: path.join(scriptDir, 'pages', 'Popup', 'index.jsx'),
  background: path.join(scriptDir, 'pages', 'Background', 'index.js'),
  contentScript: path.join(scriptDir, 'pages', 'Content', 'index.js'),
  devtools: path.join(scriptDir, 'pages', 'Devtools', 'index.js'),
  panel: path.join(scriptDir, 'pages', 'Panel', 'index.jsx'),
};

const options = {
  mode: process.env.NODE_ENV || 'development',

  entry,

  chromeExtensionBoilerplate: {
    notHotReload: ['background', 'contentScript', 'devtools'],
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../build'),
    clean: true,
    publicPath: ASSET_PATH,
  },

  module: {
    rules: [
      {
        // look for .css or .scss files in the `src` directory
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        // },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),

    // expose and write the allowed env constants on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),

    new CopyWebpackPlugin({
      patterns: [
        {
          /* generates the manifest file using the package.json information */
          from: 'src/manifest.json',
          to: path.join(__dirname, '../build'),
          force: true,
          transform: (content, path) =>
            Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            ),
        },
        {
          from: 'src/pages/Content/content.styles.css',
          to: path.join(__dirname, '../build'),
          force: true,
        },
        {
          from: 'src/assets/img',
          to: path.join(__dirname, '../build'),
          force: true,
        },
      ],
    }),
    ...getHtmlPlugins(['Newtab', 'Options', 'Popup', 'Devtools', 'Panel']),
  ],

  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlWebpackPlugin({
        template: path.join(scriptDir, 'pages', chunk, 'index.html'),
        filename: chunk.toLowerCase() + '.html',
        chunks: [chunk.toLowerCase()],
        cache: false,
      })
  );
}
