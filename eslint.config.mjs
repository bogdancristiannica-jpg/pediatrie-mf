// Fișierele din src/ sunt scripturi clasice concatenate într-un singur <script> la build,
// deci împart același spațiu de nume. Numele comune sunt declarate aici ca globale.
import js from "@eslint/js";
import globals from "globals";

const shared = {
  G: "readonly",
  NICE: "readonly",
  C: "readonly",
  NEWS: "readonly",
  ABX: "readonly",
  EXCL: "readonly",
  AMBER: "readonly",
  RED: "readonly",
  CENTOR: "readonly",
  FP: "readonly",
  CDS: "readonly",
  $: "readonly",
  esc: "readonly",
  fmt: "readonly",
  norm: "readonly",
  byId: "readonly",
  CALC: "readonly",
  calcOut: "readonly",
  viewCalc: "readonly",
  calcGroups: "readonly",
  ageMonths: "readonly",
  ageLabel: "readonly",
  SC: "readonly",
  scoreOut: "readonly",
  viewScores: "readonly",
  checks: "readonly",
  viewAbx: "readonly",
  viewAlarm: "readonly",
  viewExcl: "readonly",
  module: "writable",
};

export default [
  { ignores: ["dist/", "node_modules/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: { ...globals.browser, ...shared } },
    rules: {
      "no-redeclare": ["error", { builtinGlobals: false }],
      "no-unused-vars": ["error", { varsIgnorePattern: "^(view|calc|score|checks|CALC|SC|G|NICE|C|NEWS|ABX|EXCL|AMBER|RED|CENTOR|FP|CDS)" }],
    },
  },
  {
    files: ["src/sw.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: globals.serviceworker },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.{js,mjs}", "*.config.mjs"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { ...globals.node, ...globals.browser } },
  },
];
