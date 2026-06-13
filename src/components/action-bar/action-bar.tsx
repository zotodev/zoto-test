"use client";

import { Button } from "@/components/ui/button";
import { useFormActions } from "@/form-actions/context";

export function ActionBar() {
  const actions = useFormActions();

  if (actions.length === 0) {
    return (
      <div className="flex h-12 items-center px-4 text-sm text-muted-foreground">
        No actions available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant ?? "default"}
          disabled={action.disabled}
          onClick={action.run}
          size="sm"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
