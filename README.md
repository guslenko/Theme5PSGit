# Custom ceres 5 theme

## Override components using the .vue files instead of twig

Inside /resources/js/src/app you can edit ceres vue components directly.

## Custom CSS / JS

Use /resources/js/main.js || /resources/css/main.css for custom css / js. If you want to do this, you should extend the build process to handle your source files aswell.

## Building

``` bash
# install dependencies
$ cd npm i

# build for production and for development
$ npm run build

# build for production
$ npm run build:prod

# build for development
$ npm run build:dev
```