import VeeValidate from "vee-validate";
import Vue from "vue";

export function InitValidation() {
  const config = {
    aria: true,
    classNames: {},
    classes: false,
    delay: 0,
    dictionary: null,
    errorBagName: "errors", // change if property conflicts
    events: "input|blur",
    fieldsBagName: "fields",
    i18n: null, // the vue-i18n plugin instance
    i18nRootKey: "validations", // the nested key under which the validation messsages will be located
    inject: true,
    locale: "en",
    strict: true,
    validity: false
  };

  Vue.use(VeeValidate, config);
}
