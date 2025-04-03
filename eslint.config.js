import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    semi: true,
    indent: 2,
    quotes: "double",
  },
  rules: {
    "ts/method-signature-style": "off",
    "unused-imports/no-unused-vars": "off",
    "style/brace-style": ["error", "allman"],
    "ts/explicit-member-accessibility": "error",

    "test/prefer-lowercase-title": "off",
  },
}, {
  files: ["**/*.test.ts"],
  rules: {
    "ts/explicit-member-accessibility": "off",
  },
});
