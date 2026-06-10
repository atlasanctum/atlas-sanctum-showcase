import { Button } from "@/components/ui/button";
import { EmailSignup } from "@/components/EmailSignup";
import { SocialShare } from "@/components/SocialShare";
import { InteractiveTimeline } from "@/components/InteractiveTimeline";
import { CheckCircle, Zap, Globe, Users } from "lucide-react";

/**
 * About Page - Atlas Sanctum
 * 
 * Design Philosophy: Cinematic Futurism with Dark Elegance
 * Explains the regeneration narrative and vision behind Atlas Sanctum
 */

const pillars = [
  {
    icon: Globe,
    title: "Planetary Intelligence",
    description:
      "A global network that connects humans, AI systems, and natural ecosystems to make decisions that benefit all life on Earth.",
  },
  {
    icon: Users,
    title: "Collective Wisdom",
    description:
      "Humanity functioning as a single living organism, where diverse expertise and perspectives create solutions greater than any individual.",
  },
  {
    icon: Zap,
    title: "Regenerative Value",
    description:
      "Systems where every act of healing creates measurable value, transforming restoration from a cost into an opportunity.",
  },
  {
    icon: CheckCircle,
    title: "Trust as Currency",
    description:
      "A civilization built on credibility and shared values, where trust becomes the most valuable and tradeable asset.",
  },
];

const timeline = [
  {
    year: "2050",
    title: "The Crisis Point",
    description:
      "Wildfires consume forests. Oceans rise. Institutions fracture. Humanity faces an existential reckoning.",
  },
  {
    year: "2060",
    title: "The Question",
    description:
      "A new generation asks: What if prosperity came from restoration instead of extraction?",
  },
  {
    year: "2075",
    title: "The Turning Point",
    description:
      "The Atlas Sanctum Network activates. Vertical forests climb cities. Rivers are restored. The future awakens.",
  },
  {
    year: "2100",
    title: "The New Civilization",
    description:
      "Earth regenerated. Humanity expanded into space. Trust as the foundation of all systems.",
  },
];

const features = [
  {
    title: "Augmented Reality Decision Making",
    description:
      "Citizens view real-time consequences of present decisions, fostering conscious choices aligned with long-term wellbeing.",
  },
  {
    title: "Autonomous Regeneration Systems",
    description:
      "Robots and drones work alongside humans to restore ecosystems, plant forests, and heal damaged environments at scale.",
  },
  {
    title: "Immersive Knowledge Networks",
    description:
      "Children learn through holographic, interactive environments that make complex systems tangible and engaging.",
  },
  {
    title: "Planetary Intelligence API",
    description:
      "Farmers, scientists, and communities access real-time data on biodiversity, water cycles, and ecosystem health.",
  },
  {
    title: "Floating Ocean Cities",
    description:
      "Research and living communities harmoniously integrated with marine environments, advancing ocean restoration.",
  },
  {
    title: "Global Collaboration Hubs",
    description:
      "Physical and digital spaces where diverse professionals collaborate on regeneration projects across continents.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="accent-line mb-6 w-12" />
            <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-6">
              The Vision
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Atlas Sanctum represents humanity's potential when we choose wisdom over domination, restoration over extraction, and collective intelligence over isolated power.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              This is not a distant fantasy. It is a blueprint for the choices we can make today—a roadmap showing that a regenerative future is not only possible, but inevitable if we ask the right questions and build the right systems.
            </p>
          </div>
        </div>
      </section>

      {/* The Four Pillars */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6 w-12" />
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
              The Four Pillars
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The foundation of Atlas Sanctum rests on four interconnected principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-8 glow-accent-hover group hover:border-accent/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <InteractiveTimeline />

      {/* Social Share Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <SocialShare
            title="Atlas Sanctum: The Age of Regeneration"
            description="Explore a vision of Earth's regenerative future where humanity thrives in harmony with nature."
            variant="full"
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 bg-secondary/30 border-y border-border" style={{ display: "none" }}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6 w-12" />
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
              The Timeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From crisis to regeneration: the journey of human transformation
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div
                key={index}
                className="flex gap-8 items-start fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Year Badge */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-accent/20 border border-accent/50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold font-['Space_Grotesk'] text-accent">
                      {event.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6 w-12" />
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
              Key Systems & Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The technological and social innovations that make regeneration possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 glow-accent-hover group hover:border-accent/50 transition-all duration-300 fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-2 h-8 bg-gradient-to-b from-accent to-sidebar-accent rounded-full mb-4 group-hover:h-10 transition-all" />
                <h3 className="text-lg font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Message */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background border-t border-border">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="accent-line mx-auto w-12" />
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider">
              Why This Matters
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We stand at a crossroads. The old systems—built on extraction, competition, and short-term thinking—have brought us to the brink of collapse. But we have a choice.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Atlas Sanctum is a call to imagine differently. It asks: What if the most valuable technology we could build is not a machine, but a system of collective wisdom? What if the greatest wealth is not oil or gold, but the health of our planet and the trust between people?
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              This vision is not inevitable. It requires action, innovation, collaboration, and a fundamental shift in how we measure success. But it is possible. And it begins with asking the right question:
            </p>
            <p className="text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-wider text-accent">
              What if intelligence was not the power to dominate the world...
              <br />
              ...but the wisdom to restore it?
            </p>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-8 md:p-12 glow-accent">
            <EmailSignup />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-6">
            Ready to Explore?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Return to the home page to experience the full cinematic journey of Atlas Sanctum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              <a href="/">Back to Home</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
            >
              Share This Vision
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
