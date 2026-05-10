import { useEffect, useRef } from "react";
import { MessageSquare, TrendingUp, Compass, Globe, Calendar, CheckSquare } from "lucide-react";

const features = [
  {
    title: "SDL Knowledge Chat",
    description: "Ask anything about SDL theory, research, and practice",
    icon: MessageSquare,
  },
  {
    title: "Research Trends",
    description: "Discover the latest published work and emerging topics in SDL",
    icon: TrendingUp,
  },
  {
    title: "Framework Navigator",
    description: "Explore Garrison, Knowles, Zimmerman, and more",
    icon: Compass,
  },
  {
    title: "Global Labs Map",
    description: "Find SDL research units and collaborators worldwide",
    icon: Globe,
  },
  {
    title: "Symposium & Events",
    description: "Stay current with ISSDL events, awards, and calls for papers",
    icon: Calendar,
  },
  {
    title: "SDL Self-Assessment",
    description: "Gauge your readiness for self-directed learning",
    icon: CheckSquare,
  }
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".fade-in-up");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section 
      id="features" 
      className="py-24 bg-[#05070f] relative"
      data-testid="section-features"
    >
      <div className="container mx-auto px-6 max-w-6xl" ref={containerRef}>
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#f0f4ff] mb-4 uppercase tracking-wide">
            Platform Capabilities
          </h2>
          <div className="h-1 w-24 bg-[#4f8ef7] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#0e1a2e] border border-[#1e3054] rounded-xl p-8 fade-in-up transition-all duration-300 hover:border-[#4f8ef7]/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(79,142,247,0.3)]"
              style={{ transitionDelay: `${index * 100}ms` }}
              data-testid={`card-feature-${index}`}
            >
              <div className="w-12 h-12 rounded-lg bg-[#05070f] border border-[#1e3054] flex items-center justify-center mb-6 text-[#4f8ef7]">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#f0f4ff] mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-[#8a9bc2] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
