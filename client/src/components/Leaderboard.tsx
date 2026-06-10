import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Medal } from "lucide-react";
import { Link } from "wouter";

export function Leaderboard() {
  const { data: topContributors, isLoading } = trpc.leaderboard.getTop.useQuery({ limit: 10 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!topContributors || topContributors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Leaderboard</CardTitle>
          <CardDescription>Be the first to contribute and earn a spot on the leaderboard!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case 2:
        return "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800";
      case 3:
        return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Community Leaderboard
        </CardTitle>
        <CardDescription>Top contributors by reputation points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topContributors.map((contributor: any, index: number) => (
            <Link key={contributor.userId} href={`/profile/${contributor.userId}`}>
              <a className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-accent/5 cursor-pointer ${getRankColor(index + 1)}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getMedalIcon(index + 1)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Community Member</p>
                    <div className="flex gap-2 mt-1">
                      {contributor.forumPostsCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {contributor.forumPostsCount} posts
                        </Badge>
                      )}
                      {contributor.approvedProjectsCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {contributor.approvedProjectsCount} projects
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-accent">{contributor.reputation}</div>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
