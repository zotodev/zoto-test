"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRegisterActions } from "@/form-actions/context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const defaults: ProfileValues = { name: "", email: "", bio: "" };

async function saveProfile(values: ProfileValues) {
  // Simulate API call
  await new Promise((r) => setTimeout(r, 800));
  console.log("Profile saved:", values);
}

export function ProfileForm() {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });

  const mutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => toast.success("Profile saved successfully"),
    onError: () => toast.error("Failed to save profile"),
  });

  const onSave = form.handleSubmit((values) => mutation.mutate(values));

  const actions = useMemo(
    () => [
      {
        id: "save-profile",
        label: mutation.isPending ? "Saving…" : "Save Profile",
        variant: "default" as const,
        disabled: mutation.isPending,
        loading: mutation.isPending,
        run: onSave,
      },
      {
        id: "reset-defaults",
        label: "Reset to Defaults",
        variant: "outline" as const,
        disabled: mutation.isPending,
        run: () => form.reset(defaults),
      },
    ],
    [mutation.isPending, onSave, form],
  );

  useRegisterActions(actions);

  return (
    <form id="profile-form" onSubmit={onSave} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio (optional)</Label>
        <Input
          id="bio"
          placeholder="A short bio…"
          {...form.register("bio")}
        />
        {form.formState.errors.bio && (
          <p className="text-sm text-red-500">
            {form.formState.errors.bio.message}
          </p>
        )}
      </div>
    </form>
  );
}
