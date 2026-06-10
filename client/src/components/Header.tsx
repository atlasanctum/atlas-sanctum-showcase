import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/#storyboard" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="w-2 h-6 bg-gradient-to-b from-accent to-sidebar-accent rounded-full group-hover:h-8 transition-all" />
          <span className="font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm text-foreground group-hover:text-accent transition-colors">
            Atlas
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-['Space_Grotesk'] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <a href="/about">Learn More</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container max-w-6xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-['Space_Grotesk'] uppercase tracking-widest text-muted-foreground hover:text-accent hover:bg-secondary/50 rounded transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button
              asChild
              size="sm"
              className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <a href="/about">Learn More</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
