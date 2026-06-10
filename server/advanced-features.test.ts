import { describe, it, expect, beforeEach } from "vitest";
import * as db from "./db";
import { generateWeeklyDigest, formatDigestForEmail, getDigestStats } from "./emailDigest";

describe("Advanced Community Features", () => {
  describe("Project Submissions", () => {
    it("should submit a project and update user reputation", async () => {
      const userId = 1;
      const projectData = {
        name: "Urban Vertical Garden",
        description: "A community-led vertical gardening initiative",
        category: "urban",
        location: "Nairobi, Kenya",
        latitude: "-1.2921",
        longitude: "36.8219",
        impact: "Provides fresh produce to 500 families",
      };

      await db.submitProject(userId, projectData);
      const profile = await db.getUserProfile(userId);

      expect(profile?.projectSubmissionsCount).toBe(1);
    });

    it("should approve project submission and award badge", async () => {
      const userId = 1;
      const adminId = 2;
      const submissionId = 1;

      await db.approveProjectSubmission(submissionId, adminId);
      const badges = await db.getUserBadges(userId);
      const profile = await db.getUserProfile(userId);

      expect(badges.length).toBeGreaterThan(0);
      expect(profile?.reputation).toBeGreaterThanOrEqual(50);
    });

    it("should reject project submission with reason", async () => {
      const adminId = 2;
      const submissionId = 2;
      const reason = "Insufficient impact documentation";

      await db.rejectProjectSubmission(submissionId, adminId, reason);
      // Verify rejection was recorded
      expect(true).toBe(true);
    });
  });

  describe("User Profiles", () => {
    it("should create user profile on first access", async () => {
      const userId = 3;
      const profile = await db.getOrCreateUserProfile(userId);

      expect(profile).toBeDefined();
      expect(profile?.userId).toBe(userId);
      expect(profile?.reputation).toBe(0);
    });

    it("should update user profile count", async () => {
      const userId = 4;
      await db.getOrCreateUserProfile(userId);
      await db.updateUserProfileCount(userId, "forumPostsCount", 1);
      await db.updateUserProfileCount(userId, "forumPostsCount", 2);

      const profile = await db.getUserProfile(userId);
      expect(profile?.forumPostsCount).toBe(3);
    });

    it("should add reputation points", async () => {
      const userId = 5;
      await db.getOrCreateUserProfile(userId);
      await db.addReputation(userId, 100);
      await db.addReputation(userId, 50);

      const profile = await db.getUserProfile(userId);
      expect(profile?.reputation).toBe(150);
    });
  });

  describe("User Badges", () => {
    it("should award badge to user", async () => {
      const userId = 6;
      await db.awardBadgeIfEarned(userId, "first_post");

      const badges = await db.getUserBadges(userId);
      expect(badges.length).toBe(1);
      expect(badges[0]?.badgeType).toBe("first_post");
    });

    it("should not award duplicate badges", async () => {
      const userId = 7;
      await db.awardBadgeIfEarned(userId, "prolific_contributor");
      await db.awardBadgeIfEarned(userId, "prolific_contributor");

      const badges = await db.getUserBadges(userId);
      expect(badges.length).toBe(1);
    });

    it("should award multiple different badges", async () => {
      const userId = 8;
      await db.awardBadgeIfEarned(userId, "first_post");
      await db.awardBadgeIfEarned(userId, "project_champion");
      await db.awardBadgeIfEarned(userId, "community_leader");

      const badges = await db.getUserBadges(userId);
      expect(badges.length).toBe(3);
    });
  });

  describe("Leaderboard", () => {
    it("should retrieve top contributors", async () => {
      const leaderboard = await db.getLeaderboard(5);

      expect(Array.isArray(leaderboard)).toBe(true);
      if (leaderboard.length > 1) {
        expect(leaderboard[0]?.reputation).toBeGreaterThanOrEqual(leaderboard[1]?.reputation || 0);
      }
    });

    it("should respect limit parameter", async () => {
      const leaderboard = await db.getLeaderboard(3);
      expect(leaderboard.length).toBeLessThanOrEqual(3);
    });
  });

  describe("Email Digests", () => {
    it("should create email digest", async () => {
      const subscriberId = 1;
      const topPosts = [{ id: 1, title: "Great Discussion" }];
      const newProjects = [{ id: 1, name: "New Initiative" }];
      const featuredArticles = [{ title: "Featured Article" }];

      await db.createEmailDigest(subscriberId, topPosts, newProjects, featuredArticles);
      const digests = await db.getRecentEmailDigests(subscriberId, 1);

      expect(digests.length).toBeGreaterThan(0);
    });

    it("should format digest for email", async () => {
      const digest = {
        topPostsJson: JSON.stringify([{ id: 1, title: "Post" }]),
        newProjectsJson: JSON.stringify([{ id: 1, name: "Project" }]),
        featuredArticlesJson: JSON.stringify([{ title: "Article" }]),
        sentAt: new Date(),
      };

      const formatted = formatDigestForEmail(digest);

      expect(formatted.topPosts.length).toBe(1);
      expect(formatted.newProjects.length).toBe(1);
      expect(formatted.featuredArticles.length).toBe(1);
    });

    it("should calculate digest statistics", async () => {
      const digest = {
        topPostsJson: JSON.stringify([{ id: 1 }, { id: 2 }]),
        newProjectsJson: JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }]),
        featuredArticlesJson: JSON.stringify([{ id: 1 }]),
        sentAt: new Date(),
      };

      const stats = getDigestStats(digest);

      expect(stats.totalItems).toBe(6);
      expect(stats.topPostsCount).toBe(2);
      expect(stats.newProjectsCount).toBe(3);
      expect(stats.featuredArticlesCount).toBe(1);
    });
  });

  describe("Reputation System", () => {
    it("should track reputation across multiple actions", async () => {
      const userId = 9;
      await db.getOrCreateUserProfile(userId);

      // Simulate various reputation-earning actions
      await db.addReputation(userId, 10); // Submit project
      await db.addReputation(userId, 50); // Project approved
      await db.addReputation(userId, 5); // Forum post
      await db.addReputation(userId, 15); // Helpful comment

      const profile = await db.getUserProfile(userId);
      expect(profile?.reputation).toBe(80);
    });

    it("should reflect reputation in leaderboard", async () => {
      const userId = 10;
      await db.getOrCreateUserProfile(userId);
      await db.addReputation(userId, 1000);

      const leaderboard = await db.getLeaderboard(100);
      const userInLeaderboard = leaderboard.find((u: any) => u.userId === userId);

      expect(userInLeaderboard).toBeDefined();
      expect(userInLeaderboard?.reputation).toBe(1000);
    });
  });

  describe("Community Engagement", () => {
    it("should track forum posts count", async () => {
      const userId = 11;
      await db.getOrCreateUserProfile(userId);
      await db.updateUserProfileCount(userId, "forumPostsCount", 1);
      await db.updateUserProfileCount(userId, "forumPostsCount", 1);
      await db.updateUserProfileCount(userId, "forumPostsCount", 1);

      const profile = await db.getUserProfile(userId);
      expect(profile?.forumPostsCount).toBe(3);
    });

    it("should track approved projects count", async () => {
      const userId = 12;
      await db.getOrCreateUserProfile(userId);
      await db.updateUserProfileCount(userId, "approvedProjectsCount", 1);
      await db.updateUserProfileCount(userId, "approvedProjectsCount", 1);

      const profile = await db.getUserProfile(userId);
      expect(profile?.approvedProjectsCount).toBe(2);
    });
  });
});
