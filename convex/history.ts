import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getHistory = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("history")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const updateHistory = mutation({
  args: {
    key: v.string(),
    content: v.string(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("history")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const timestamp = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: timestamp,
        updatedBy: args.updatedBy || "system",
      });
      return existing._id;
    } else {
      return await ctx.db.insert("history", {
        key: args.key,
        content: args.content,
        updatedAt: timestamp,
        updatedBy: args.updatedBy || "system",
      });
    }
  },
});
