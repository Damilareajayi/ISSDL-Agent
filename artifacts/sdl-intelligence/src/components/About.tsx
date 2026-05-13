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
            <div className="bg-card border border-border rounded-xl p-8 fade-in-up">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-lg bg-background border border-border flex items-center justify-center text-primary">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">RECAST Lab</h3>
                  <p className="font-body text-muted-foreground mb-1">Florida State University</p>
                  <p className="text-sm text-muted-foreground/70">Research on Educational Cognition, Assessment, and Self-Regulation Technologies.</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 fade-in-up" style={{ transitionDelay: "150ms" }}>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-lg bg-background border border-border flex items-center justify-center text-primary">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">SDL Research Lab</h3>
                  <p className="font-body text-muted-foreground mb-1">North-West University, South Africa</p>
                  <p className="text-sm text-muted-foreground/70">Leading center of excellence in advancing self-directed learning scholarship globally.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
