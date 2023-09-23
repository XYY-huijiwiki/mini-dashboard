/**
 * Creates an object of language packs from the `locales` directory.
 * @returns {Object} An object containing language packs.
 */
const langPacks = Object.fromEntries(
  Object.entries(
    import.meta.glob("@/locales/*.json", {
      import: "default",
    }),
  ).map(([path, langPack]) => {
    // Extract the language code from the file path.
    const langCode = path.split("/").reverse()[0].replace(".json", "");
    return [langCode, langPack];
  }),
) as {
  [k: string]: () => Promise<typeof import("@/locales/en.json")>;
};

/**
 * An array of supported languages from the language packs.
 * @type {string[]}
 */
const supportedLangs: string[] = Object.keys(langPacks);

const userLangs = navigator.languages.map((lang) => lang.slice(0, 2));

/**
 * the most suitable language code for the user amoung the supported languages.
 * @type {string}
 * @default "en"
 **/
let langCode: string = "en";
for (let i = 0; i < userLangs.length; i++) {
  if (supportedLangs.includes(userLangs[i])) {
    langCode = userLangs[i];
    break;
  }
}

/**
 * Exports the language packs and supported languages for use in other modules.
 */
export { langPacks, supportedLangs, langCode };
