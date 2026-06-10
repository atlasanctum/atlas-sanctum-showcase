import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  impact: string;
  color: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 2050,
    title: "The Crisis Point",
    subtitle: "Global Reckoning",
    description:
      "Humanity faces an existential crossroads. Environmental collapse, social fragmentation, and institutional failure converge.",
    details: [
      "Global temperatures rise 2.8°C above pre-industrial levels",
      "Mass migration displaces 500+ million people",
      "Trust in institutions falls to historic lows",
      "Biodiversity loss reaches 68% since 1970",
    ],
    impact:
      "This moment catalyzes a fundamental shift in human consciousness. The old systems are broken. A new question emerges.",
    color: "from-red-900/20 to-orange-900/20",
  },
  {
    year: 2060,
    title: "The Question",
    subtitle: "A New Paradigm",
    description:
      "A generation asks: What if prosperity came from restoration instead of extraction?",
    details: [
      "First regenerative cities emerge in Africa and Southeast Asia",
      "Vertical farming feeds 2 billion people",
      "Renewable energy reaches 80% of global supply",
      "Trust-based currencies begin replacing fiat systems",
    ],
    impact:
      "Early adopters prove that regeneration is not sacrifice—it's abundance. The model spreads exponentially.",
    color: "from-yellow-900/20 to-emerald-900/20",
  },
  {
    year: 2075,
    title: "The Turning Point",
    subtitle: "Acceleration",
    description:
      "The Atlas Sanctum Network activates globally. Regeneration becomes the dominant economic model.",
    details: [
      "Planetary intelligence network connects 8 billion people",
      "Amazon rainforest begins regeneration after 50 years of protection",
      "Ocean acidification reverses for the first time",
      "Global GDP redefines to measure wellbeing, not extraction",
    ],
    impact:
      "The shift becomes irreversible. Regeneration is now faster and more profitable than destruction.",
    color: "from-cyan-900/20 to-emerald-900/20",
  },
  {
    year: 2090,
    title: "The Flourishing",
    subtitle: "Abundance",
    description:
      "Earth's ecosystems recover. Biodiversity increases. Humans and nature thrive in symbiosis.",
    details: [
      "Biodiversity increases to 120% of 2000 baseline",
      "Carbon levels return to pre-industrial levels",
      "Global population stabilizes at 9 billion with high wellbeing",
      "Space colonization begins with regenerative principles",
    ],
    impact:
      "Humanity has learned the greatest lesson: the most valuable technology is collective wisdom.",
    color: "from-emerald-900/20 to-cyan-900/20",
  },
  {
    year: 2100,
    title: "The New Civilization",
    subtitle: "Legacy",
    description:
      "A new era of human civilization. Regeneration is the foundation of all systems.",
    details: [
      "Intergenerational wealth measured in ecosystem health",
      "Trust is the primary currency of civilization",
      "Humans live in harmony with nature across Earth and beyond",
      "The question is answered: We chose wisdom.",
    ],
    impact:
      "The granddaughter looks out at a healed world. 'Why did people ever destroy things to become wealthy?' The grandfather smiles. 'Because they had not yet learned a better way.'",
    color: "from-amber-900/20 to-yellow-900/20",
  },
];

export function InteractiveTimeline() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2075);

  return (
    <section className="py-20 md:py-32 border-y border-border">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="accent-line mx-auto mb-6 w-12" />
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
            The Journey: 2050-2100
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An interactive exploration of humanity's transformation from crisis to regeneration
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.year} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() =>
                  setExpandedYear(expandedYear === event.year ? null : event.year)
                }
                className="w-full text-left"
              >
                <div
                  className={`relative rounded-lg border transition-all duration-300 overflow-hidden ${
                    expandedYear === event.year
                      ? "border-accent/50 bg-card"
                      : "border-border bg-card/30 hover:border-accent/30 hover:bg-card/50"
                  }`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Content */}
                  <div className="relative p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-16 h-16 bg-accent/20 border border-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold font-['Space_Grotesk'] text-accent">
                              {event.year}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold font-['Space_Grotesk'] uppercase tracking-wider text-foreground">
                              {event.title}
                            </h3>
                            <p className="text-sm text-accent font-['Space_Grotesk'] uppercase tracking-widest">
                              {event.subtitle}
                            </p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronDown
                          className={`w-6 h-6 text-accent transition-transform duration-300 ${
                            expandedYear === event.year ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedYear === event.year && (
                    <div className="relative border-t border-border bg-secondary/30 p-6 md:p-8 space-y-6">
                      {/* Key Milestones */}
                      <div>
                        <h4 className="text-sm font-semibold font-['Space_Grotesk'] uppercase tracking-widest text-accent mb-3">
                          Key Milestones
                        </h4>
                        <ul className="space-y-2">
                          {event.details.map((detail, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-foreground leading-relaxed"
                            >
                              <span className="text-accent font-bold flex-shrink-0">
                                ✓
                              </span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact */}
                      <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-sm font-semibold font-['Space_Grotesk'] uppercase tracking-widest text-accent mb-2">
                          Impact & Significance
                        </p>
                        <p className="text-foreground leading-relaxed italic">
                          {event.impact}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress in Journey</span>
                          <span>
                            {Math.round(
                              ((event.year - 2050) / (2100 - 2050)) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-accent to-sidebar-accent h-full transition-all duration-500"
                            style={{
                              width: `${((event.year - 2050) / (2100 - 2050)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            This timeline represents one possible future—a path where humanity chooses wisdom over domination, restoration over extraction, and collective intelligence over isolated power.
          </p>
          <p className="text-foreground font-semibold">
            The choices we make today determine which timeline becomes reality.
          </p>
        </div>
      </div>
    </section>
  );
}
