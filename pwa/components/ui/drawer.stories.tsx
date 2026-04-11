import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta: Meta = {
  title: "Design System/Drawer",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Ouvrir le tiroir</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtres</DrawerTitle>
          <DrawerDescription>
            Affinez votre recherche de prestataires.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4 text-sm text-neutral-600">
          Contenu du tiroir — filtres, options de tri, etc.
        </div>
        <DrawerFooter>
          <Button className="w-full">Appliquer les filtres</Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const ReservationDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="whatsapp" size="lg">
          Réserver une date
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Choisir une date</DrawerTitle>
          <DrawerDescription>
            Sélectionnez une plage de dates pour votre événement.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4 overflow-y-auto">
          <p className="text-sm text-neutral-500">
            Calendrier de disponibilité à intégrer ici.
          </p>
        </div>
        <DrawerFooter>
          <Button className="w-full">Confirmer la sélection</Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
