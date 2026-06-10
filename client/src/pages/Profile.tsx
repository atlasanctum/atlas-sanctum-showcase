import { useAuth } from "@/_core/hooks/useAuth";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Award, MessageSquare, Lightbulb, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const badgeIcons = {
  first_post: { icon: MessageSquare, label: "First Post", color: "bg-blue-500" },
  prolific_contributor: { icon: Trophy, label: "Prolific Contributor", color: "bg-purple-500" },
  project_champion: { icon: Lightbulb, label: "Project Champion", color: "bg-green-500" },
  community_leader: { icon: Award, label: "Community Leader", color: "bg-orange-500" },
  regeneration_pioneer: { icon: Trophy, label: "Regeneration Pioneer", color: "bg-emerald-500" },
};

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [, params] = useRoute("/profile/:userId");
  const userId = params?.userId ? parseInt(params.userId) : user?.id;

  const { data: profile, isLoading: profileLoading } = trpc.profiles.getProfile.useQuery(
    { userId: userId || 0 },
    { enabled: !!userId }
  );

  const { data: badges, isLoading: badgesLoading } = trpc.profiles.getBadges.useQuery(
    { userId: userId || 0 },
    { enabled: !!userId }
  );

  if (!userId) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (profileLoading || badgesLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">Community Member</CardTitle>
                <CardDescription>Member since {new Date().toLocaleDateString()}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-accent">{profile?.reputation || 0}</div>
                <p className="text-sm text-muted-foreground">Reputation Points</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contribution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Forum Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.forumPostsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Project Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.projectSubmissionsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.approvedProjectsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{badges?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        {badges && badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
              <CardDescription>Recognition for your contributions to the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {badges.map((badge: any) => {
                  const badgeInfo = badgeIcons[badge.badgeType as keyof typeof badgeIcons];
                  if (!badgeInfo) return null;

                  const Icon = badgeInfo.icon;
                  return (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <div className={`${badgeInfo.color} p-4 rounded-full mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold">{badgeInfo.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contribution History */}
        <Card>
          <CardHeader>
            <CardTitle>Contribution Summary</CardTitle>
            <CardDescription>Your impact on the regenerative community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Total Reputation Earned</span>
              <span className="text-lg font-bold text-accent">{profile?.reputation || 0} pts</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-sm font-medium">Community Engagement</span>
              <span className="text-lg font-bold">
                {((profile?.forumPostsCount || 0) + (profile?.projectSubmissionsCount || 0)) > 0 ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium">Member Status</span>
              <span className="text-lg font-bold text-green-500">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {isAuthenticated && user?.id === userId && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Ready to contribute more to the regenerative community?</p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/resources">Submit a Project</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/resources">Join the Forum</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
