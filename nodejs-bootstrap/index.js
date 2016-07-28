require("systemjs");
require("lively.modules");

Promise.resolve()
  .then(() => lively.modules.importPackage("node_modules/lively.vm"))
  .then(() => lively.modules.importPackage("node_modules/lively.modules"))
  .then(() => {
    log(`Successfully bootstrapped lively.system`);
    
    printModuleState("lively.modules");
    printModuleState("lively.vm");
  })
  .catch(err => {
    if (err.originalErr) log(err.originalErr.stack);
    log(err.stack || err);
    log(systemConfPrint());
  });

function printModuleState(name) {
  var env = lively.modules.module(System.normalizeSync(name)),
      state = lively.lang.obj.inspect(env.recorder, {maxDepth: 1});
  log(`${name} runtime state: ${state}`)
}

function systemConfPrint() {
  var S = System;
  var json = {
    baseURL: S.baseURL,
    transpiler: S.transpiler,
    defaultJSExtensions: S.defaultJSExtensions,
    map: S.map,
    meta: S.meta,
    packages: S.packages,
    paths: S.paths,
    packageConfigPaths: S.packageConfigPaths,
  }
  return JSON.stringify(json, null, 2);
}

function log(msg) {
  console.log(msg);
  var stringified = typeof msg === "object" ? JSON.stringify(msg, null, 2) : String(msg);
}
