import config from "@noria/eslint-config";

const eslintConfig = [
  ...config,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default eslintConfig;
