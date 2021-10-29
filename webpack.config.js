// Constants
const PROD = 'production';
const DEV = 'development';

// Libraries
import dotenv from 'dotenv';
import * as execute from 'child_process';
import webpack from 'webpack';
import path from 'path';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FileManagerPlugin from 'filemanager-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import getTemplateEntrypoints from './lib/utilities/get-template-entrypoints.js';
import getLayoutEntrypoints from './lib/utilities/get-layout-entrypoints.js';
import getChunkName from './lib/utilities/get-chunk-name.js';
import { settings } from './lib/config.js';

dotenv.config();

let isRunning = false;

// Variables and settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exec = execute.spawn;
const env = process.env.NODE_ENV || DEV;
const cli = process.env.CLI === 'true';
const zip = process.env.ZIP || false;
const deploy = process.env.DEPLOY == 'true';
const bundleAnalyzerEnabled = !!process.env.BUNDLE_ANALIZER;
const webpackPerformanceAnalyzerEnabled = !!process.env.WEBPACK_PERFORMANCE;
const cleanDistPluginsDisabled = !!process.env.CLEAN_DIST_DISABLED;

// Clean files on build but not watch
const cleanDistPlugins = cleanDistPluginsDisabled
  ? []
  : [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [settings.theme.roots.dist],
      }),
    ];

// Bundle Analyzer Plugin
const bundleAnalyzerPlugin = !bundleAnalyzerEnabled
  ? []
  : [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: env === PROD,
        statsFilename: path.resolve(__dirname, 'stats.json'),
      }),
    ];

// Setup to switch between prod and dev for minimize plugins
const minimizer = [
  new TerserJSPlugin({
    extractComments: {
      condition: false,
    },
  }),
  // new OptimizeCSSAssetsPlugin(),
];

const zipPlugin = [
  new FileManagerPlugin({
    events: {
      onStart: {
        delete: ['./dist', './rc.zip'],
      },
      onEnd: {
        copy: [
          { source: './src/assets', destination: './dist/assets' },
          { source: './src/config', destination: './dist/config' },
          { source: './src/layout', destination: './dist/layout' },
          { source: './src/locales', destination: './dist/locales' },
          { source: './src/sections', destination: './dist/sections' },
          { source: './src/snippets', destination: './dist/snippets' },
          { source: './src/templates', destination: './dist/templates' },
        ],
        archive: [{ source: './dist', destination: './rc.zip', format: 'zip' }],
      },
    },
    runTasksInSeries: true,
  }),
];

if (env === DEV) {
  minimizer.shift();
}

if (!zip) {
  zipPlugin.shift();
}

const AfterBuildHook = {
  apply: (compiler) => {
    if (!cli) {
      env === DEV
        ? compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            if (!isRunning) {
              console.log('----------- RELOAD --------');
              const start = exec(
                'npm run theme:deploy && npm run watch:theme:dev:win',
                {
                  shell: true,
                  stdio: 'inherit',
                  stdout: 'inherit',
                }
              );
              start.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                isRunning = false;
              });
            }
            isRunning = true;
          })
        : compiler.hooks.done.tap('AfterEmitPlugin', (compilation) => {
            if (deploy) {
              const start = exec('npm run theme:deploy', {
                shell: true,
                stdio: 'inherit',
                stdout: 'inherit',
              });
              start.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
              });
            }
          });
    } else {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
        if (!isRunning) {
          console.log('----------- Starting Shopify CLI --------');
          const start = exec('cd ./dist && shopify theme serve', {
            shell: true,
            stdio: 'inherit',
            stdout: 'inherit',
          });
          start.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            isRunning = false;
          });
        }
        isRunning = true;
      });
    }
  },
};

