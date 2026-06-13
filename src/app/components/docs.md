# Form 2

## Folder Structure

```typescript
src/
  components/
    ribbon/
      FormRibbon.tsx
      types.ts

  features/
    requests/
      forms/
        RequestFormPage.tsx
        RequestForm.tsx
        request.schema.ts
        request.api.ts
```

---

# 1. Ribbon Types

```typescript
// src/components/ribbon/types.ts

import type { ReactNode } from "react";

export type RibbonAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  hidden?: boolean;
};
```

---

# 2. Reusable Form Ribbon

```typescript
// src/components/ribbon/FormRibbon.tsx

import type { RibbonAction } from "./types";

type FormRibbonProps = {
  title?: string;
  actions: RibbonAction[];
};

export function FormRibbon({ title, actions }: FormRibbonProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3">
      <div>
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
      </div>

      <div className="flex items-center gap-2">
        {visibleActions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled || action.loading}
            onClick={action.onClick}
            className={getButtonClass(action.variant)}
          >
            {action.icon}

            <span>
              {action.loading ? "Please wait..." : action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getButtonClass(variant: RibbonAction["variant"] = "secondary") {
  const base =
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return `${base} ${variants[variant]}`;
}
```

---

# 3. API Example

```typescript
// src/features/requests/forms/request.api.ts

export type RequestFormValues = {
  title: string;
  description: string;
  amount: number;
};

export async function saveRequest(values: RequestFormValues) {
  const response = await fetch("/api/requests/save", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to save request");
  }

  return response.json();
}

export async function submitRequest(values: RequestFormValues) {
  const response = await fetch("/api/requests/submit", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to submit request");
  }

  return response.json();
}
```

---

# 4. Form Page With Ribbon

```
// src/features/requests/forms/RequestFormPage.tsx

import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { FormRibbon } from "@/components/ribbon/FormRibbon";
import type { RibbonAction } from "@/components/ribbon/types";

import { RequestForm } from "./RequestForm";
import {
  saveRequest,
  submitRequest,
  type RequestFormValues,
} from "./request.api";

export function RequestFormPage() {
  const form = useForm<RequestFormValues>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveRequest,
  });

  const submitMutation = useMutation({
    mutationFn: submitRequest,
  });

  const isBusy = saveMutation.isPending || submitMutation.isPending;

  const handleSave = form.handleSubmit((values) => {
    saveMutation.mutate(values);
  });

  const handleSubmitRequest = form.handleSubmit((values) => {
    submitMutation.mutate(values);
  });

  const handleReset = () => {
    form.reset();
  };

  const ribbonActions: RibbonAction[] = [
    {
      id: "save",
      label: "Save",
      variant: "secondary",
      onClick: handleSave,
      loading: saveMutation.isPending,
      disabled: isBusy,
    },
    {
      id: "submit",
      label: "Submit",
      variant: "primary",
      onClick: handleSubmitRequest,
      loading: submitMutation.isPending,
      disabled: isBusy,
    },
    {
      id: "reset",
      label: "Reset",
      variant: "secondary",
      onClick: handleReset,
      disabled: isBusy || !form.formState.isDirty,
    },
    {
      id: "reject",
      label: "Reject",
      variant: "danger",
      onClick: () => {
        const values = form.getValues();
        console.log("Reject clicked with values:", values);
      },
      disabled: isBusy,
    },
  ];

  return (
    <FormProvider {...form}>
      <div className="flex h-full flex-col">
        <FormRibbon title="Request Form" actions={ribbonActions} />

        <div className="flex-1 p-4">
          <RequestForm />
        </div>
      </div>
    </FormProvider>
  );
}
```

---

# 5. Actual Form

```typescript
// src/features/requests/forms/RequestForm.tsx

import { useFormContext } from "react-hook-form";
import type { RequestFormValues } from "./request.api";

export function RequestForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestFormValues>();

  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Title
        </label>

        <input
          {...register("title", {
            required: "Title is required",
          })}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Amount
        </label>

        <input
          type="number"
          {...register("amount", {
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Amount must be greater than 0",
            },
          })}
          className="w-full rounded-md border px-3 py-2"
        />

        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.amount.message}
          </p>
        )}
      </div>
    </form>
  );
}
```

---

## Usage Pattern for Other Forms

For every new form page, only define its own actions:

```typescript
const ribbonActions: RibbonAction[] = [
  {
    id: "save",
    label: "Save",
    onClick: form.handleSubmit(saveHandler),
  },
  {
    id: "approve",
    label: "Approve",
    variant: "primary",
    onClick: form.handleSubmit(approveHandler),
  },
];
```

Then reuse:

```typescript
<FormRibbon title="Another Form" actions={ribbonActions} />
```

 