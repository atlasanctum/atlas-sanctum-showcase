import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsletterSubscribers, forumPosts, forumReplies, regenerativeProjects } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Newsletter helpers
export async function subscribeToNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    await db.insert(newsletterSubscribers).values({
      email,
      name: name || null,
      isActive: 1,
    }).onDuplicateKeyUpdate({
      set: {
        isActive: 1,
        unsubscribedAt: null,
      },
    });
  } catch (error) {
    console.error("[Newsletter] Failed to subscribe:", error);
    throw error;
  }
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, 1));
}

// Forum helpers
export async function createForumPost(userId: number, title: string, content: string, category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(forumPosts).values({
    userId,
    title,
    content,
    category,
  });
  return result;
}

export async function getForumPosts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return db.select().from(forumPosts).where(eq(forumPosts.category, category)).orderBy(desc(forumPosts.createdAt));
  }
  return db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
}

export async function getForumPostById(postId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(forumPosts).where(eq(forumPosts.id, postId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createForumReply(postId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(forumReplies).values({
    postId,
    userId,
    content,
  });
  
  // Increment reply count on post
  const post = await getForumPostById(postId);
  if (post) {
    await db.update(forumPosts).set({
      replies: post.replies + 1,
    }).where(eq(forumPosts.id, postId));
  }
}

export async function getForumReplies(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(forumReplies).where(eq(forumReplies.postId, postId)).orderBy(desc(forumReplies.createdAt));
}

// Regenerative projects helpers
export async function createRegenerativeProject(data: {
  name: string;
  description: string;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  imageUrl?: string;
  website?: string;
  impact?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(regenerativeProjects).values(data);
}

export async function getRegenerativeProjects(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return db.select().from(regenerativeProjects).where(eq(regenerativeProjects.category, category)).orderBy(desc(regenerativeProjects.createdAt));
  }
  return db.select().from(regenerativeProjects).orderBy(desc(regenerativeProjects.createdAt));
}

export async function getRegenerativeProjectById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(regenerativeProjects).where(eq(regenerativeProjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
