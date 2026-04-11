import type { Meta, StoryObj } from "@storybook/react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";

/** Mock user shape matching AuthContextType */
const mockUser = {
  id: "1",
  email: "yassine@farah.ma",
  firstName: "Yassine",
  lastName: "Salhi",
  userType: "couple" as const,
};

const withAuth = (user: typeof mockUser | null, isLoading = false) =>
  function AuthDecorator(Story: React.ComponentType) {
    return (
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          login: async () => {},
          register: async () => {},
          logout: () => {},
        }}
      >
        <Story />
      </AuthContext.Provider>
    );
  };

const meta: Meta<typeof Navbar> = {
  title: "Layout/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

/** Transparent — as seen over the homepage hero */
export const Transparent: Story = {
  decorators: [
    withAuth(null),
    (Story) => (
      <div
        style={{
          background: "linear-gradient(135deg, #2d1a0e 0%, #8b4513 100%)",
          minHeight: "200px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Solid — after scrolling past 80 px or on any non-home page */
export const Solid: Story = {
  decorators: [
    withAuth(null),
    (Story) => (
      // Simulate scrolled state by passing a pre-scrolled inner div
      // Navbar reads window.scrollY; we override isSolid via a page path
      <div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    // Storybook router mock is already set to pathname "/", so
    // we override it to a non-home path to force the solid style.
    nextjs: { router: { pathname: "/vendors" } },
  },
};

/** Logged in — shows user first name + logout link */
export const LoggedIn: Story = {
  decorators: [withAuth(mockUser)],
};

/** Loading state — skeleton while JWT is being verified */
export const Loading: Story = {
  decorators: [withAuth(null, true)],
};

/** Mobile viewport */
export const Mobile: Story = {
  decorators: [withAuth(null)],
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
