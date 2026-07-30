import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get all users.
 */
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

/**
 * Mutation to update or insert multiple users.
 */
export const syncAllUsers = mutation({
  args: {
    users: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    for (const u of args.users) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", u.username))
        .first();

      const userData = {
        id: u.id,
        username: u.username,
        role: u.role,
        name: u.name,
        classification: u.classification,
        specialty: u.specialty,
        habitualPrograms: u.habitualPrograms,
        habitualProgramsByRole: u.habitualProgramsByRole,
        habitualProgramsDays: u.habitualProgramsDays,
        avatar: u.avatar,
        mobile: u.mobile,
        email: u.email,
        password: u.password,
        permissions: u.permissions,
        coordinatorSections: u.coordinatorSections,
        tools: u.tools,
        deviceLimitEnabled: u.deviceLimitEnabled,
        authorizedDevices: u.authorizedDevices,
        interests: u.interests,
      };

      if (existing) {
        await ctx.db.patch(existing._id, userData);
      } else {
        await ctx.db.insert("users", userData);
      }
    }
  },
});

/**
 * Mutation to update or insert a single user.
 */
export const updateUser = mutation({
  args: {
    user: v.any(),
  },
  handler: async (ctx, args) => {
    const u = args.user;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", u.username))
      .first();

    const userData = {
      id: u.id,
      username: u.username,
      role: u.role,
      name: u.name,
      classification: u.classification,
      specialty: u.specialty,
      habitualPrograms: u.habitualPrograms,
      habitualProgramsByRole: u.habitualProgramsByRole,
      habitualProgramsDays: u.habitualProgramsDays,
      avatar: u.avatar,
      mobile: u.mobile,
      email: u.email,
      password: u.password,
      permissions: u.permissions,
      coordinatorSections: u.coordinatorSections,
      tools: u.tools,
      deviceLimitEnabled: u.deviceLimitEnabled,
      authorizedDevices: u.authorizedDevices,
      interests: u.interests,
    };

    if (existing) {
      await ctx.db.patch(existing._id, userData);
      return existing._id;
    } else {
      return await ctx.db.insert("users", userData);
    }
  },
});

/**
 * Mutation to delete a user.
 */
export const deleteUser = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
