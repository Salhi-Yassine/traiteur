import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

const meta: Meta<typeof Alert> = {
  title: "Design System/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Visual intent",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Votre mariage est enregistré</AlertTitle>
      <AlertDescription>
        Vous pouvez maintenant gérer votre liste d&apos;invités et votre budget.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de connexion</AlertTitle>
      <AlertDescription>
        Email ou mot de passe incorrect. Veuillez réessayer.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Devis envoyé avec succès !</AlertTitle>
    </Alert>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Mise à jour disponible</AlertTitle>
      <AlertDescription>
        Une nouvelle version de l&apos;application est disponible.
      </AlertDescription>
    </Alert>
  ),
};
