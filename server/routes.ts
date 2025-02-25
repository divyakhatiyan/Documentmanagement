import type { Express, Request } from "express";
import { createServer } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertDocumentSchema, insertApprovalSchema } from "@shared/schema";
import path from "path";
import { setupAuth } from "./auth";

// Add type declaration for multer request
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express) {
  const { ensureAuthenticated, ensureRole } = setupAuth(app);

  // Documents endpoints
  app.get("/api/documents", ensureAuthenticated, async (req, res) => {
    const { section } = req.query;
    const docs = await storage.getDocuments(section as string);
    res.json(docs);
  });

  app.get("/api/documents/:id", ensureAuthenticated, async (req, res) => {
    const doc = await storage.getDocument(parseInt(req.params.id));
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  });

  app.post(
    "/api/documents",
    ensureAuthenticated,
    upload.single("file"),
    async (req: MulterRequest, res) => {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const docData = {
        ...req.body,
        filePath: req.file.path,
        fileType: path.extname(req.file.originalname).slice(1)
      };

      try {
        const validated = insertDocumentSchema.parse(docData);
        const doc = await storage.createDocument(validated, req.user!.id);
        res.status(201).json(doc);
      } catch (error) {
        res.status(400).json({ message: "Invalid document data" });
      }
    }
  );

  app.delete(
    "/api/documents/:id",
    ensureAuthenticated,
    ensureRole(["admin", "manager"]),
    async (req, res) => {
      const success = await storage.deleteDocument(parseInt(req.params.id));
      if (!success) return res.status(404).json({ message: "Document not found" });
      res.status(204).send();
    }
  );

  // Approvals endpoints
  app.get("/api/documents/:id/approvals", ensureAuthenticated, async (req, res) => {
    const approvals = await storage.getApprovals(parseInt(req.params.id));
    res.json(approvals);
  });

  app.post(
    "/api/documents/:id/approvals",
    ensureAuthenticated,
    ensureRole(["admin", "manager"]),
    async (req, res) => {
      try {
        const validated = insertApprovalSchema.parse({
          ...req.body,
          documentId: parseInt(req.params.id)
        });
        const approval = await storage.createApproval(validated, req.user!.id);

        await storage.updateDocument(parseInt(req.params.id), {
          status: validated.status
        });

        res.status(201).json(approval);
      } catch (error) {
        res.status(400).json({ message: "Invalid approval data" });
      }
    }
  );

  const server = createServer(app);
  return server;
}