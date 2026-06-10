import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GalleryModal } from "@/components/GalleryModal";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { EmailSignup } from "@/components/EmailSignup";
import { SocialShare } from "@/components/SocialShare";

/**
 * Atlas Sanctum Showcase - Home Page
 * 
 * Design Philosophy: Cinematic Futurism with Dark Elegance
 * - Deep charcoal backgrounds with sapphire blue and emerald green accents
 * - Full-bleed hero with layered imagery and audio player
 * - Vertical storyboard timeline with parallax effects
 * - Glowing accent lines and cinematic overlays
 */

const scenes = [
  {
    id: 1,
    title: "The Bleak Present",
    subtitle: "Year 2050 - A World in Crisis",
    description:
      "Wildfires consume forests. Oceans rise. Trust in institutions crumbles. Humanity faces unprecedented challenges.",
    image: "/manus-storage/scene1_bleak_present_4365f1c5.png",
    timeCode: "0:00 - 0:25",
    color: "from-red-900/20 to-orange-900/20",
    fullDescription:
      "The opening sequence establishes the stakes. Through news broadcasts and satellite imagery, we witness the consequences of extraction-based systems: environmental collapse, social unrest, and institutional breakdown. This is not a distant future—it is the trajectory we are on.",
  },
  {
    id: 2,
    title: "The Turning Point",
    subtitle: "Year 2075 - A New Question",
    description:
      "Humanity asks a different question: What if prosperity came from restoration instead of extraction? Vertical forests climb skyscrapers. Clean transit glides silently. The future awakens.",
    image: "/manus-storage/scene2_future_nairobi_effe1f0e.png",
    timeCode: "0:25 - 1:05",
    color: "from-emerald-900/20 to-cyan-900/20",
    fullDescription:
      "A young girl stands on a rooftop in future Nairobi, overlooking a city transformed. Vertical forests provide food and oxygen. Autonomous systems work alongside humans. The shift from extraction to restoration has begun, and the results are visible.",
  },
  {
    id: 3,
    title: "The New Civilization",
    subtitle: "Earth Regenerated",
    description:
      "The Atlas Sanctum Network activates. A glowing planetary web connects continents. Rainforests flourish. Coral reefs regenerate. Every act of healing creates value. Trust becomes the most valuable asset.",
    image: "/manus-storage/scene3_atlas_sanctum_89156d97.png",
    timeCode: "1:05 - 2:00",
    color: "from-cyan-900/20 to-emerald-900/20",
    fullDescription:
      "The Atlas Sanctum Network represents the infrastructure of regeneration. A global intelligence that connects humans, AI, and natural systems. When a child plants a tree, the system visualizes the future forest, the biodiversity that will flourish, and the prosperity that will result. Healing becomes visible, measurable, and valued.",
  },
  {
    id: 4,
    title: "The Final Hope",
    subtitle: "A Moment of Reflection",
    description:
      "A young girl asks her grandfather: 'Why did people ever destroy things to become wealthy?' He smiles, tears in his eyes. 'Because they had not yet learned a better way.'",
    image: "/manus-storage/scene4_final_hope_951f4581.png",
    timeCode: "2:40 - 3:00",
    color: "from-amber-900/20 to-yellow-900/20",
    fullDescription:
      "The final scene brings the narrative full circle. A moment of intergenerational wisdom. The grandfather's tears are not of sadness, but of relief—the realization that humanity found a better way. His granddaughter will grow up in a world where destruction is not the path to wealth, but restoration is.",
  },
];

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/manus-storage/atlas_sanctum_full_audio_130f01cb.wav"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 parallax"
          style={{
            backgroundImage: `url('/manus-storage/scene1_bleak_present_4365f1c5.png')`,
            backgroundAttachment: "fixed",
          }}
        />

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 cinematic-overlay" />

        {/* Content */}
        <div className="relative z-10 container max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Title and Description */}
            <div className="fade-in-up">
              <div className="accent-line mb-6 w-12" />
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Space_Grotesk'] uppercase tracking-wider">
                Atlas Sanctum
              </h1>
              <p className="text-xl md:text-2xl text-accent mb-4 font-['Space_Grotesk'] uppercase tracking-widest">
                The Age of Regeneration
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                A cinematic vision of Earth's future. Experience a hopeful journey from crisis to regeneration, where humanity learns that the greatest technology we ever created was each other.
              </p>

              {/* Audio Player */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 glow-accent-hover mb-8 max-w-md">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handlePlayPause}
                    className="flex-shrink-0 w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 glow-accent"
                  >
                    {isPlaying ? (
                      <div className="w-2 h-6 bg-current rounded-sm" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Voiceover & Score
                    </p>
                    <p className="text-xs text-muted-foreground">3:00 minutes</p>
                  </div>
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="bg-secondary rounded-full h-1 overflow-hidden cursor-pointer">
                    <div
                      className="bg-accent h-full transition-all duration-100"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={() => setSelectedSceneId(1)}
                >
                  Watch Storyboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10"
                  asChild
                >
                  <a href="/about">Learn More</a>
                </Button>
              </div>
            </div>

            {/* Right: Featured Scene */}
            <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="relative rounded-lg overflow-hidden glow-accent-hover">
                <img
                  src="/manus-storage/scene2_future_nairobi_effe1f0e.png"
                  alt="Future Nairobi"
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm text-accent font-['Space_Grotesk'] uppercase tracking-widest mb-2">
                    Year 2075
                  </p>
                  <p className="text-xl font-bold text-white">The Turning Point</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Storyboard Timeline Section */}
      <section className="py-20 md:py-32 bg-secondary/30" id="storyboard">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6 w-12" />
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-4">
              The Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A journey through four pivotal moments that define humanity's transformation
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-12">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className="fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:grid-cols-2 lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Image */}
                  <button
                    onClick={() => setSelectedSceneId(scene.id)}
                    className="relative rounded-lg overflow-hidden glow-accent-hover group cursor-pointer"
                  >
                    <img
                      src={scene.image}
                      alt={scene.title}
                      className="w-full h-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${scene.color}`} />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-accent/20 backdrop-blur-sm border border-accent/50 text-accent px-3 py-1 rounded text-xs font-['Space_Grotesk'] uppercase tracking-widest">
                        {scene.timeCode}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-accent font-['Space_Grotesk'] uppercase tracking-widest mb-2">
                        Scene {scene.id}
                      </p>
                      <h3 className="text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
                        {scene.title}
                      </h3>
                      <p className="text-lg text-muted-foreground font-semibold">
                        {scene.subtitle}
                      </p>
                    </div>
                    <p className="text-base text-foreground leading-relaxed">
                      {scene.description}
                    </p>
                    <div className="accent-line w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Email Signup Section */}
      <section className="py-20 md:py-32 border-t border-border" id="contact">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-8 md:p-12 glow-accent">
            <EmailSignup />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="accent-line mx-auto mb-6 w-12" />
          <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-6">
            What if intelligence was not the power to dominate the world...
          </h2>
          <p className="text-2xl text-accent font-['Space_Grotesk'] uppercase tracking-widest mb-8">
            ...but the wisdom to restore it?
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Atlas Sanctum represents a vision of humanity's potential. Through regenerative systems, global collaboration, and the wisdom to prioritize healing over extraction, we can build a future where every action creates value for all life on Earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              asChild
            >
              <a href="/about">Explore the Vision</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10"
              asChild
            >
              <a href="/resources">Read Articles</a>
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-border/30">
            <SocialShare
              title="Atlas Sanctum: The Age of Regeneration"
              description="Experience a cinematic vision of Earth's regenerative future."
              variant="compact"
            />
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      <GalleryModal
        scenes={scenes}
        isOpen={selectedSceneId !== null}
        onClose={() => setSelectedSceneId(null)}
        initialSceneId={selectedSceneId || undefined}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-accent mb-2">
                Project
              </p>
              <p className="text-foreground">Atlas Sanctum Showcase</p>
              <p className="text-sm text-muted-foreground mt-2">
                A cinematic vision of Earth's regenerative future
              </p>
            </div>
            <div>
              <p className="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-accent mb-2">
                Duration
              </p>
              <p className="text-foreground">3 Minutes</p>
              <p className="text-sm text-muted-foreground mt-2">
                Voiceover, orchestral score, and cinematic visuals
              </p>
            </div>
            <div>
              <p className="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-accent mb-2">
                Year
              </p>
              <p className="text-foreground">2026</p>
              <p className="text-sm text-muted-foreground mt-2">
                Created with Manus AI
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Atlas Sanctum. All rights reserved. | A vision for regeneration and hope.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
