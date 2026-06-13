"use client";

import { type FormKey, formRegistry } from "./form-registry";

type FormRouterProps = {
  formKey: FormKey;
};

export function FormRouter({ formKey }: FormRouterProps) {
  const entry = formRegistry[formKey];
  const ActiveForm = entry.component;
  return <ActiveForm />;
}