export default {
  devtool: env === DEV ? 'eval-source-map' : false,
  entry: {
    ...getLayoutEntrypoints(settings),
    ...getTemplateEntrypoints(settings),
  },
  performance: {
    hints: webpackPerformanceAnalyzerEnabled ? 'error' : 'warning',
    maxAssetSize: 1000000, // Diff set at 300kb but never reached, increased to avoid fail
    maxEntrypointSize: 1000000, // Diff set at 300kb but never reached, increased to avoid fail
    // assetFilter: function assetFilter(assetFilename) {
    //   // Don't count critical files as they are injected into source
    //   return !(/\.map$/.test(assetFilename)) && !(/critical\.js$/.test(assetFilename));
    // },
  },
  mode: env,
  resolve: {
    alias: {
      Scripts: path.resolve(__dirname, './src/scripts/templates'),
      Sections: path.resolve(__dirname, './src/scripts/sections'),
      Components: path.resolve(__dirname, './src/scripts/Components'),
      Styles: path.resolve(__dirname, './src/styles'),
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },
  output: {
    // Config for JS outputs
    filename: '[name].js',
    path: settings.theme.dist.assets,
    publicPath: '',
    chunkFilename: '[name].chunk.[chunkhash:5].js',
  },
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 1000,
  },
  optimization: {
    // Defining more chunks aside from the entry JS points
    minimize: true,
    minimizer,
    splitChunks: {
      cacheGroups: {
        defaultVendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: getChunkName,
          chunks: 'initial',
          priority: 5,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]?ss$/i, // Find all scss imports and convert them to css files
        use: [
          {
            loader: env === DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              url: false,
              sourceMap: env === DEV,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: env === DEV,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    ...bundleAnalyzerPlugin,
    ...cleanDistPlugins,
    ...zipPlugin,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: settings.theme.src.assets,
          to: settings.theme.dist.assets,
        },
        {
          from: settings.theme.src.layout,
          to: settings.theme.dist.layout,
        },
        {
          from: settings.theme.src.locales,
          to: settings.theme.dist.locales,
        },
        {
          from: settings.theme.src.snippets,
          to: settings.theme.dist.snippets,
        },
        {
          from: settings.theme.src.sections,
          to: settings.theme.dist.sections,
        },
        {
          from: settings.theme.src.templates,
          to: settings.theme.dist.templates,
        },
        {
          from: settings.theme.src.config,
          to: settings.theme.dist.config,
        },
        {
          from: settings.theme.src.yml,
          to: settings.theme.dist.yml,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // Combines all css into chunked files
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['static'],
      filename: `${settings.theme.dist.snippets}/script-tags.liquid`,
      template: './lib/script-tags.html',
      inject: false,
      minify:
        env === PROD
          ? {
              ignoreCustomFragments: [
                /<%[\s\S]*?%>/,
                /<\?[\s\S]*?\?>/,
                /{{[\s\S]*?}}/, // Add liquid tags {{ ... }}
                /{%-[\s\S]*?-%}/, // Add liquid tags {%- ... -%}
              ],
              minifyJS: true,
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: false,
            }
          : false,
      isDevServer: false,
      liquidTemplates: getTemplateEntrypoints(settings),
      liquidLayouts: getLayoutEntrypoints(settings),
    }),
    new HtmlWebpackPlugin({
      excludeChunks: ['static'],
      filename: `${settings.theme.dist.snippets}/style-tags.liquid`,
      template: './lib/style-tags.html',
      inject: false,
      minify:
        env === PROD
          ? {
              ignoreCustomFragments: [
                /<%[\s\S]*?%>/,
                /<\?[\s\S]*?\?>/,
                /{{[\s\S]*?}}/, // Add liquid tags {{ ... }}
                /{%-[\s\S]*?-%}/, // Add liquid tags {%- ... -%}
              ],
              minifyJS: true,
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: false,
            }
          : false,
      isDevServer: false,
      liquidTemplates: getTemplateEntrypoints(settings),
      liquidLayouts: getLayoutEntrypoints(settings),
    }),
    // env plugin
    new webpack.DefinePlugin({
      'proccess.env': { NODE_ENV: JSON.stringify(env) },
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: bundleAnalyzerEnabled ? 'server' : 'disabled',
    }),
    AfterBuildHook,
  ],
  node: {
    __dirname: true,
  },
};
