/* eslint-disable max-lines */
// import all namespaces English
import brain_en from "@/public/locales/en/brain.json";
import chat_en from "@/public/locales/en/chat.json";
import config_en from "@/public/locales/en/config.json";
import contact_en from "@/public/locales/en/contact.json";
import delete_brain_en from "@/public/locales/en/deleteOrUnsubscribeFromBrain.json";
import explore_en from "@/public/locales/en/explore.json";
import external_api_definition_en from "@/public/locales/en/external_api_definition.json";
import home_en from "@/public/locales/en/home.json";
import invitation_en from "@/public/locales/en/invitation.json";
import knowlegde_en from "@/public/locales/en/knowledge.json";
import login_en from "@/public/locales/en/login.json";
import logout_en from "@/public/locales/en/logout.json";
import monetization_en from "@/public/locales/en/monetization.json";
import translation_en from "@/public/locales/en/translation.json";
import upload_en from "@/public/locales/en/upload.json";
import user_en from "@/public/locales/en/user.json";
// import all namespaces Spanish
import brain_es from "@/public/locales/es/brain.json";
import chat_es from "@/public/locales/es/chat.json";
import config_es from "@/public/locales/es/config.json";
import contact_es from "@/public/locales/es/contact.json";
import delete_brain_es from "@/public/locales/es/deleteOrUnsubscribeFromBrain.json";
import explore_es from "@/public/locales/es/explore.json";
import external_api_definition_es from "@/public/locales/es/external_api_definition.json";
import home_es from "@/public/locales/es/home.json";
import invitation_es from "@/public/locales/es/invitation.json";
import knowlegde_es from "@/public/locales/es/knowledge.json";
import login_es from "@/public/locales/es/login.json";
import logout_es from "@/public/locales/es/logout.json";
import monetization_es from "@/public/locales/es/monetization.json";
import translation_es from "@/public/locales/es/translation.json";
import upload_es from "@/public/locales/es/upload.json";
import user_es from "@/public/locales/es/user.json";
// import all namespaces French
import brain_fr from "@/public/locales/fr/brain.json";
import chat_fr from "@/public/locales/fr/chat.json";
import config_fr from "@/public/locales/fr/config.json";
import contact_fr from "@/public/locales/fr/contact.json";
import delete_brain_fr from "@/public/locales/fr/deleteOrUnsubscribeFromBrain.json";
import explore_fr from "@/public/locales/fr/explore.json";
import external_api_definition_fr from "@/public/locales/fr/external_api_definition.json";
import home_fr from "@/public/locales/fr/home.json";
import invitation_fr from "@/public/locales/fr/invitation.json";
import knowlegde_fr from "@/public/locales/fr/knowledge.json";
import login_fr from "@/public/locales/fr/login.json";
import logout_fr from "@/public/locales/fr/logout.json";
import monetization_fr from "@/public/locales/fr/monetization.json";
import translation_fr from "@/public/locales/fr/translation.json";
import upload_fr from "@/public/locales/fr/upload.json";
import user_fr from "@/public/locales/fr/user.json";

//type all translations
export type Translations = {
  brain: typeof import("@/public/locales/en/brain.json");
  chat: typeof import("@/public/locales/en/chat.json");
  config: typeof import("@/public/locales/en/config.json");
  contact: typeof import("@/public/locales/en/contact.json");
  delete_or_unsubscribe_from_brain: typeof import("@/public/locales/en/deleteOrUnsubscribeFromBrain.json");
  explore: typeof import("@/public/locales/en/explore.json");
  home: typeof import("@/public/locales/en/home.json");
  invitation: typeof import("@/public/locales/en/invitation.json");
  login: typeof import("@/public/locales/en/login.json");
  logout: typeof import("@/public/locales/en/logout.json");
  monetization: typeof import("@/public/locales/en/monetization.json");
  translation: typeof import("@/public/locales/en/translation.json");
  upload: typeof import("@/public/locales/en/upload.json");
  user: typeof import("@/public/locales/en/user.json");
  knowledge: typeof import("@/public/locales/en/knowledge.json");
  external_api_definition: typeof import("@/public/locales/en/external_api_definition.json");
};

enum SupportedLanguages {
  en = "en",
  es = "es",
  fr = "fr",
}

export const defaultNS = "translation";
export const resources: Record<SupportedLanguages, Translations> = {
  en: {
    brain: brain_en,
    chat: chat_en,
    config: config_en,
    contact: contact_en,
    explore: explore_en,
    home: home_en,
    invitation: invitation_en,
    login: login_en,
    logout: logout_en,
    monetization: monetization_en,
    translation: translation_en,
    upload: upload_en,
    user: user_en,
    delete_or_unsubscribe_from_brain: delete_brain_en,
    knowledge: knowlegde_en,
    external_api_definition: external_api_definition_en,
  },
  es: {
    brain: brain_es,
    chat: chat_es,
    config: config_es,
    contact: contact_es,
    explore: explore_es,
    home: home_es,
    invitation: invitation_es,
    login: login_es,
    logout: logout_es,
    monetization: monetization_es,
    translation: translation_es,
    upload: upload_es,
    user: user_es,
    delete_or_unsubscribe_from_brain: delete_brain_es,
    knowledge: knowlegde_es,
    external_api_definition: external_api_definition_es,
  },
  fr: {
    brain: brain_fr,
    chat: chat_fr,
    config: config_fr,
    contact: contact_fr,
    explore: explore_fr,
    home: home_fr,
    invitation: invitation_fr,
    login: login_fr,
    logout: logout_fr,
    monetization: monetization_fr,
    translation: translation_fr,
    upload: upload_fr,
    user: user_fr,
    delete_or_unsubscribe_from_brain: delete_brain_fr,
    knowledge: knowlegde_fr,
    external_api_definition: external_api_definition_fr,
  },
} as const;
