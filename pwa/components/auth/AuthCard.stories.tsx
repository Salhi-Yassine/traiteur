import type { Meta, StoryObj } from "@storybook/react";
import { AuthCard } from "./AuthCard";

const meta: Meta<typeof AuthCard> = {
    title: "Auth/AuthCard",
    component: AuthCard,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "light-sand",
            values: [{ name: "light-sand", value: "#F7F7F7" }],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const Default: Story = {
    args: {
        closeHref: "/",
        children: (
            <div className="space-y-4">
                <p className="font-display text-[26px] text-[#1A1A1A] leading-tight">
                    Bienvenue !
                </p>
                <p className="text-[14px] text-[#717171]">
                    Contenu de la page auth ici.
                </p>
            </div>
        ),
    },
};

export const BackToLogin: Story = {
    args: {
        closeHref: "/auth/login",
        closeLabelKey: "auth.back_to_login",
        children: (
            <div className="space-y-4">
                <p className="font-display text-[26px] text-[#1A1A1A] leading-tight">
                    Mot de passe oublié
                </p>
                <p className="text-[14px] text-[#717171]">
                    Contenu de la page mot de passe oublié ici.
                </p>
            </div>
        ),
    },
};
