import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users and Roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // admin, manager, user
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
  approvals: many(approvals),
}));

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  section: text("section").notNull(), // 'prosper', 'bankermart', 'time'
  subSection: text("sub_section").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdById: integer("created_by_id").notNull().references(() => users.id),
});

export const documentsRelations = relations(documents, ({ one, many }) => ({
  creator: one(users, {
    fields: [documents.createdById],
    references: [users.id],
  }),
  approvals: many(approvals),
}));

export const insertDocumentSchema = createInsertSchema(documents)
  .omit({ id: true, createdAt: true, updatedAt: true, createdById: true })
  .extend({
    file: z.instanceof(File)
  });

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Approvals
export const approvals = pgTable("approvals", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull().references(() => documents.id),
  approverId: integer("approver_id").notNull().references(() => users.id),
  status: text("status").notNull(), // pending, approved, rejected
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvalsRelations = relations(approvals, ({ one }) => ({
  document: one(documents, {
    fields: [approvals.documentId],
    references: [documents.id],
  }),
  approver: one(users, {
    fields: [approvals.approverId],
    references: [users.id],
  }),
}));

export const insertApprovalSchema = createInsertSchema(approvals)
  .omit({ id: true, createdAt: true, approverId: true });

export type Approval = typeof approvals.$inferSelect;
export type InsertApproval = z.infer<typeof insertApprovalSchema>;