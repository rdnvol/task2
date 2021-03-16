const fs = require('fs');
const path = require('path');

module.exports = (settings) => {
  const entrypoints = {};

  fs.readdirSync(settings.theme.src.layout).forEach((file) => {
    const { name } = path.parse(file);
    const jsFile = path.join(
      settings.theme.src.scripts,
      'layout',
      `${name}.js`,
    );
    if (fs.existsSync(jsFile)) {
      entrypoints[`layout.${name}`] = jsFile;
    }
  });
  console.warn('entrypoints', entrypoints);
  return entrypoints;
};
