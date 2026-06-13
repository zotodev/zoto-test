"use client";

import { useState } from "react";
import { ActionBar } from "@/components/action-bar/action-bar";
import { FormRouter } from "@/components/forms/form-router";
import { formRegistry, type FormKey } from "@/components/forms/form-registry";
import { FormActionProvider } from "@/form-actions/context";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [formKey, setFormKey] = useState<FormKey>("profile");

  const entry = formRegistry[formKey];

  return (
    <FormActionProvider>
      <div className="min-h-screen bg-background">
        {/* Top Action Bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground">Action Bar</p>
            </div>
            <ActionBar />
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-2xl px-4 py-8">
          {/* Form switcher */}
          <div className="mb-6 flex gap-2">
            {(Object.keys(formRegistry) as FormKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormKey(key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  key === formKey
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {formRegistry[key].label}
              </button>
            ))}
          </div>

          {/* Form area */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{entry.label}</h2>
              <p className="text-sm text-muted-foreground">
                {entry.description}
              </p>
            </div>
            <Separator className="mb-5" />
            <FormRouter formKey={formKey} />
          </div>
        </main>
      </div>
    </FormActionProvider>
  );
}
