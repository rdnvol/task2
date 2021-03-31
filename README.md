# Draft

## Table of Contents
1. [Setup](#setup)
   * [Dependencies](#dependencies)
   * [Themekit](#themekit)
2. [Getting Started](#getting-started)
   * [Webpack](#webpack)
3. [Commands](#commands)
   * [build](#build)
   * [deploy](#deploy)
   * [watch](#watch)
   * [start](#start)
   * [open](#open)
   * [analyze](#Bundle analyzer)
   * [zip](#zip)
4. [Linters](#linters)

## Setup
Before start make sure you have installed [**ThemeKit**](https://shopify.dev/tools/theme-kit/getting-started) and [**Node js** (higher 12 version)](https://nodejs.org/en/)
### Dependencies
Install project related dependencies

```
npm install or yarn install
```

### Themekit

 Create `.env` file int the root folder with the following properties:

```
PASSWORD=<your_private_app_api_password>
THEME_ID=<a_theme_id_in_online_store>
STORE=<your_myshopify.com_domain> (without http://)
```
You can ask PM to get all these properties or look at **1password**

## Getting Started

### Webpack
Webpack will generate the following snippets that need to be include in Layout files

```
{% render 'script-tags' %}
{% render 'style-tags' %}
```
The layout has to be specified when including the snippet like so
```
# theme.liquid
{%- render 'style-tags', layout: 'theme' -%}
```

#### Entry Points

All JavaScript files in the `src/scripts/layout` and `src/scripts/templates` directories as entry points for Webpack. An entry point must be created for each liquid layout, template file, and alternate templates. A Sass file for each template and layout should also be added to `src/styles/layout` and `src/styles/templates`. These Sass files should be imported in each JavaScript entry file.

* Layout bundles are the main entry points
* Template bundles are secondary entry points
For more information see Webpack [documentation](https://webpack.js.org/concepts/entry-points/) 
  
For example, you want to import styles to theme layout 

`theme.js`
```
import 'Styles/theme.scss';
import ...other js or scss files
```

#### Output Files

Webpack will generate a JavaScript file for each template and layout file in the bundles directory. The CSS files imported in each bundle entry file will also generate CSS files. Webpack will add all output files to `dist/assets` along with sourcemaps if building in `development` mode. 

```
filename: scripts/templates/collection.js
creates file: assets/template.collection.js
```
The following will be auto-generated in the `script-tags` snippet
```
{%- if template == 'collection' -%}
  <script src="{{ 'template.collection.js' | asset_url }}" defer="defer"></script>
{%- else -%}
  <link rel="prefetch" href="{{ 'template.collection.js' | asset_url }}" as="script">
{%- endif -%}
```
The CSS equivalent will also be auto-generated in the `style-tags` snippet

#### Example Project file structure

```
└── src
   └── scripts
   │   ├── layout
   │   │   ├── checkout.js
   │   │   └── theme.js
   │   └── templates
   │       └── customers
   │       │   ├── account.js
   │       │   └── login.js
   │       ├── collection.js
   │       ├── index.js    
   │       └── product.js
   ├── layout
   │   ├── checkout.liquid
   │   └── theme.liquid
   └── templates
       ├── collection.liquid
       ├── index.liquid
       └── product.liquid
```

## Commands
Here is a list of all available commands:
The examples will be shown with using `yarn` for npm users just use `npm run <command-name>`
- [build](#build)
- [deploy](#deploy)
- [watch](#watch)
- [start](#start)
- [open](#open)
- [analyze](#Bundle analyzer)
- [zip](#zip)


### Build
```
yarn build
```
Builds a production version of the theme by compiling the files into the `dist` folder.

### Deploy
```
yarn deploy
```
Builds a production version of the theme and uploads the `dist` folder to the theme mentioned in `.env` file.

### Watch
```
yarn watch 
```
Doesn't build theme, goes to `dist` folder and watches theme files for changes. (useful when changing only `.liquid` for some debugging and quick fixes).
For normal development use `yarn start` instead.

### Start
```
yarn start
```
Builds a development version of the theme, uploads these files to your theme, watches theme files for changes and finally opens theme preview in your browser.

### Open
```
yarn theme:open
```
Opens theme in your browser.

### Bundle analyzer
```
yarn analyze
```
Uses `webpack-bundle-analyzer` plugin
Analyzes the bundles that webpack created. This tool creates a visual mapping of modules
included in a JS bundle.

### Zip
```
yarn zip
```
Creates a ready for deployment `rc.zip` file with all that is in the `dist` folder.

## Linters

### Theme linter
Before start ensure that you have installed [**theme-check**](https://github.com/Shopify/theme-check) and [**Ruby**](https://www.ruby-lang.org/en/) 2.7 or higher
```
yarn lint
```
Builds theme and runs linter for `dist` folder
