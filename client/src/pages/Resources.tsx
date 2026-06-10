import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { useState } from "react";

/**
 * Resources Page - Blog & Articles
 * 
 * Design Philosophy: Cinematic Futurism with Dark Elegance
 * Showcases articles about regenerative systems, sustainability innovations, and behind-the-scenes creation
 */

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: "regeneration" | "innovation" | "behind-the-scenes" | "vision";
  date: string;
  readTime: number;
  image: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: "Building Regenerative Economies: From Theory to Practice",
    excerpt:
      "How cities around the world are transitioning from extraction-based to regeneration-based economic models, creating prosperity while healing ecosystems.",
    category: "regeneration",
    date: "2026-06-08",
    readTime: 8,
    image: "🌍",
    featured: true,
  },
  {
    id: 2,
    title: "The Atlas Sanctum Vision: Behind the Scenes",
    excerpt:
      "Discover how we created the cinematic vision of Atlas Sanctum, from scriptwriting to AI-generated imagery to orchestral composition.",
    category: "behind-the-scenes",
    date: "2026-06-05",
    readTime: 6,
    image: "🎬",
    featured: true,
  },
  {
    id: 3,
    title: "Vertical Forests: The Future of Urban Food Systems",
    excerpt:
      "Exploring how vertical farming and urban agriculture are revolutionizing food production, reducing carbon footprints, and creating local abundance.",
    category: "innovation",
    date: "2026-06-01",
    readTime: 7,
    image: "🌱",
  },
  {
    id: 4,
    title: "Trust as Currency: Reimagining Value in a Regenerative World",
    excerpt:
      "An exploration of how trust-based systems could replace traditional currency, creating economies where credibility and collaboration are the primary assets.",
    category: "vision",
    date: "2026-05-28",
    readTime: 10,
    image: "🤝",
  },
  {
    id: 5,
    title: "Ocean Regeneration: Reversing Acidification and Restoring Coral",
    excerpt:
      "The latest breakthroughs in marine restoration technology and the global initiatives working to heal our oceans.",
    category: "innovation",
    date: "2026-05-24",
    readTime: 9,
    image: "🌊",
  },
  {
    id: 6,
    title: "The Four Pillars of Atlas Sanctum: Deep Dive",
    excerpt:
      "An in-depth exploration of the four foundational principles that make regenerative civilization possible.",
    category: "vision",
    date: "2026-05-20",
    readTime: 12,
    image: "🏛️",
  },
  {
    id: 7,
    title: "AI and Planetary Intelligence: Creating Global Decision-Making Systems",
    excerpt:
      "How artificial intelligence and human wisdom combine to create planetary-scale intelligence networks that serve all life.",
    category: "innovation",
    date: "2026-05-16",
    readTime: 11,
    image: "🤖",
  },
  {
    id: 8,
    title: "From Crisis to Hope: The Narrative Arc of Atlas Sanctum",
    excerpt:
      "Why storytelling matters in catalyzing systemic change, and how Atlas Sanctum uses cinema to inspire regenerative futures.",
    category: "behind-the-scenes",
    date: "2026-05-12",
    readTime: 7,
    image: "📖",
  },
];

const categories = [
  { id: "all", label: "All Articles" },
  { id: "regeneration", label: "Regeneration" },
  { id: "innovation", label: "Innovation" },
  { id: "vision", label: "Vision" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
];

const categoryColors: Record<string, string> = {
  regeneration: "bg-emerald-900/20 text-emerald-400 border-emerald-500/30",
  innovation: "bg-cyan-900/20 text-cyan-400 border-cyan-500/30",
  vision: "bg-amber-900/20 text-amber-400 border-amber-500/30",
  "behind-the-scenes": "bg-purple-900/20 text-purple-400 border-purple-500/30",
};

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  const featuredArticles = articles.filter((article) => article.featured);
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="accent-line mb-6 w-12" />
            <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-6">
              Resources & Insights
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore articles about regenerative systems, sustainability innovations, and the vision behind Atlas Sanctum. Learn how we're building a future where humanity thrives in harmony with nature.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {selectedCategory === "all" && featuredArticles.length > 0 && (
        <section className="py-20 md:py-32 border-b border-border">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="mb-12">
              <p className="text-sm text-accent font-['Space_Grotesk'] uppercase tracking-widest mb-2">
                Featured
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] uppercase tracking-wider">
                Must Read
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group rounded-lg overflow-hidden border border-border bg-card hover:border-accent/50 transition-all duration-300 glow-accent-hover flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-secondary/50 flex items-center justify-center overflow-hidden group-hover:bg-secondary transition-colors">
                    <span className="text-6xl">{article.image}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-semibold border ${
                          categoryColors[article.category]
                        }`}
                      >
                        {categories.find((c) => c.id === article.category)
                          ?.label}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.date)}
                        </div>
                        <div>{article.readTime} min read</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm font-['Space_Grotesk'] uppercase tracking-widest transition-all ${
                  selectedCategory === category.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article, index) => (
              <article
                key={article.id}
                className="group rounded-lg overflow-hidden border border-border bg-card hover:border-accent/50 transition-all duration-300 glow-accent-hover flex flex-col fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-40 bg-secondary/50 flex items-center justify-center overflow-hidden group-hover:bg-secondary transition-colors">
                  <span className="text-5xl">{article.image}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold border ${
                        categoryColors[article.category]
                      }`}
                    >
                      {categories.find((c) => c.id === article.category)
                        ?.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime} min
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border bg-gradient-to-b from-secondary/30 to-background">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="accent-line mx-auto mb-6 w-12" />
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-6">
            Stay Informed
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive new articles, insights, and updates about regenerative futures.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            asChild
          >
            <a href="/#contact">Subscribe Now</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
