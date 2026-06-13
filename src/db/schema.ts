import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);

export const taskStatus = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE",
  "CANCELLED",
] as const;
export type TaskStatus = (typeof taskStatus)[number];

export const taskPriority = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof taskPriority)[number];

export const subtaskStatus = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;
export type SubtaskStatus = (typeof subtaskStatus)[number];

export const approvalStatus = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "withdrawn",
] as const;
export type ApprovalStatus = (typeof approvalStatus)[number];

export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `task_${nanoid()}`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("TODO"),
  priority: text("priority").notNull().default("low"),
  label: text("label").notNull(),
  assignee: text("assignee"),
  createdBy: text("created_by").notNull(),
  department: text("department"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  startDate: integer("start_date", { mode: "timestamp" }),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  progress: integer("progress").notNull().default(0),
  tags: text("tags"),
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

export const subtasks = sqliteTable("subtasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `subtask_${nanoid()}`),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("TODO"),
  priority: text("priority").notNull().default("low"),
  assignee: text("assignee"),
  sortOrder: integer("sort_order").notNull().default(0),
  estimatedMinutes: integer("estimated_minutes"),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  dueDate: integer("due_date", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

export const approvals = sqliteTable("approvals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `approval_${nanoid()}`),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  requestedBy: text("requested_by").notNull(),
  approver: text("approver").notNull(),
  status: text("status").notNull().default("pending"),
  level: integer("level").notNull().default(1),
  title: text("title").notNull(),
  comment: text("comment"),
  decision: text("decision"),
  rejectionReason: text("rejection_reason"),
  isRequired: integer("is_required", { mode: "boolean" })
    .notNull()
    .default(true),
  requestedAt: integer("requested_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  respondedAt: integer("responded_at", { mode: "timestamp" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

export const tasksRelations = relations(tasks, ({ many }) => ({
  subtasks: many(subtasks),
  approvals: many(approvals),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  task: one(tasks, {
    fields: [approvals.taskId],
    references: [tasks.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Subtask = typeof subtasks.$inferSelect;
export type NewSubtask = typeof subtasks.$inferInsert;
export type Approval = typeof approvals.$inferSelect;
export type NewApproval = typeof approvals.$inferInsert;
