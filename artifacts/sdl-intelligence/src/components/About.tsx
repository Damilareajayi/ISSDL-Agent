import { BookOpen, Award } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-background relative border-t border-border"
      data-testid="section-about"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="fade-in-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 uppercase tracking-wide">
              Advancing the Science of Learning
            </h2>
            <div className="space-y-6 font-body text-muted-foreground text-lg leading-relaxed">
              <p>
                SDL Intelligence serves as the central nervous system for academic inquiry into Self-Directed Learning. We bridge geographical and institutional divides to accelerate the discovery of how individuals take initiative in diagnosing their learning needs.
              </p>
              <p>
                Our platform aggregates decades of theoretical frameworks, empirical studies, and practical assessments into an interactive, AI-enhanced knowledge base.
              </p>
              <p>
                By connecting researchers, educators, and practitioners, we aim to evolve the paradigms of lifelong learning for the modern era.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8 fade-in-up hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#3B82F618", color: "#3B82F6" }}>
                  <BookOpen size={28} strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">RECAST Lab</h3>
                  <p className="font-body font-medium mb-1" style={{ color: "#3B82F6" }}>Florida State University</p>
                  <p className="text-sm text-muted-foreground">Research on Educational Cognition, Assessment, and Self-Regulation Technologies.</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 fade-in-up hover:shadow-lg transition-shadow duration-300" style={{ transitionDelay: "150ms" }}>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#e6394618", color: "#e63946" }}>
                  <Award size={28} strokeWidth={1.6} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">SDL Research Lab</h3>
                  <p className="font-body font-medium mb-1" style={{ color: "#e63946" }}>North-West University, South Africa</p>
                  <p className="text-sm text-muted-foreground">Leading center of excellence in advancing self-directed learning scholarship globally.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
