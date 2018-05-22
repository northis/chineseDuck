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
export function isDebug() {
  return getMode() !== ModeEnum.Production;
}

export function isVerbose() {
  return process.argv.includes('--verbose');
}

export function isAnalyze() {
  return process.argv.includes('--analyze') || process.argv.includes('--analyse');
}

export function getFontCopyPattern() {
  if (getMode() === ModeEnum.Production)
    return { from: './src/assets/fonts', to: './fonts/' }
  else
    return { from: './src/assets/fonts/aleo-regular-webfont.ttf', to: './fonts/aleo-regular-webfont.ttf' }
}

export function overrideRules(rules, patch) {
  return rules.map(ruleToPatch => {
    let rule = patch(ruleToPatch);
    if (rule.rules) {
      rule = { ...rule, rules: overrideRules(rule.rules, patch) };
    }
    if (rule.oneOf) {
      rule = { ...rule, oneOf: overrideRules(rule.oneOf, patch) };
    }
    return rule;
  });
}

