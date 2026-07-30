import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNewsList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("news").collect();
  },
});

export const setNewsBatch = mutation({
  args: {
    newsItems: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        author: v.optional(v.string()),
        content: v.string(),
        excerpt: v.optional(v.string()),
        category: v.optional(v.string()),
        date: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    // Clear existing or update news items
    const existing = await ctx.db.query("news").collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }
    for (const item of args.newsItems) {
      await ctx.db.insert("news", {
        newsId: item.id,
        title: item.title,
        author: item.author || "Redacción RCM",
        content: item.content,
        excerpt: item.excerpt || "",
        category: item.category || "General",
        date: item.date || "",
        updatedAt: timestamp,
      });
    }
    return true;
  },
});
