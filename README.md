# examples for assembling Lively packages

This repo serves as documentation and integration test for building Lively
systems out of the packages that drive Lively.

Currently this includes
[lively.modules](github.com/LivelyKernel/lively.modules) and
[lively.vm](github.com/LivelyKernel/lively.vm).

## lively.modules + lively.vm

### [lively.modules browser](browser/index.html)

Simple web setup of lively.modules that allows to load packages (supporting es6
modules)  and interactively evaluating code.


### [lively.modules browser-bootstrap](browser-bootstrap/index.html)

Similar to the browser example but will load lively.modules and lively.vm itself.


### [lively.modules browser-bootstrap-from-source](browser-bootstrap-from-source/index.html)

Like bootstrap but loads everything without depending on a pre-compiled lively.modules bundle.

### [lively.modules nodejs](nodejs/index.js)

Loads lively.modules into nodejs and is then able to load, isnpect and modify the test-packge. 

Run it with `node nodejs/index.js`

### [lively.modules nodejs bootstrap](nodejs-bootstrap/index.js)

Loading lively.vm and lively.modules themselves in nodejs.

Run it with `node nodejs-bootstrap/index.js`.
