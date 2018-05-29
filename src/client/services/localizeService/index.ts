import { injectable } from 'inversify';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import * as T from '../../types/interfaces';

@injectable()
export class LocalizeService extends VueI18n implements T.ILocalizeService {

    private static GetMessagesDictionary(): VueI18n.LocaleMessages {
        return JSON.parse(JSON.stringify(require('./dic.json'))) as VueI18n.LocaleMessages;
    }

    constructor(language: string) {
        super({
            locale: language,
            messages: LocalizeService.GetMessagesDictionary(),
        });
        Vue.use(VueI18n);
    }

    public t(key: string): string {
        return super.t(key).toString();
    }
}
