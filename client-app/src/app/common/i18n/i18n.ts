import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import common_en from './locales/en/common.json';
import errors_en from './locales/en/errors.json';
import photos_en from './locales/en/photos.json';
import profile_en from './locales/en/profile.json';
import registration_en from './locales/en/registration.json';
import createCustomer_en from './locales/en/createCustomer.json';
import updateCustomer_en from './locales/en/updateCustomer.json';

//import states_en from './locales/en/states.json';
import users_en from './locales/en/users.json';
import common_es from './locales/es/common.json';

export const resources ={
  en: {
    common: common_en,
    errors: errors_en,
    photos: photos_en,
    profile: profile_en,
    registration: registration_en,
    create_customer: createCustomer_en,
    update_customer: updateCustomer_en,
    //states: states_en,
    users: users_en
  },
  es: {
    common: common_es,
  }
} as const;


i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  //.use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",
    debug: true,
    resources,
    ns: ["common", "errors", "users", "registration", "profile", "create_customer","update_customer"],
    defaultNS: "common",
    lng: navigator.language,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
