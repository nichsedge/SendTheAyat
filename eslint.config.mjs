import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
  },
  nextPlugin.flatConfig.recommended,
  nextPlugin.flatConfig.coreWebVitals,
];

