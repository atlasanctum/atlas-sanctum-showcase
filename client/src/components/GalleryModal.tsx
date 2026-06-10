import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SocialShare } from "./SocialShare";

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  timeCode: string;
  fullDescription?: string;
}

interface GalleryModalProps {
  scenes: Scene[];
  isOpen: boolean;
  onClose: () => void;
  initialSceneId?: number;
}

export function GalleryModal({
  scenes,
  isOpen,
  onClose,
  initialSceneId = 1,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen && initialSceneId) {
      const index = scenes.findIndex((s) => s.id === initialSceneId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [isOpen, initialSceneId, scenes]);

  const currentScene = scenes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % scenes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0 border-border bg-background/95 backdrop-blur-sm">
        <div className="relative w-full h-full flex flex-col">
          {/* Close Button */}
          <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </DialogClose>

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Image Section */}
            <div className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden">
              <img
                src={currentScene.image}
                alt={currentScene.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Time Code Badge */}
              <div className="absolute top-6 left-6 bg-accent/20 backdrop-blur-sm border border-accent/50 text-accent px-4 py-2 rounded font-['Space_Grotesk'] uppercase tracking-widest text-sm">
                {currentScene.timeCode}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 hover:bg-accent/50 text-foreground hover:text-accent transition-all duration-200 group"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/50 hover:bg-accent/50 text-foreground hover:text-accent transition-all duration-200 group"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-96 bg-card border-l border-border p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Scene Number */}
                <div>
                  <p className="text-sm text-accent font-['Space_Grotesk'] uppercase tracking-widest mb-2">
                    Scene {currentScene.id} of {scenes.length}
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-accent to-sidebar-accent rounded-full" />
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
                    {currentScene.title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-semibold">
                    {currentScene.subtitle}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {currentScene.description}
                  </p>
                  {currentScene.fullDescription && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentScene.fullDescription}
                    </p>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Scene Progress</span>
                    <span>
                      {currentIndex + 1} / {scenes.length}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-300"
                      style={{
                        width: `${((currentIndex + 1) / scenes.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Social Share */}
                <div className="pt-4 border-t border-border">
                  <SocialShare
                    title={`${currentScene.title} - Atlas Sanctum`}
                    description={currentScene.description}
                    variant="compact"
                  />
                </div>

                {/* Navigation Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                  <p>← → Arrow keys to navigate</p>
                  <p>ESC to close</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
