export const ModeEnum = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
};

export function getMode() {
  var indexModeArg = process.argv.indexOf('--mode');
  if (indexModeArg != -1) {
    var mode = process.argv[indexModeArg + 1];
    return mode == undefined ? ModeEnum.Development : mode;
  }
}

export function getFontCopyPattern() {
  if (getMode() === ModeEnum.Production)
    return { from: './src/assets/fonts', to: './fonts/' }
  else
    return { from: './src/assets/fonts/aleo-regular-webfont.ttf', to: './fonts/aleo-regular-webfont.ttf' }
}

