import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Newsletter Features", () => {
  it("should subscribe to newsletter", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({
      email: "subscriber@example.com",
    });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("should list newsletter subscribers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Subscribe first
    await caller.newsletter.subscribe({
      email: "test@example.com",
    });

    // List subscribers
    const result = await caller.newsletter.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("Forum Features", () => {
  it("should create a forum post", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.forum.createPost({
      title: "Test Idea",
      content: "This is a test regenerative idea",
      category: "ideas",
    });

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
  });

  it("should get forum posts by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a post
    await caller.forum.createPost({
      title: "Test Project",
      content: "A regenerative project",
      category: "projects",
    });

    // Get posts
    const result = await caller.forum.getPosts({ category: "projects" });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get all forum posts", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.forum.getPosts({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Projects Features", () => {
  it("should list regenerative projects", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.list({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("should list projects by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.list({ category: "agriculture" });

    expect(Array.isArray(result)).toBe(true);
  });
});
