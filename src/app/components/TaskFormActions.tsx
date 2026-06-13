import type React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { TaskFormData } from "./TaskForm";

interface TaskFormActionsProps {
  onDraft: (data: TaskFormData) => void;
  onPublish: (data: TaskFormData) => void;
  isLoading: boolean;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onDraft,
  onPublish,
  isLoading,
}) => {
  const { handleSubmit } = useFormContext<TaskFormData>();

  const handleDraftClick = handleSubmit(onDraft);
  const handlePublishClick = handleSubmit(onPublish);

  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="flex-1"
        onClick={handleDraftClick}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Save as Draft"}
      </Button>

      <Button
        type="button"
        size="lg"
        className="flex-1"
        onClick={handlePublishClick}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create & Publish"}
      </Button>
    </div>
  );
};
