import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";

const meta: Meta = {
  title: "Design System/Select",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const EVENT_TYPES = [
  "Mariage",
  "Fiançailles",
  "Sbouâ (Haqiqa)",
  "Henné",
  "Réception",
  "Autre",
];

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Type d'événement" />
      </SelectTrigger>
      <SelectContent>
        {EVENT_TYPES.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="event-type">Type d&apos;événement</Label>
      <Select>
        <SelectTrigger id="event-type">
          <SelectValue placeholder="Sélectionnez…" />
        </SelectTrigger>
        <SelectContent>
          {EVENT_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Preselected: Story = {
  render: () => (
    <Select defaultValue="Mariage">
      <SelectTrigger className="w-64">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {EVENT_TYPES.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Non disponible" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">—</SelectItem>
      </SelectContent>
    </Select>
  ),
};
