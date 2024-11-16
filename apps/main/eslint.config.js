import baseConfig, { restrictEnvAccess } from "@bt/eslint-config/base";
import nextjsConfig from "@bt/eslint-config/nextjs";
import reactConfig from "@bt/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
