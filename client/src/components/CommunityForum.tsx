import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  { value: "ideas", label: "💡 Ideas" },
  { value: "projects", label: "🌱 Projects" },
  { value: "discussion", label: "💬 Discussion" },
];

export function CommunityForum() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("ideas");
  const [isCreating, setIsCreating] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const postsQuery = trpc.forum.getPosts.useQuery({ category: selectedCategory });
  const createPostMutation = trpc.forum.createPost.useMutation({
    onSuccess: () => {
      setNewPostTitle("");
      setNewPostContent("");
      setIsCreating(false);
      toast.success("Post created successfully!");
      postsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create post");
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) {
      toast.error("Please fill in all fields");
      return;
    }
    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
      category: selectedCategory,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
          Community Forum
        </h2>
        <p className="text-muted-foreground">
          Share your regenerative ideas, projects, and connect with like-minded innovators.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === cat.value
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Create Post Section */}
      {isAuthenticated ? (
        <Card className="p-6 border-border bg-card">
          {!isCreating ? (
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              + Share Your Idea
            </Button>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-4">
              <Input
                type="text"
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="bg-secondary/50 border-border"
              />
              <Textarea
                placeholder="Share your regenerative idea or project..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
                className="bg-secondary/50 border-border"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewPostTitle("");
                    setNewPostContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      ) : (
        <Card className="p-6 border-border bg-card/50 text-center">
          <p className="text-muted-foreground mb-4">Sign in to share your ideas with the community</p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {postsQuery.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
        ) : postsQuery.data && postsQuery.data.length > 0 ? (
          postsQuery.data.map((post: any) => (
            <Card key={post.id} className="p-6 border-border hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>User #{post.userId}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <p className="text-foreground mb-4 line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.replies}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet. Be the first to share your idea!
          </div>
        )}
      </div>
    </div>
  );
}
