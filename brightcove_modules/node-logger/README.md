# node-logger
Simple Winston-based logger to replace `console`.

![screenshot](./screenshot.png?raw=true)

## Usage

```js
var logger = require('node-logger')(module);

logger.debug('foo');
logger.info('foo');
logger.warn('foo');
logger.error('foo', {});
```

## Configuration

```js
var logger = require('node-logger');

logger.init({
  // The minimum level to start logging at. Defaults to the lowest level (http)
  // but can be one of: http, debug, info, warn, error
  level: 'http',

  // The root directory where the code is located. Default is 'server'.
  // This is used to generate the path of the calling file for display
  // in the output
  rootDir: 'server',

  // Extra options to pass to the winston Logger constructor
  winston: {}
})
```
