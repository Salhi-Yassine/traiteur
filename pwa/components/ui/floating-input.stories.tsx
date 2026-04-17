import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FloatingInput } from "./floating-input";

const meta: Meta<typeof FloatingInput> = {
    title: "UI/FloatingInput",
    component: FloatingInput,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Airbnb-style floating-label input. The label lives inside the box and rises to the top corner on focus or when the field has a value. Terracotta accent throughout — no mixed colours.",
            },
        },
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-[400px] p-6 bg-white rounded-2xl shadow">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof FloatingInput>;

export const Default: Story = {
    args: {
        id: "email",
        label: "Adresse email",
    },
};

export const WithValue: Story = {
    args: {
        id: "email-filled",
        label: "Adresse email",
        defaultValue: "yasmine@exemple.ma",
    },
};

export const WithError: Story = {
    args: {
        id: "email-error",
        label: "Adresse email",
        defaultValue: "not-an-email",
        error: "Adresse email invalide",
    },
};

function PasswordStory() {
    const [show, setShow] = useState(false);
    return (
        <FloatingInput
            id="password"
            label="Mot de passe"
            type={show ? "text" : "password"}
            trailingSlot={
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Masquer" : "Afficher"}
                    className="p-1 rounded-full text-[#484848] hover:text-[#E8472A] transition-colors"
                >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            }
        />
    );
}

export const Password: Story = {
    render: () => <PasswordStory />,
};

export const Disabled: Story = {
    args: {
        id: "disabled",
        label: "Champ désactivé",
        disabled: true,
        defaultValue: "Valeur existante",
    },
};
