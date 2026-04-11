import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta: Meta = {
  title: "Design System/Dialog",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ouvrir le dialogue</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Votre compte et toutes vos données
            seront définitivement supprimés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Annuler</Button>
          <Button variant="danger">Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Modifier le profil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier votre profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            placeholder="Prénom"
            defaultValue="Yassine"
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            placeholder="Nom"
            defaultValue="Salhi"
          />
        </div>
        <DialogFooter>
          <Button>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
