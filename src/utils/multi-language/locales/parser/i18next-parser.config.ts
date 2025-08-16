module.exports = {
  locales: ["en"],
  defaultNamespace: "common",
  output: "src/components/language-switch/locales/$LOCALE-$NAMESPACE.json",
  input: ["src/**/*.{js,jsx,ts,tsx}"],
};


// how to use:
// 1. copy this file to src/../
// 2. npx i18next 'src/**/*.{js,jsx,ts,tsx}'
// this will generate files of JSON Sources for i18next


