"use client";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { TaskFormData } from "./TaskCreatePage";

function DueDatePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function TaskFormFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TaskFormData>();

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create New Task
          </CardTitle>
          <CardDescription>Fill in the details below</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register("title")}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the task..."
              {...register("description")}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Priority</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>

                  <FieldError>{errors.priority?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Due Date</FieldLabel>
                  <DueDatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError>{errors.dueDate?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
