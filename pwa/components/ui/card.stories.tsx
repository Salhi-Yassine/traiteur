import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

// ─── Basic card ───
export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 380 }}>
      <CardHeader>
        <CardTitle>Palais des Roses</CardTitle>
        <CardDescription>Un cadre idyllique pour votre mariage de rêve à Casablanca</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "#717171" }}>
          Salle de fête avec capacité de 500 personnes, jardin intérieur et parking privé.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm">Voir le profil</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Card with hover effect ───
export const WithHover: Story = {
  render: () => (
    <Card className="card-hover cursor-pointer" style={{ maxWidth: 380 }}>
      <CardHeader>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <Badge variant="category">Photographe</Badge>
          <Badge variant="verified">✓ Vérifié</Badge>
        </div>
        <CardTitle>Studio Lumière</CardTitle>
        <CardDescription>Photographie de mariage haut de gamme — Marrakech</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: "#717171" }}>
          Hover this card to see the shadow-1 → shadow-2 lift effect with -2px Y-translate.
        </p>
      </CardContent>
    </Card>
  ),
};

// ─── Planning tool card ───
export const PlanningCard: Story = {
  render: () => (
    <Card style={{ maxWidth: 380 }}>
      <CardHeader>
        <CardTitle>Budget</CardTitle>
        <CardDescription>Suivez vos dépenses par catégorie</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ color: "#717171" }}>Total dépensé</span>
          <span style={{ fontWeight: 600, color: "#1A1A1A" }}>45,000 MAD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8 }}>
          <span style={{ color: "#717171" }}>Restant</span>
          <span style={{ fontWeight: 600, color: "#0A7A4B" }}>75,000 MAD</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">Gérer le budget</Button>
      </CardFooter>
    </Card>
  ),
};
