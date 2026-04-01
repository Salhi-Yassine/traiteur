import type { Preview } from "@storybook/react";
import "../styles/globals.css";

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
};

export default preview;
