import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProgrammingData = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("programming")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const updateProgrammingData = mutation({
  args: {
    key: v.string(),
    data: v.any(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("programming")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const timestamp = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        updatedAt: timestamp,
        updatedBy: args.updatedBy || "system",
      });
      return existing._id;
    } else {
      return await ctx.db.insert("programming", {
        key: args.key,
        data: args.data,
        updatedAt: timestamp,
        updatedBy: args.updatedBy || "system",
      });
    }
  },
});
