import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Newsletter router
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.subscribeToNewsletter(input.email, input.name);
        return { success: true };
      }),
    
    list: publicProcedure.query(async () => {
      return db.getNewsletterSubscribers();
    }),
  }),

  // Forum router
  forum: router({
    createPost: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        category: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createForumPost(ctx.user.id, input.title, input.content, input.category);
      }),
    
    getPosts: publicProcedure
      .input(z.object({
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.getForumPosts(input.category);
      }),
    
    getPostById: publicProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getForumPostById(input.postId);
      }),
    
    createReply: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createForumReply(input.postId, ctx.user.id, input.content);
        return { success: true };
      }),
    
    getReplies: publicProcedure
      .input(z.object({
        postId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getForumReplies(input.postId);
      }),
  }),

  // Regenerative projects router
  projects: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1),
        category: z.string().min(1),
        location: z.string().min(1),
        latitude: z.string(),
        longitude: z.string(),
        imageUrl: z.string().optional(),
        website: z.string().optional(),
        impact: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRegenerativeProject(input);
      }),
    
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.getRegenerativeProjects(input.category);
      }),
    
    getById: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getRegenerativeProjectById(input.id);
      }),
  }),

  // Project submissions router
  submissions: router({
    submit: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        description: z.string().min(1),
        category: z.string().min(1),
        location: z.string().min(1),
        latitude: z.string(),
        longitude: z.string(),
        imageUrl: z.string().optional(),
        website: z.string().optional(),
        impact: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.submitProject(ctx.user.id, input);
        await db.addReputation(ctx.user.id, 10);
        return { success: true };
      }),
    
    getPending: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin only');
        return db.getPendingProjectSubmissions();
      }),
    
    approve: protectedProcedure
      .input(z.object({
        submissionId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin only');
        await db.approveProjectSubmission(input.submissionId, ctx.user.id);
        return { success: true };
      }),
    
    reject: protectedProcedure
      .input(z.object({
        submissionId: z.number(),
        reason: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin only');
        await db.rejectProjectSubmission(input.submissionId, ctx.user.id, input.reason);
        return { success: true };
      }),
  }),

  // User profiles router
  profiles: router({
    getProfile: publicProcedure
      .input(z.object({
        userId: z.number(),
      }))
      .query(async ({ input }) => {
        const profile = await db.getUserProfile(input.userId);
        if (!profile) {
          return await db.getOrCreateUserProfile(input.userId);
        }
        return profile;
      }),
    
    getMyProfile: protectedProcedure
      .query(async ({ ctx }) => {
        const profile = await db.getUserProfile(ctx.user.id);
        if (!profile) {
          return await db.getOrCreateUserProfile(ctx.user.id);
        }
        return profile;
      }),
    
    getBadges: publicProcedure
      .input(z.object({
        userId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getUserBadges(input.userId);
      }),
  }),

  // Leaderboard router
  leaderboard: router({
    getTop: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return db.getLeaderboard(input.limit);
      }),
  }),

  // Email digests router
  digests: router({
    create: protectedProcedure
      .input(z.object({
        subscriberId: z.number(),
        topPosts: z.array(z.any()),
        newProjects: z.array(z.any()),
        featuredArticles: z.array(z.any()),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new Error('Admin only');
        await db.createEmailDigest(input.subscriberId, input.topPosts, input.newProjects, input.featuredArticles);
        return { success: true };
      }),
    
    getRecent: publicProcedure
      .input(z.object({
        subscriberId: z.number(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return db.getRecentEmailDigests(input.subscriberId, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
