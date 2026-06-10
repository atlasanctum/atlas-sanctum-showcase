import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  variant?: "compact" | "full";
}

export function SocialShare({
  title,
  description,
  url = typeof window !== "undefined" ? window.location.href : "",
  variant = "compact",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-['Space_Grotesk'] uppercase tracking-widest">
          Share
        </span>
        <div className="flex gap-2">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            title="Share on Twitter"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5" />
            </svg>
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            title="Share on Facebook"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
            </svg>
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            title="Share on LinkedIn"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full bg-secondary hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold font-['Space_Grotesk'] uppercase tracking-wider">
          Share This Vision
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-accent/50 hover:bg-accent/10 transition-all group"
        >
          <svg
            className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5" />
          </svg>
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors">
            Twitter
          </span>
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-accent/50 hover:bg-accent/10 transition-all group"
        >
          <svg
            className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
          </svg>
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors">
            Facebook
          </span>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-accent/50 hover:bg-accent/10 transition-all group"
        >
          <svg
            className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors">
            LinkedIn
          </span>
        </a>

        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-accent/50 hover:bg-accent/10 transition-all group"
        >
          {copied ? (
            <>
              <Check className="w-6 h-6 text-sidebar-accent" />
              <span className="text-xs font-semibold text-sidebar-accent">
                Copied!
              </span>
            </>
          ) : (
            <>
              <Copy className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-accent transition-colors">
                Copy Link
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
