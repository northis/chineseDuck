import { getMode, ModeEnum } from './common';

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

