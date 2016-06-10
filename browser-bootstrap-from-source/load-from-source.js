// lively.vm.es6._init();
// lively.modules.System.import("lively.ast/index.js").then(ast => lively.ast = ast).catch(show.curry("%s"))
// lively.modules.System.import("lively.vm/index.js").then(m => { lively.vm = m; lively.lang.VM = m }).catch(show.curry("%s"))
// System.import("http://localhost:9001/lively.modules/index.js").then(m => lively.modules = m).catch(show.curry("%s"))

var isNode = typeof process !== "undefined" && process.platform && typeof require !== "undefined";
var GLOBAL = isNode ? global : window;

if (isNode && !GLOBAL.System) require("systemjs");

var oldSystem = System;
GLOBAL.System = new (GLOBAL.System.constructor)(); // new system for bootstrap

var systemDir = (function computeLivelyModulesDir() {
  if (isNode) return "file://" + __dirname;

  if (typeof document !== "undefined") {
    var loadScript = [].slice.apply(document.querySelectorAll("script")).find(script => script.src.match(/load-from-source.js$/));
    if (loadScript)
      return loadScript.src.split("/").slice(0,-1).join("/") + "/..";
  }
  
  return URL.root ?
    URL.root.withFilename("lively.modules-examples").toString() :
    document.location.origin + "/lively.modules-examples";
  
})();

console.log("determined system dir as %s", systemDir);

System.normalizeSync = wrap(System.normalizeSync, function(proceed, name, parentName, isPlugin) {
  return fixNormalizeResult(proceed(name = fixNormalizeInput(name, parentName), parentName, isPlugin))
});

System.normalize = wrap(System.normalize, function(proceed, name, parentName, parentAddress) {
  var System = this;
  return proceed(name = fixNormalizeInput(name, parentName), parentName, parentAddress)
    .then(fixNormalizeResult)
});

function fixNormalizeInput(name, parent) {
  if (name === "..") return "../index.js";
  return name;
}

function fixNormalizeResult(normalized) {
  var base = normalized.replace(/\.js$/, "").replace(/([^:])\/[\/]+/g, "$1/");
  if (base in System.packages) {
    var main = System.packages[base].main;
    if (main) {
      return base.replace(/\/$/, "") + "/" + main.replace(/^\.?\//, "");
    }
  }
  return normalized;
}

System.config({
  baseURL: isNode ? "file://" + __dirname.replace(/\/$/, "") : "/",
  defaultJSExtensions: true,
  transpiler: oldSystem.transpiler,
  babelOptions: oldSystem.babelOptions,
  map: {
    // 'plugin-babel': systemDir + "/node_modules/lively.modules/node_modules/systemjs-plugin-babel/plugin-babel.js",
    // 'systemjs-babel-build': systemDir + "/node_modules/lively.modules/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js",
    'plugin-babel': oldSystem.map['plugin-babel'],
    'systemjs-babel-build': oldSystem.map['systemjs-babel-build'],
    "lively.lang": systemDir + "/node_modules/lively.modules/node_modules/lively.lang/index.js",
    "lively.ast": systemDir + "/node_modules/lively.modules/node_modules/lively.ast/index.js",
    "lively.vm": systemDir + "/node_modules/lively.vm/index.js",
    "lively.modules": systemDir + "/node_modules/lively.modules/index.js",
      "path": "@empty",
      "fs": "@empty",
      "events": "@empty",
      "util": "@empty",
      "os": "@empty",
      "child_process": "@empty",
  },
  meta: {
    "https://cdnjs.cloudflare.com/ajax/libs/fetch/0.11.0/fetch.js": {
      "format": "global",
      "exports": "fetch"
    }
  },
  packages: {
    [systemDir +"/node_modules/lively.modules/node_modules/lively.lang"]: {main: "index.js"},
    [systemDir +"/node_modules/lively.modules/node_modules/lively.ast"]: {main: "index.js"},
    [systemDir +"/node_modules/lively.vm"]: {main: "index.js"},
  },
  packageConfigPaths: [
    systemDir +"/package.json",
    systemDir +"/node_modules/lively.modules/node_modules/lively.lang/package.json",
    systemDir +"/node_modules/lively.modules/node_modules/lively.ast/package.json",
    systemDir +"/node_modules/lively.vm/package.json",
    systemDir +"/node_modules/lively.ast/node_modules/acorn/package.json"
  ]
})

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

function wrap(func, wrapper) {
  // A `wrapper` is another function that is being called with the arguments
  // of `func` and a proceed function that, when called, runs the originally
  // wrapped function.
  // Example:
  // function original(a, b) { return a+b }
  // var wrapped = fun.wrap(original, function logWrapper(proceed, a, b) {
  //   alert("original called with " + a + "and " + b);
  //   return proceed(a, b);
  // })
  // wrapped(3,4) // => 7 and a message will pop up
  var __method = func;
  var wrappedFunc = function wrapped() {
    var args = Array.prototype.slice.call(arguments);
    var wrapperArgs = wrapper.isWrapper ? args : [__method.bind(this)].concat(args);
    return wrapper.apply(this, wrapperArgs);
  };
  wrappedFunc.isWrapper = true;
  wrappedFunc.originalFunction = __method;
  return wrappedFunc;
}
