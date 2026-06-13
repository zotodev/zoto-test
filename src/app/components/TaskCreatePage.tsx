"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { TaskFormActions } from "./TaskFormActions";
import { TaskFormFields } from "./TaskFormFields";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskCreatePageProps {
  onSuccess?: () => void;
}

export const TaskCreatePage: React.FC<TaskCreatePageProps> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  });

  const draftMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "draft" }),
      });

      if (!res.ok) throw new Error("Failed to save draft");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset();
      onSuccess?.();
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "published" }),
      });

      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset();
      onSuccess?.();
    },
  });

  const isLoading = draftMutation.isPending || publishMutation.isPending;

  const handleDraft = form.handleSubmit((data) => {
    draftMutation.mutate(data);
  });

  const handlePublish = form.handleSubmit((data) => {
    publishMutation.mutate(data);
  });

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <TaskFormActions
          onDraft={handleDraft}
          onPublish={handlePublish}
          isLoading={isLoading}
        />

        <TaskFormFields />
      </div>
    </FormProvider>
  );
};
