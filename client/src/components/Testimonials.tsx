import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Atlas Sanctum presents a vision that is both inspiring and grounded in systems thinking. It shows us that regeneration is not just possible—it's inevitable if we build the right structures.",
    author: "Dr. Elena Okonkwo",
    role: "Environmental Systems Architect",
    avatar: "🌍",
  },
  {
    quote:
      "What struck me most was how the narrative bridges crisis and hope without glossing over the complexity. This is the kind of storytelling we need to catalyze real change.",
    author: "Marcus Chen",
    role: "Regenerative Innovation Lead",
    avatar: "🚀",
  },
  {
    quote:
      "The cinematic experience transforms abstract concepts into visceral understanding. Seeing Earth's regeneration unfold makes the possibility feel tangible.",
    author: "Amara Adeyemi",
    role: "Futures Strategist",
    avatar: "✨",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30 border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6 w-12" />
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
            Voices on Regeneration
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What leaders and innovators are saying about Atlas Sanctum
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-8 glow-accent-hover group hover:border-accent/50 transition-all duration-300 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
