"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormActions } from "./FormActions"; // ← Separate component

// Schema
const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is too short"),
  action: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function MultiActionForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      action: "",
    },
  });

  // Mutations
  const sendToIrdMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/send-to-ird", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => toast.success("Sent to IRD"),
  });

  const approveMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/approve", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => toast.success("Approved successfully"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/reject", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => toast.success("Rejected"),
  });

  // Single submit handler
  const onSubmit = async (values: FormValues) => {
    const { action, ...payload } = values;

    switch (action) {
      case "send-to-ird":
        await sendToIrdMutation.mutateAsync(values);
        break;
      case "approve":
        await approveMutation.mutateAsync(values);
        break;
      case "reject":
        await rejectMutation.mutateAsync(values);
        break;
      default:
        toast.error("Unknown action");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Document Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* === ONLY FORM FIELDS (No buttons here) === */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden field to track which action was triggered */}
            <input type="hidden" {...form.register("action")} />

            {/* === ACTIONS RENDERED FROM SEPARATE COMPONENT === */}
            <FormActions />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
