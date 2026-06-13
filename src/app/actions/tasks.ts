"use server";

import type { Task } from "@/db/types";
import { getTasks, insertTask } from "@/db/queries/tasks";

const DEFAULT_LABEL = "general";
const DEFAULT_CREATED_BY = "system";

export type CreateTaskInput = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  status: "draft" | "published";
};

export async function fetchTasks(): Promise<Task[]> {
  return getTasks();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return insertTask({
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: "TODO",
    label: DEFAULT_LABEL,
    createdBy: DEFAULT_CREATED_BY,
    isArchived: input.status === "draft",
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });
}
