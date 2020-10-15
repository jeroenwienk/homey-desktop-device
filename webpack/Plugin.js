// copy-modules-webpack-plugin
const path = require('path');

class Plugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      const fileDependencies = new Set();

      compilation.modules.forEach((module) =>
        (module.buildInfo.fileDependencies || []).forEach(
          fileDependencies.add.bind(fileDependencies)
        )
      );

      [...fileDependencies].forEach((file) => {
        const relativePath = replaceParentDirReferences(
          path.relative(process.cwd(), file)
        );
        //console.log(relativePath);
      });

      callback();
    });

    compiler.hooks.normalModuleFactory.tap('IgnorePlugin', (nmf) => {
      //console.log(nmf);
      nmf.hooks.beforeResolve.tap('IgnorePlugin', checkIgnore);
    });

    compiler.hooks.contextModuleFactory.tap('IgnorePlugin', (cmf) => {
      //console.log(cmf);
      cmf.hooks.beforeResolve.tap('IgnorePlugin', checkIgnore);
    });
  }
}

function checkIgnore(resolveData) {
  //console.log(resolveData.request);
  //console.log(resolveData.context);
}

function replaceParentDirReferences(inputPath) {
  const pathParts = inputPath.split(path.sep);

  return pathParts
    .map((part) => (part === '..' ? '__..__' : part))
    .join(path.sep);
}

module.exports = Plugin;
