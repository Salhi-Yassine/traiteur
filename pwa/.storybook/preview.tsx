import React from "react";
import type { Preview } from "@storybook/react";
import "../styles/globals.css";

import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  push: async () => true,
  replace: async () => true,
  reload: () => null,
  back: () => null,
  prefetch: async () => undefined,
  beforePopState: () => null,
  events: {
    on: () => null,
    off: () => null,
    emit: () => null,
  },
  isFallback: false,
  locale: 'fr',
  locales: ['fr', 'ar', 'ary'],
  defaultLocale: 'fr',
  domainLocales: [],
  isPreview: false,
  isExternal: false,
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#FFFFFF" },
        { name: "neutral-100", value: "#F7F7F7" },
        { name: "dark", value: "#1A1A1A" },
      ],
    },
    layout: "centered",
  },
  decorators: [
    (Story: any) => (
      <RouterContext.Provider value={mockRouter as any}>
        <Story />
      </RouterContext.Provider>
    ),
  ],
};

export default preview;
