import { desc } from "drizzle-orm";
import db from "@/db";
import { tasks, type NewTask, type Task } from "@/db/schema";

export async function getTasks(): Promise<Task[]> {
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function insertTask(data: NewTask): Promise<Task> {
  const [row] = await db.insert(tasks).values(data).returning();
  return row;
}
