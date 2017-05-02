# babel-preset-es2015-nostrict

> Babel preset for all es2015 plugins, without global 'use strict' statement.

## Install

```sh
$ npm install --save-dev babel-preset-es2015-nostrict
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["es2015-nostrict"]
}
```

### Via CLI

```sh
$ babel script.js --presets es2015-nostrict 
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  presets: ["es2015-nostrict"]
});
```
