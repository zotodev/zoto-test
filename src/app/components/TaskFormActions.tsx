import { Save, Send, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import type { TaskFormData } from "./TaskCreatePage";

interface TaskFormActionsProps {
  onDraft: () => void;
  onPublish: () => void;
  isLoading: boolean;
}

export function TaskFormActions({
  onDraft,
  onPublish,
  isLoading,
}: TaskFormActionsProps) {
  const form = useFormContext<TaskFormData>();

  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Create Task</h1>
          <p className="text-sm text-muted-foreground">
            Manage task form actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => form.reset()}
          >
            <X className="mr-2 size-4" />
            Clear
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onDraft}
          >
            <Save className="mr-2 size-4" />
            Save Draft
          </Button>

          <Button type="button" disabled={isLoading} onClick={onPublish}>
            <Send className="mr-2 size-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
