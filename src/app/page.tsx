"use client";

import { toast } from "sonner";
import { TaskForm } from "./components/TaskForm";

export default function Home() {
  return (
    <div>
      <TaskForm onSuccess={() => toast.success("Task created!")} />
    </div>
  );
}
