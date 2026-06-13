"use client";

import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ActionButtonProps extends Omit<ButtonProps, "onClick" | "type"> {
  action: string;
  label: string;
}

export function ActionButton({
  action,
  label,
  variant = "default",
  ...props
}: ActionButtonProps) {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  const currentAction = form.watch("action");

  const handleClick = () => {
    form.setValue("action", action, { shouldValidate: false });
    form.handleSubmit(() => {})(); // triggers validation + onSubmit in parent
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting && currentAction === action && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {label}
    </Button>
  );
}
