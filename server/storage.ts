import { Document, InsertDocument, Approval, InsertApproval, User, InsertUser } from "@shared/schema";
import { documents, approvals, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Document operations
  getDocuments(section?: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument, userId: number): Promise<Document>;
  updateDocument(id: number, doc: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;

  // Approval operations
  getApprovals(documentId: number): Promise<Approval[]>;
  createApproval(approval: InsertApproval, userId: number): Promise<Approval>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getDocuments(section?: string): Promise<Document[]> {
    const query = db.select().from(documents);
    if (section) {
      query.where(eq(documents.section, section));
    }
    return await query;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(doc: InsertDocument, userId: number): Promise<Document> {
    const [newDoc] = await db
      .insert(documents)
      .values({ ...doc, createdById: userId })
      .returning();
    return newDoc;
  }

  async updateDocument(id: number, update: Partial<Document>): Promise<Document | undefined> {
    const [updated] = await db
      .update(documents)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updated;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();
    return !!deleted;
  }

  async getApprovals(documentId: number): Promise<Approval[]> {
    return await db
      .select()
      .from(approvals)
      .where(eq(approvals.documentId, documentId));
  }

  async createApproval(approval: InsertApproval, userId: number): Promise<Approval> {
    const [newApproval] = await db
      .insert(approvals)
      .values({ ...approval, approverId: userId })
      .returning();
    return newApproval;
  }
}

export const storage = new DatabaseStorage();