import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../ui/button";
import QuoteRequestModal from "./QuoteRequestModal";

const meta: Meta<typeof QuoteRequestModal> = {
  title: "Components/QuoteRequestModal",
  component: QuoteRequestModal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    isOpen: { control: "boolean" },
    vendorName: { control: "text" },
    vendorProfileId: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof QuoteRequestModal>;

/** Static open state — useful for visual inspection */
export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    vendorProfileId: 1,
    vendorName: "Traiteur Lahlou",
  },
};

/** Controlled — toggle open/close with a trigger button */
function InteractiveQuoteModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <Button onClick={() => setOpen(true)}>Demander un devis</Button>
      <QuoteRequestModal
        isOpen={open}
        onClose={() => setOpen(false)}
        vendorProfileId={1}
        vendorName="Traiteur Lahlou"
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveQuoteModal />,
};

/** Different vendor names */
export const ForPhotographer: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    vendorProfileId: 5,
    vendorName: "Studio Atlas Photography",
  },
};
