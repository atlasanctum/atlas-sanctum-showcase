import * as db from "./db";
import { desc, eq, gte } from "drizzle-orm";
import { forumPosts, regenerativeProjects } from "../drizzle/schema";

/**
 * Generate weekly email digest for subscribers
 * This should be called by a scheduled job (e.g., every Sunday)
 */
export async function generateWeeklyDigest() {
  try {
    const db_instance = await db.getDb();
    if (!db_instance) {
      console.error("Database not available for email digest generation");
      return;
    }

    // Get all newsletter subscribers
    const subscribers = await db.getNewsletterSubscribers();

    // Get top forum posts from the past week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const topPosts = await db_instance
      .select()
      .from(forumPosts)
      .where(gte(forumPosts.createdAt, oneWeekAgo))
      .orderBy(desc(forumPosts.replies))
      .limit(5);

    // Get new regenerative projects from the past week
    const newProjects = await db_instance
      .select()
      .from(regenerativeProjects)
      .where(gte(regenerativeProjects.createdAt, oneWeekAgo))
      .orderBy(desc(regenerativeProjects.createdAt))
      .limit(5);

    // Featured articles (can be hardcoded or fetched from a content source)
    const featuredArticles = [
      {
        title: "The Future of Regenerative Agriculture",
        description: "How soil health is becoming the foundation of sustainable farming",
        url: "/resources",
      },
      {
        title: "Community-Led Conservation Success Stories",
        description: "Real-world examples of how communities are restoring ecosystems",
        url: "/resources",
      },
      {
        title: "Technology Enabling Regeneration",
        description: "How AI and IoT are accelerating regenerative practices globally",
        url: "/resources",
      },
    ];

    // Create digest for each subscriber
    for (const subscriber of subscribers) {
      await db.createEmailDigest(subscriber.id, topPosts, newProjects, featuredArticles);
    }

    console.log(`Generated email digests for ${subscribers.length} subscribers`);
    return {
      success: true,
      subscribersCount: subscribers.length,
      topPostsCount: topPosts.length,
      newProjectsCount: newProjects.length,
    };
  } catch (error) {
    console.error("Error generating email digest:", error);
    throw error;
  }
}

/**
 * Format digest data for email template
 */
export function formatDigestForEmail(digest: any) {
  const topPosts = JSON.parse(digest.topPostsJson || "[]");
  const newProjects = JSON.parse(digest.newProjectsJson || "[]");
  const featuredArticles = JSON.parse(digest.featuredArticlesJson || "[]");

  return {
    topPosts,
    newProjects,
    featuredArticles,
    sentAt: digest.sentAt,
  };
}

/**
 * Get digest content for a specific subscriber
 */
export async function getDigestContent(subscriberId: number) {
  const digests = await db.getRecentEmailDigests(subscriberId, 1);
  if (!digests.length) return null;

  return formatDigestForEmail(digests[0]);
}

/**
 * Calculate digest statistics
 */
export function getDigestStats(digest: any) {
  const topPosts = JSON.parse(digest.topPostsJson || "[]");
  const newProjects = JSON.parse(digest.newProjectsJson || "[]");
  const featuredArticles = JSON.parse(digest.featuredArticlesJson || "[]");

  return {
    totalItems: topPosts.length + newProjects.length + featuredArticles.length,
    topPostsCount: topPosts.length,
    newProjectsCount: newProjects.length,
    featuredArticlesCount: featuredArticles.length,
  };
}
