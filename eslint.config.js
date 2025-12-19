import astroPlugin from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import astroParser from "astro-eslint-parser"; // Indispensable

export default [
  // 1. Configuration pour les fichiers TypeScript/JS standards
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      sourceType: "module",
    },
  },

  // 2. Configuration spécifique pour Astro
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser, // Utilise le parser Astro
      parserOptions: {
        parser: tseslint.parser, // Utilise TS pour la partie script d'Astro
        extraFileExtensions: [".astro"],
      },
    },
  },

  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  eslintConfigPrettier, // Toujours en dernier pour désactiver les règles conflictuelles

  {
    rules: {
      // Tu peux ajouter tes règles personnalisées ici
      "astro/no-set-html-directive": "error",
    },
  },
];
