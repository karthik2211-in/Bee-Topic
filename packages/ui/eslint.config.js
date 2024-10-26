import baseConfig from "@bt/eslint-config/base";
import reactConfig from "@bt/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
