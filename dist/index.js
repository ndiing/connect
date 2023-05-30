/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 97878:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(57147);
const vm = __webpack_require__(26144);
const v8 = __webpack_require__(84655);
const path = __webpack_require__(71017);
const Module = __webpack_require__(98188);
const fork = (__webpack_require__(32081).fork);

v8.setFlagsFromString('--no-lazy');

if (Number.parseInt(process.versions.node, 10) >= 12) {
  v8.setFlagsFromString('--no-flush-bytecode'); // Thanks to A-Parser (@a-parser)
}

const COMPILED_EXTNAME = '.jsc';

/**
 * Generates v8 bytecode buffer.
 * @param   {string} javascriptCode JavaScript source that will be compiled to bytecode.
 * @returns {Buffer} The generated bytecode.
 */
const compileCode = function (javascriptCode) {
  if (typeof javascriptCode !== 'string') {
    throw new Error(`javascriptCode must be string. ${typeof javascriptCode} was given.`);
  }

  const script = new vm.Script(javascriptCode, {
    produceCachedData: true
  });

  const bytecodeBuffer = (script.createCachedData && script.createCachedData.call)
    ? script.createCachedData()
    : script.cachedData;

  return bytecodeBuffer;
};

/**
 * This function runs the compileCode() function (above)
 * via a child process usine Electron as Node
 * @param {string} javascriptCode
 * @returns {Promise<Buffer>} - returns a Promise which resolves in the generated bytecode.
 */
const compileElectronCode = function (javascriptCode) {
  return new Promise((resolve, reject) => {
    let data = Buffer.from([]);

    const electronPath = path.join(path.dirname(/*require.resolve*/(49496)), 'cli.js');
    if (!fs.existsSync(electronPath)) {
      throw new Error('Electron not installed');
    }
    const bytenodePath = __webpack_require__.ab + "cli.js";

    // create a subprocess in which we run Electron as our Node and V8 engine
    // running Bytenode to compile our code through stdin/stdout
    const proc = fork(electronPath, [__webpack_require__.ab + "cli.js", '--compile', '--no-module', '-'], {
      env: { ELECTRON_RUN_AS_NODE: '1' },
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    if (proc.stdin) {
      proc.stdin.write(javascriptCode);
      proc.stdin.end();
    }

    if (proc.stdout) {
      proc.stdout.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
      });
      proc.stdout.on('error', (err) => {
        console.error(err);
      });
      proc.stdout.on('end', () => {
        resolve(data);
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (chunk) => {
        console.error('Error: ', chunk.toString());
      });
      proc.stderr.on('error', (err) => {
        console.error('Error: ', err);
      });
    }

    proc.addListener('message', (message) => console.log(message));
    proc.addListener('error', err => console.error(err));

    proc.on('error', (err) => reject(err));
    proc.on('exit', () => { resolve(data); });
  });
};

// TODO: rewrite this function
const fixBytecode = function (bytecodeBuffer) {
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error('bytecodeBuffer must be a buffer object.');
  }

  const dummyBytecode = compileCode('"ಠ_ಠ"');
  const version = parseFloat(process.version.slice(1, 5));

  if (process.version.startsWith('v8.8') || process.version.startsWith('v8.9')) {
    // Node is v8.8.x or v8.9.x
    dummyBytecode.subarray(16, 20).copy(bytecodeBuffer, 16);
    dummyBytecode.subarray(20, 24).copy(bytecodeBuffer, 20);
  } else if (version >= 12 && version <= 20) {
    dummyBytecode.subarray(12, 16).copy(bytecodeBuffer, 12);
  } else {
    dummyBytecode.subarray(12, 16).copy(bytecodeBuffer, 12);
    dummyBytecode.subarray(16, 20).copy(bytecodeBuffer, 16);
  }
};

// TODO: rewrite this function
const readSourceHash = function (bytecodeBuffer) {
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error('bytecodeBuffer must be a buffer object.');
  }

  if (process.version.startsWith('v8.8') || process.version.startsWith('v8.9')) {
    // Node is v8.8.x or v8.9.x
    // eslint-disable-next-line no-return-assign
    return bytecodeBuffer.subarray(12, 16).reduce((sum, number, power) => sum += number * Math.pow(256, power), 0);
  } else {
    // eslint-disable-next-line no-return-assign
    return bytecodeBuffer.subarray(8, 12).reduce((sum, number, power) => sum += number * Math.pow(256, power), 0);
  }
};

