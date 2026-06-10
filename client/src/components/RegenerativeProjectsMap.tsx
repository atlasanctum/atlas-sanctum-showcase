import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MapPin, ExternalLink } from "lucide-react";
import { MapView } from "@/components/Map";

const PROJECT_CATEGORIES = [
  { value: "agriculture", label: "🌾 Agriculture", color: "from-green-900 to-emerald-900" },
  { value: "energy", label: "⚡ Energy", color: "from-yellow-900 to-amber-900" },
  { value: "water", label: "💧 Water", color: "from-blue-900 to-cyan-900" },
  { value: "forest", label: "🌲 Forest", color: "from-green-800 to-teal-900" },
  { value: "ocean", label: "🌊 Ocean", color: "from-blue-800 to-cyan-800" },
  { value: "urban", label: "🏙️ Urban", color: "from-gray-800 to-slate-900" },
];

export function RegenerativeProjectsMap() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const projectsQuery = trpc.projects.list.useQuery({ category: selectedCategory });

  // Update markers when projects change
  useEffect(() => {
    if (!mapRef.current || !projectsQuery.data) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    projectsQuery.data.forEach((project: any) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(project.latitude),
          lng: parseFloat(project.longitude),
        },
        map: mapRef.current,
        title: project.name,
      });

      marker.addListener("click", () => {
        setSelectedProject(project);
      });

      markersRef.current.push(marker);
    });
  }, [projectsQuery.data]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] uppercase tracking-wider mb-2">
          Global Regenerative Projects
        </h2>
        <p className="text-muted-foreground">
          Discover real-world regenerative initiatives happening today that align with the Atlas Sanctum vision.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedCategory === undefined
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
        >
          All Projects
        </button>
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === cat.value
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map and Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-4 border-border h-96 overflow-hidden">
            <MapView
              initialCenter={{ lat: 20, lng: 0 }}
              initialZoom={2}
              onMapReady={(map: google.maps.Map) => {
                mapRef.current = map;
              }}
            />
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-muted-foreground">
            {projectsQuery.data?.length || 0} Projects
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {projectsQuery.isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
            ) : projectsQuery.data && projectsQuery.data.length > 0 ? (
              projectsQuery.data.map((project: any) => (
                <Card
                  key={project.id}
                  className={`p-4 border-border cursor-pointer transition-all hover:border-accent/50 ${
                    selectedProject?.id === project.id ? "border-accent bg-accent/10" : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="font-bold text-sm text-foreground line-clamp-2">{project.name}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{project.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No projects found in this category
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Details */}
      {selectedProject && (
        <Card className="p-6 border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedProject.imageUrl && (
              <div className="md:col-span-1">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <div className={selectedProject.imageUrl ? "md:col-span-2" : "md:col-span-3"}>
              <h3 className="text-2xl font-bold mb-2">{selectedProject.name}</h3>
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{selectedProject.location}</span>
              </div>
              <p className="text-foreground mb-4">{selectedProject.description}</p>
              {selectedProject.impact && (
                <div className="mb-4">
                  <p className="font-semibold text-sm text-accent mb-2">Environmental Impact</p>
                  <p className="text-sm text-foreground">{selectedProject.impact}</p>
                </div>
              )}
              {selectedProject.website && (
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <a href={selectedProject.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Project
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
