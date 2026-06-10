import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface EmailSignupProps {
  variant?: "default" | "compact";
}

export function EmailSignup({ variant = "default" }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you! Check your email for updates.");
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }, 800);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
          Stay Updated
        </h3>
        <p className="text-muted-foreground">
          Be the first to know about new chapters in the Atlas Sanctum story
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="w-5 h-5" />
          </div>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="pl-12 bg-input border-border text-foreground placeholder:text-muted-foreground h-12"
          />
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 text-sidebar-accent bg-sidebar-accent/10 border border-sidebar-accent/30 rounded-lg p-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
        >
          {status === "loading"
            ? "Subscribing..."
            : status === "success"
              ? "Subscribed!"
              : "Get Updates"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
