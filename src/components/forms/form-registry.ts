import type { ComponentType } from "react";
import { InviteForm } from "./invite-form";
import { ProfileForm } from "./profile-form";

type RegistryEntry = {
  label: string;
  description: string;
  component: ComponentType;
};

export const formRegistry = {
  profile: {
    label: "Edit Profile",
    description: "Update your personal information",
    component: ProfileForm,
  },
  invite: {
    label: "Invite Member",
    description: "Invite someone to your workspace",
    component: InviteForm,
  },
} satisfies Record<string, RegistryEntry>;

export type FormKey = keyof typeof formRegistry;
