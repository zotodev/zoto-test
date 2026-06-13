"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterActions } from "@/form-actions/context";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["viewer", "editor", "admin"], { error: "Select a role" }),
  message: z
    .string()
    .max(300, "Message must be 300 characters or less")
    .optional(),
});

type InviteValues = z.infer<typeof inviteSchema>;

const defaults: InviteValues = { email: "", role: "viewer", message: "" };

async function sendInvite(values: InviteValues) {
  await new Promise((r) => setTimeout(r, 600));
  console.log("Invite sent:", values);
}

async function saveDraft(values: InviteValues) {
  await new Promise((r) => setTimeout(r, 300));
  console.log("Draft saved:", values);
}

export function InviteForm() {
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: defaults,
  });

  const [draftPending, setDraftPending] = useState(false);

  const sendMutation = useMutation({
    mutationFn: sendInvite,
    onSuccess: () => {
      toast.success("Invite sent!");
      form.reset(defaults);
    },
    onError: () => toast.error("Failed to send invite"),
  });

  const onSend = form.handleSubmit((values) => sendMutation.mutate(values));

  const onSaveDraft = async () => {
    const values = form.getValues();
    setDraftPending(true);
    try {
      await saveDraft(values);
      toast.success("Draft saved");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setDraftPending(false);
    }
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText("https://app.example.com/invite/abc123");
    toast.success("Invite link copied to clipboard");
  };

  const busy = sendMutation.isPending || draftPending;

  const actions = useMemo(
    () => [
      {
        id: "send-invite",
        label: sendMutation.isPending ? "Sending…" : "Send Invite",
        variant: "default" as const,
        disabled: busy,
        loading: sendMutation.isPending,
        run: onSend,
      },
      {
        id: "save-draft",
        label: draftPending ? "Saving…" : "Save Draft",
        variant: "outline" as const,
        disabled: busy,
        loading: draftPending,
        run: onSaveDraft,
      },
      {
        id: "copy-link",
        label: "Copy Invite Link",
        variant: "ghost" as const,
        disabled: busy,
        run: onCopyLink,
      },
    ],
    [sendMutation.isPending, draftPending, onSend],
  );

  useRegisterActions(actions);

  return (
    <form id="invite-form" onSubmit={onSend} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="invite-email">Email Address</Label>
        <Input
          id="invite-email"
          type="email"
          placeholder="colleague@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...form.register("role")}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {form.formState.errors.role && (
          <p className="text-sm text-red-500">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Personal Message (optional)</Label>
        <Input
          id="message"
          placeholder="Looking forward to collaborating!"
          {...form.register("message")}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-500">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>
    </form>
  );
}
