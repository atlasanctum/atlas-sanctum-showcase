import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setEmail("");
      setName("");
      toast.success("Successfully subscribed to the newsletter!");
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    subscribeMutation.mutate({ email, name: name || undefined });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Welcome to the Atlas Sanctum Community!</h3>
        <p className="text-muted-foreground">
          You'll receive monthly curated updates about regenerative systems and sustainability innovations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Stay Updated</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Subscribe to receive monthly curated content about regenerative systems, sustainability innovations, and behind-the-scenes creation stories.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary/50 border-border"
        />
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-secondary/50 border-border"
        />
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to Newsletter"}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
