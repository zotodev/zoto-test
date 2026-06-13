"use client";

import { ActionButton } from "./ActionButton";

export function FormActions() {
  return (
    <div className="flex flex-wrap gap-3 pt-4 border-t">
      <ActionButton
        action="send-to-ird"
        label="Send to IRD"
        variant="default"
      />

      <ActionButton
        action="send-to-reviewer"
        label="Send to Reviewer"
        variant="secondary"
      />

      <ActionButton action="approve" label="Approve" variant="default" />

      <ActionButton action="reject" label="Reject" variant="destructive" />
    </div>
  );
}