/**
 * Runs v8 bytecode buffer and returns the result.
 * @param   {Buffer} bytecodeBuffer The buffer object that was created using compileCode function.
 * @returns {any}    The result of the very last statement executed in the script.
 */
const runBytecode = function (bytecodeBuffer) {
  if (!Buffer.isBuffer(bytecodeBuffer)) {
    throw new Error('bytecodeBuffer must be a buffer object.');
  }

  fixBytecode(bytecodeBuffer);

  const length = readSourceHash(bytecodeBuffer);

  let dummyCode = '';

  if (length > 1) {
    dummyCode = '"' + '\u200b'.repeat(length - 2) + '"'; // "\u200b" Zero width space
  }

  const script = new vm.Script(dummyCode, {
    cachedData: bytecodeBuffer
  });

  if (script.cachedDataRejected) {
    throw new Error('Invalid or incompatible cached data (cachedDataRejected)');
  }

  return script.runInThisContext();
};

/**
 * Compiles JavaScript file to .jsc file.
 * @param   {object|string} args
 * @param   {string}          args.filename The JavaScript source file that will be compiled
 * @param   {boolean}         [args.compileAsModule=true] If true, the output will be a commonjs module
 * @param   {string}          [args.output=filename.jsc] The output filename. Defaults to the same path and name of the original file, but with `.jsc` extension.
 * @param   {boolean}         [args.electron=false] If true, compile code for Electron (which needs to be installed)
 * @param   {boolean|string}  [args.createLoader=false] If true, create a CommonJS loader file. As a string, select between 'module' or 'commonjs' loader.
 * @param   {boolean}         [args.loaderFilename='%.loader.js'] Filename or pattern for generated loader files. Defaults to originalFilename.loader.js. Use % as a substitute for originalFilename.
 * @param   {string}        [output] The output filename. (Deprecated: use args.output instead)
 * @returns {Promise<string>}        A Promise which returns the compiled filename
 */
