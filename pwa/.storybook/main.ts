import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    // Match the @ path alias from Next.js tsconfig
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, ".."),
    };

    // Point PostCSS to the pwa root where postcss.config.mjs lives
    config.css = config.css || {};
    config.css.postcss = resolve(__dirname, "..");

    // Enable automatic JSX runtime so components don't need `import React`
    // (Next.js does this automatically, but Vite needs explicit config)
    config.esbuild = {
      ...config.esbuild,
      jsx: "automatic",
    };

    return config;
  },
};
export default config;
