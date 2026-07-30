import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Reactive query to stream live station data key (e.g. broadcast schedules, catalog, team configuration).
 */
export const getStationData = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("stationData")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    if (item && item.data && typeof item.data === 'object' && item.data.storageId) {
        const url = await ctx.storage.getUrl(item.data.storageId);
        return { ...item, data: { ...item.data, url } };
    }
    return item;
  },
});

/**
 * Reactive query to get all station data keys.
 */
export const getAllStationData = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("stationData").collect();
    return await Promise.all(items.map(async (item) => {
        if (item && item.data && typeof item.data === 'object' && item.data.storageId) {
            const url = await ctx.storage.getUrl(item.data.storageId);
            return { ...item, data: { ...item.data, url } };
        }
        return item;
    }));
  },
});

/**
 * Mutation for administrators to instantly update station configuration / schedules.
 */
export const updateStationData = mutation({
  args: {
    key: v.string(),
    data: v.any(),
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stationData")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const timestamp = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        data: args.data,
        updatedAt: timestamp,
        updatedBy: args.updatedBy,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("stationData", {
        key: args.key,
        data: args.data,
        updatedAt: timestamp,
        updatedBy: args.updatedBy,
      });
    }
  },
});
