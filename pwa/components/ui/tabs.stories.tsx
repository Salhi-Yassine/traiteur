import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Design System/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="budget">
      <TabsList>
        <TabsTrigger value="budget">Budget</TabsTrigger>
        <TabsTrigger value="guests">Invités</TabsTrigger>
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
      </TabsList>
      <TabsContent value="budget" className="p-4 text-sm text-neutral-600">
        Gérez votre budget de mariage ici.
      </TabsContent>
      <TabsContent value="guests" className="p-4 text-sm text-neutral-600">
        Liste de vos invités et leurs réponses RSVP.
      </TabsContent>
      <TabsContent value="checklist" className="p-4 text-sm text-neutral-600">
        Tâches à accomplir avant le grand jour.
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Aperçu</TabsTrigger>
        <TabsTrigger value="gallery">Galerie</TabsTrigger>
        <TabsTrigger value="reviews" disabled>
          Avis (bientôt)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 text-sm text-neutral-600">
        Informations générales sur le prestataire.
      </TabsContent>
      <TabsContent value="gallery" className="p-4 text-sm text-neutral-600">
        Photos et vidéos du prestataire.
      </TabsContent>
    </Tabs>
  ),
};
