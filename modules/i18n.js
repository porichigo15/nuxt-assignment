import en from './translation/en.json'
import th from './translation/th.json'

export default {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    vueI18n: {
        fallbackLocale: 'en',
        messages: {
            en: en,
            th: th
        }
    }
}