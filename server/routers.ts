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
});

export type AppRouter = typeof appRouter;
