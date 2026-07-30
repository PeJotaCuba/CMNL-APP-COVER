import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Reactive query to list all station documents (optionally filtered by status or sender).
 */
export const getDocumentsList = query({
  args: {
    status: v.optional(v.string()),
    sender: v.optional(v.string()),
    documentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const docs = await (async () => {
      if (args.documentType) {
        return await ctx.db
          .query("documents")
          .withIndex("by_document_type", (qIdx) => qIdx.eq("documentType", args.documentType!))
          .order("desc")
          .collect();
      }
      if (args.status) {
        return await ctx.db
          .query("documents")
          .withIndex("by_status", (qIdx) => qIdx.eq("status", args.status!))
          .order("desc")
          .collect();
      }
      if (args.sender) {
        return await ctx.db
          .query("documents")
          .withIndex("by_sender", (qIdx) => qIdx.eq("sender", args.sender!))
          .order("desc")
          .collect();
      }
      return await ctx.db.query("documents").order("desc").collect();
    })();

    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        contentUrl: doc.storageId
          ? (await ctx.storage.getUrl(doc.storageId)) || doc.contentUrl
          : doc.contentUrl,
      }))
    );
  },
});

/**
 * Generates a short-lived upload URL for the client to POST a file to.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Mutation for station workers/users to submit generated documents,
 * instantly notifying the administrator dashboard in real time.
 */
export const submitDocument = mutation({
  args: {
    title: v.string(),
    contentUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    sender: v.string(),
    senderName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      title: args.title,
      contentUrl: args.contentUrl,
      storageId: args.storageId,
      sender: args.sender,
      senderName: args.senderName || args.sender,
      documentType: args.documentType || "general",
      status: "pending",
      timestamp: new Date().toISOString(),
      metadata: args.metadata,
    });
  },
});

/**
 * Mutation for administrators to update document status (e.g., approved, received, archived).
 */
export const updateDocumentStatus = mutation({
  args: {
    id: v.id("documents"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
