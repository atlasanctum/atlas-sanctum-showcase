import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsletterSubscribers, forumPosts, forumReplies, regenerativeProjects, projectSubmissions, userProfiles, userBadges, emailDigests } from "../drizzle/schema";
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

// Project submissions helpers
export async function submitProject(userId: number, data: {
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
  
  const result = await db.insert(projectSubmissions).values({
    userId,
    ...data,
  });
  
  // Update user profile
  await updateUserProfileCount(userId, 'projectSubmissionsCount', 1);
  
  return result;
}

export async function getPendingProjectSubmissions() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(projectSubmissions).where(eq(projectSubmissions.status, 'pending')).orderBy(desc(projectSubmissions.submittedAt));
}

export async function approveProjectSubmission(submissionId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const submission = await db.select().from(projectSubmissions).where(eq(projectSubmissions.id, submissionId)).limit(1);
  if (!submission.length) throw new Error("Submission not found");
  
  const sub = submission[0];
  
  // Create the approved project
  await db.insert(regenerativeProjects).values({
    name: sub.name,
    description: sub.description,
    category: sub.category,
    location: sub.location,
    latitude: sub.latitude,
    longitude: sub.longitude,
    imageUrl: sub.imageUrl,
    website: sub.website,
    impact: sub.impact,
  });
  
  // Update submission status
  await db.update(projectSubmissions).set({
    status: 'approved',
    reviewedAt: new Date(),
    reviewedBy: adminId,
  }).where(eq(projectSubmissions.id, submissionId));
  
  // Award badge and update profile
  await awardBadgeIfEarned(sub.userId, 'project_champion');
  await updateUserProfileCount(sub.userId, 'approvedProjectsCount', 1);
  await addReputation(sub.userId, 50);
}

export async function rejectProjectSubmission(submissionId: number, adminId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projectSubmissions).set({
    status: 'rejected',
    rejectionReason: reason,
    reviewedAt: new Date(),
    reviewedBy: adminId,
  }).where(eq(projectSubmissions.id, submissionId));
}

// User profile helpers
export async function getOrCreateUserProfile(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (existing.length) return existing[0];
  
  await db.insert(userProfiles).values({ userId });
  const created = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return created[0];
}

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserProfileCount(userId: number, field: 'forumPostsCount' | 'projectSubmissionsCount' | 'approvedProjectsCount', increment: number) {
  const db = await getDb();
  if (!db) return;
  
  const profile = await getUserProfile(userId);
  if (!profile) {
    await getOrCreateUserProfile(userId);
  }
  
  const currentValue = profile?.[field] || 0;
  await db.update(userProfiles).set({
    [field]: currentValue + increment,
  }).where(eq(userProfiles.userId, userId));
}

export async function addReputation(userId: number, points: number) {
  const db = await getDb();
  if (!db) return;
  
  const profile = await getUserProfile(userId);
  if (!profile) {
    await getOrCreateUserProfile(userId);
  }
  
  const currentReputation = profile?.reputation || 0;
  await db.update(userProfiles).set({
    reputation: currentReputation + points,
  }).where(eq(userProfiles.userId, userId));
}

// User badges helpers
export async function awardBadgeIfEarned(userId: number, badgeType: 'first_post' | 'prolific_contributor' | 'project_champion' | 'community_leader' | 'regeneration_pioneer') {
  const db = await getDb();
  if (!db) return;
  
  // Check if user already has this badge
  const existing = await db.select().from(userBadges).where(
    and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType))
  ).limit(1);
  
  if (!existing.length) {
    await db.insert(userBadges).values({ userId, badgeType });
  }
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(userBadges).where(eq(userBadges.userId, userId)).orderBy(desc(userBadges.earnedAt));
}

// Leaderboard helpers
export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(userProfiles).orderBy(desc(userProfiles.reputation)).limit(limit);
}

// Email digest helpers
export async function createEmailDigest(subscriberId: number, topPosts: any[], newProjects: any[], featuredArticles: any[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(emailDigests).values({
    subscriberId,
    topPostsJson: JSON.stringify(topPosts),
    newProjectsJson: JSON.stringify(newProjects),
    featuredArticlesJson: JSON.stringify(featuredArticles),
  });
}

export async function getRecentEmailDigests(subscriberId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(emailDigests).where(eq(emailDigests.subscriberId, subscriberId)).orderBy(desc(emailDigests.sentAt)).limit(limit);
}