const compileFile = async function (args, output) {
  let filename, compileAsModule, electron, createLoader, loaderFilename;

  if (typeof args === 'string') {
    filename = args;
    compileAsModule = true;
    electron = false;
    createLoader = false;
  } else if (typeof args === 'object') {
    filename = args.filename;
    compileAsModule = args.compileAsModule !== false;
    electron = args.electron;
    createLoader = args.createLoader;
    loaderFilename = args.loaderFilename;
    if (loaderFilename && !createLoader) createLoader = true;
  }

  if (typeof filename !== 'string') {
    throw new Error(`filename must be a string. ${typeof filename} was given.`);
  }

  if (createLoader && typeof createLoader !== 'string') {
    createLoader = 'commonjs';
  }

  // @ts-ignore
  const compiledFilename = args.output || output || filename.slice(0, -path.extname(filename).length) + COMPILED_EXTNAME;

  if (typeof compiledFilename !== 'string') {
    throw new Error(`output must be a string. ${typeof compiledFilename} was given.`);
  }

  const javascriptCode = fs.readFileSync(filename, 'utf-8');

  let code = javascriptCode.replace(/^#!.*/, '');

  if (compileAsModule) {
    code = Module.wrap(code);
  }

  let bytecodeBuffer;

  if (electron) {
    bytecodeBuffer = await compileElectronCode(code);
  } else {
    bytecodeBuffer = compileCode(code);
  }

  fs.writeFileSync(compiledFilename, bytecodeBuffer);

  if (createLoader) {
    addLoaderFile(compiledFilename, loaderFilename, createLoader);
  }

  return compiledFilename;
};

/**
 * Runs .jsc file and returns the result.
 * @param   {string} filename
 * @returns {any}    The result of the very last statement executed in the script.
 */
const runBytecodeFile = function (filename) {
  if (typeof filename !== 'string') {
    throw new Error(`filename must be a string. ${typeof filename} was given.`);
  }

  const bytecodeBuffer = fs.readFileSync(filename);

  return runBytecode(bytecodeBuffer);
};

Module._extensions[COMPILED_EXTNAME] = function (fileModule, filename) {
  const bytecodeBuffer = fs.readFileSync(filename);

  fixBytecode(bytecodeBuffer);

  const length = readSourceHash(bytecodeBuffer);

  let dummyCode = '';

  if (length > 1) {
    dummyCode = '"' + '\u200b'.repeat(length - 2) + '"'; // "\u200b" Zero width space
  }

  const script = new vm.Script(dummyCode, {
    filename: filename,
    lineOffset: 0,
    displayErrors: true,
    cachedData: bytecodeBuffer
  });

  if (script.cachedDataRejected) {
    throw new Error('Invalid or incompatible cached data (cachedDataRejected)');
  }

  /*
  This part is based on:
  https://github.com/zertosh/v8-compile-cache/blob/7182bd0e30ab6f6421365cee0a0c4a8679e9eb7c/v8-compile-cache.js#L158-L178
  */

  function require (id) {
    return fileModule.require(id);
  }
  require.resolve = function (request, options) {
    // @ts-ignore
    return Module._resolveFilename(request, fileModule, false, options);
  };
  if (process.mainModule) {
    require.main = process.mainModule;
  }

  // @ts-ignore
  require.extensions = Module._extensions;
  // @ts-ignore
  require.cache = Module._cache;

  const compiledWrapper = script.runInThisContext({
    filename: filename,
    lineOffset: 0,
    columnOffset: 0,
    displayErrors: true
  });

  const dirname = path.dirname(filename);

  const args = [fileModule.exports, require, fileModule, filename, dirname, process, global];

  return compiledWrapper.apply(fileModule.exports, args);
};

/**
 * Add a loader file for a given .jsc file
 * @param {String} fileToLoad path of the .jsc file we're loading
 * @param {String} loaderFilename - optional pattern or name of the file to write - defaults to filename.loader.js. Patterns: "%" represents the root name of .jsc file.
 * @param {string} type select between 'module' or 'commonjs' loader.
 */
const addLoaderFile = function (fileToLoad, loaderFilename, type) {
  let loaderFilePath;
  if (typeof loaderFilename === 'boolean' || loaderFilename === undefined || loaderFilename === '') {
    loaderFilePath = fileToLoad.replace('.jsc', '.loader.js');
  } else {
    loaderFilename = loaderFilename.replace('%', path.parse(fileToLoad).name);
    loaderFilePath = path.join(path.dirname(fileToLoad), loaderFilename);
  }
  const loaderCode = type === 'module' ? loaderCodeModule : loaderCodeCommonJS;
  const relativePath = path.relative(path.dirname(loaderFilePath), fileToLoad);
  const code = loaderCode('./' + relativePath, loaderFilePath);
  fs.writeFileSync(loaderFilePath, code);
};

const loaderCodeCommonJS = function (targetPath) {
  return [
    `require('bytenode')`,
    ``,
    `module.exports = require('${targetPath}')`
  ].join('\n');
};

const loaderCodeModule = function (targetPath, loaderFilePath) {
  // TODO: Based on the spec, should we keep `default` as part of named exports?
  let { default: defaultExport, ...namedExports } = require(loaderFilePath)

  defaultExport = defaultExport ? 'default: defaultExport' : ''
  namedExports = Object.keys(namedExports)

  const lines = [
    `import { createRequire } from 'node:module'`,
    ``,
    `import 'bytenode'`,
    ``,
    ``,
    `const require = createRequire(import.meta.url)`,
    ``
  ]

  let exports = namedExports
  if (defaultExport) exports.unshift(defaultExport)
  exports = exports.join(', ')

  if (!exports)
    lines.push(`require('${targetPath}')`)
  else {
    lines.push(`const {${exports}} = require('${targetPath}')`, ``, ``)

    if (defaultExport) lines.push('export default defaultExport')
    if (namedExports) lines.push(`export {${namedExports}}`)
  }

  return lines.join('\n');
};

global.bytenode = {
  compileCode,
  compileFile,
  compileElectronCode,
  runBytecode,
  runBytecodeFile,
  addLoaderFile,
  loaderCode: loaderCodeCommonJS,
  loaderCodeCommonJS,
  loaderCodeModule
};

module.exports = global.bytenode;


/***/ }),

/***/ 19651:
/***/ ((module) => {

"use strict";
module.exports = require("./index.compiled.jsc");

/***/ }),

/***/ 49496:
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ 32081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 57147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 98188:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 71017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 84655:
/***/ ((module) => {

"use strict";
module.exports = require("v8");

/***/ }),

/***/ 26144:
/***/ ((module) => {

"use strict";
module.exports = require("vm");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __webpack_require__ !== 'undefined') __webpack_require__.ab = __dirname + "//";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__(97878);
__webpack_require__(19651);
})();

module.exports = __webpack_exports__;
/******/ })()
;