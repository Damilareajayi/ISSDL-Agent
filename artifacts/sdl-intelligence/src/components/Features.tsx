import { useState, useRef, useEffect } from "react";
import { MessageSquare, TrendingUp, Compass, Globe, Calendar, CheckSquare, X, ExternalLink } from "lucide-react";

const FRAMEWORKS = [
  {
    name: "Knowles' Andragogy", year: "1975",
    summary: "Six core assumptions about adult learners that underpin SDL.",
    points: [
      "Self-concept: Adults move from dependency toward self-directedness as they mature.",
      "Experience: Adults accumulate experience that becomes a rich resource for learning.",
      "Readiness: Adults become ready to learn things needed to cope with real-life situations.",
      "Orientation: Adults are life- and problem-centered, not subject-centered.",
      "Motivation: Adults are primarily internally motivated.",
      "Need to know: Adults need to know why they need to learn something before learning it.",
    ],
  },
  {
    name: "Garrison's 3D Model", year: "1997",
    summary: "Three interactive dimensions of SDL on a continuum.",
    points: [
      "Self-Management (external): Learner control over the instructional process, task management, and use of resources.",
      "Self-Monitoring (internal): Metacognitive awareness — monitoring and evaluating one's own learning strategies.",
      "Motivation: Entering motivation initiates the process; task motivation sustains it.",
      "Key insight: True SDL integrates all three dimensions; weakness in any one undermines the others.",
    ],
  },
  {
    name: "Candy's Constructivist Model", year: "1991",
    summary: "SDL as four related but distinct phenomena.",
    points: [
      "Personal autonomy as a goal of education.",
      "Self-management of the learning process.",
      "Learner control of instruction within formal settings.",
      "Autodidaxy: self-teaching outside formal settings.",
      "Key insight: SDL competence is domain-specific — a person may be self-directed in one field and dependent in another.",
    ],
  },
  {
    name: "Zimmerman's Self-Regulation", year: "2000",
    summary: "Social-cognitive framework closely related to SDL.",
    points: [
      "Forethought Phase: Goal setting, strategic planning, self-efficacy beliefs, intrinsic motivation.",
      "Performance Phase: Self-instruction, attention focusing, task strategies, self-monitoring.",
      "Self-Reflection Phase: Self-judgment, attributions, self-evaluation, adaptation.",
    ],
  },
  {
    name: "PRO Model (Brockett & Hiemstra)", year: "1991",
    summary: "Personal Responsibility Orientation to SDL.",
    points: [
      "SDL is both a teaching-learning process AND a personality characteristic.",
      "Self-direction in learning is grounded in personal responsibility.",
      "Linked to humanistic philosophy — the learner has agency and moral accountability for their own growth.",
    ],
  },
];

const LABS = [
  {
    name: "NWU SDL Research Unit", location: "Potchefstroom, South Africa",
    lead: "Prof. Elsa Mentz, Prof. Josef de Beer",
    focus: "SDL in African and Global South HE, cooperative learning, OER, 4IR, metacognition.",
    url: "https://education.nwu.ac.za/research-unit-self-directed-learning/home",
    highlight: "Malcolm Knowles SDL Award recipient · UNESCO Chair on Multimodal Learning & OER · Editors of the 17-volume AOSIS SDL series",
  },
  {
    name: "RECAST Lab — FSU", location: "Florida State University, USA",
    lead: "Dr. Bret Staudt Willet",
    focus: "Research & Exploration of Context-Aware Self-Teaching. Iterative, context-sensitive SDL methodology.",
    url: "https://recast.team/",
    highlight: "Affiliated with ISSDL · D&D-inspired iterative design-and-test approach to SDL",
  },
  {
    name: "ISSDL — International Society for SDL", location: "Global (USA-based)",
    lead: "Rotating leadership",
    focus: "Annual SDL symposium, Malcolm Knowles Award, global SDL research network.",
    url: "https://www.sdlglobal.com/",
    highlight: "Hosts the annual International Symposium on SDL · Publishes the International Journal of SDL",
  },
  {
    name: "Florida Atlantic University", location: "Boca Raton, USA",
    lead: "Lucy Guglielmino (emerita)",
    focus: "Developer of the SDLRS — the most widely used SDL measurement instrument (500+ published studies).",
    url: null,
    highlight: "SDLRS now in 29 languages · Foundation of SDL measurement research",
  },
  {
    name: "University of Tennessee", location: "Knoxville, USA",
    lead: "Ralph Brockett (emeritus)",
    focus: "PRO model of SDL, SDL philosophy, ethics of self-directed learning.",
    url: null,
    highlight: "Co-authored foundational PRO model text (Brockett & Hiemstra, 1991)",
  },
];

const EVENTS = [
  {
    name: "International Symposium on SDL", org: "ISSDL / SDL Global",
    cadence: "Annual (typically February, Florida, USA)",
    description: "The flagship global SDL event, running since 1986. Scholars, practitioners, and students present SDL research and debate theoretical developments.",
    url: "https://www.sdlglobal.com/",
  },
  {
    name: "Malcolm S. Knowles SDL Award", org: "ISSDL",
    cadence: "Awarded annually at the symposium",
    description: "The field's most prestigious individual award, given to a researcher who has made outstanding contributions to SDL theory and practice. Prof. Elsa Mentz (NWU) is a recipient.",
    url: null,
  },
  {
    name: "NWU SDL Conferences & Workshops", org: "NWU Research Unit SDL",
    cadence: "Periodic (check NWU education faculty website)",
    description: "The NWU SDL Research Unit hosts thematic conferences and postgraduate writing retreats focused on SDL in South African and African higher education contexts.",
    url: "https://education.nwu.ac.za/research-unit-self-directed-learning/home",
  },
  {
    name: "AOSIS SDL Book Series — Open Calls", org: "AOSIS Publishing / NWU SDL Unit",
    cadence: "Ongoing — new volumes added periodically",
    description: "17 volumes published (2019–2025). Authors interested in contributing to future volumes should contact the NWU SDL Research Unit. All volumes are open access.",
    url: "https://books.aosis.co.za/index.php/ob/catalog/series/sdl",
  },
];

const QUESTIONS = [
  { dimension: "Initiative", text: "I actively seek out learning opportunities without being told to." },
  { dimension: "Goal-Setting", text: "I set clear, specific goals for what I want to learn." },
  { dimension: "Self-Monitoring", text: "I regularly reflect on whether my learning strategies are working." },
  { dimension: "Responsibility", text: "I take full responsibility for my own learning successes and failures." },
  { dimension: "Resource Use", text: "I confidently identify and use a variety of resources to learn something new." },
  { dimension: "Motivation", text: "I am internally motivated to learn even when no one is grading me." },
];

const SCORE_LABELS = [
  { min: 6, max: 12, level: "Dependent Learner", color: "text-red-500", detail: "You rely heavily on others to direct your learning. Consider building habits around goal-setting and self-reflection." },
  { min: 13, max: 20, level: "Interested Learner", color: "text-yellow-500", detail: "You have some SDL habits but still need external structure. Focus on developing initiative and monitoring your own progress." },
  { min: 21, max: 26, level: "Involved Learner", color: "text-blue-500", detail: "You demonstrate solid SDL skills. With practice you can become more consistent in all dimensions." },
  { min: 27, max: 30, level: "Self-Directed Learner", color: "text-emerald-500", detail: "You show strong SDL readiness across all dimensions. You actively drive your own learning — keep building on it." },
];

function SelfAssessmentPanel() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);
  const total = Object.values(answers).reduce((s, v) => s + v, 0);
  const result = submitted ? SCORE_LABELS.find((l) => total >= l.min && total <= l.max) : null;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Rate each statement 1 (strongly disagree) → 5 (strongly agree). Based on the Self-Directed Learning Readiness Scale (SDLRS) dimensions.
      </p>
      {QUESTIONS.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="text-foreground text-sm">
            <span className="text-primary text-xs font-semibold uppercase tracking-wide mr-2">{q.dimension}</span>
            {q.text}
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => { setAnswers((a) => ({ ...a, [i]: v })); setSubmitted(false); }}
                className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${
                  answers[i] === v
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        disabled={!allAnswered}
        onClick={() => setSubmitted(true)}
        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-heading font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-opacity"
      >
        See My SDL Readiness Score
      </button>
      {result && (
        <div className="bg-background border border-border rounded-xl p-5 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">{total}<span className="text-base text-muted-foreground font-normal">/30</span></span>
            <span className={`font-heading font-bold text-lg ${result.color}`}>{result.level}</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{result.detail}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="text-xs text-primary hover:underline">Reset</button>
        </div>
      )}
    </div>
  );
}

function FrameworkPanel() {
  const [active, setActive] = useState(0);
  const fw = FRAMEWORKS[active];
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6">
      <nav className="flex flex-col gap-1">
        {FRAMEWORKS.map((f, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
              active === i
                ? "bg-primary/10 border border-primary/40 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            <span className="block font-medium">{f.name}</span>
            <span className="text-xs opacity-60">{f.year}</span>
          </button>
        ))}
      </nav>
      <div className="space-y-4">
        <div>
          <h4 className="font-heading font-bold text-foreground text-lg">{fw.name} <span className="text-primary text-sm">({fw.year})</span></h4>
          <p className="text-muted-foreground text-sm mt-1">{fw.summary}</p>
        </div>
        <ul className="space-y-2">
          {fw.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">›</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LabsPanel() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {LABS.map((lab, i) => (
        <div key={i} className="bg-background border border-border rounded-xl p-4 space-y-2 hover:border-primary/40 transition-colors">
          <h4 className="font-heading font-semibold text-sm leading-snug">
            {lab.url ? (
              <a
                href={lab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
              >
                {lab.name}
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ) : (
              <span className="text-foreground">{lab.name}</span>
            )}
          </h4>
          <p className="text-xs text-primary font-medium">{lab.location}</p>
          <p className="text-xs text-muted-foreground"><span className="text-foreground/70">Lead: </span>{lab.lead}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{lab.focus}</p>
          <p className="text-xs text-muted-foreground/70 italic">{lab.highlight}</p>
        </div>
      ))}
    </div>
  );
}

function EventsPanel() {
  return (
    <div className="space-y-4">
      {EVENTS.map((ev, i) => (
        <div key={i} className="bg-background border border-border rounded-xl p-4 flex gap-4">
          <div className="w-1 rounded-full bg-primary shrink-0" />
          <div className="space-y-1 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-heading font-semibold text-foreground text-sm">{ev.name}</h4>
              {ev.url && (
                <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-foreground shrink-0">
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <p className="text-xs text-primary">{ev.org} · {ev.cadence}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const features = [
  { id: "chat",       title: "SDL Knowledge Chat",    description: "Ask anything about SDL theory, research, and practice",              icon: MessageSquare, action: "scroll", target: "chat",     color: "#e63946" },
  { id: "research",   title: "Research Explorer",     description: "Discover the latest published work and emerging topics in SDL",       icon: TrendingUp,    action: "scroll", target: "research", color: "#3B82F6" },
  { id: "frameworks", title: "Framework Navigator",   description: "Explore Garrison, Knowles, Zimmerman, Candy, and more",              icon: Compass,       action: "panel",                      color: "#7C3AED" },
  { id: "labs",       title: "Global Research Labs",  description: "Find SDL research units and collaborators worldwide",                 icon: Globe,         action: "panel",                      color: "#06B6D4" },
  { id: "events",     title: "Symposia & Events",     description: "Stay current with ISSDL events, awards, and calls for papers",        icon: Calendar,      action: "panel",                      color: "#F59E0B" },
  { id: "assessment", title: "SDL Self-Assessment",   description: "Gauge your readiness for self-directed learning in 6 dimensions",    icon: CheckSquare,   action: "panel",                      color: "#10B981" },
] as const;

const PANEL_TITLES: Record<string, string> = {
  frameworks: "SDL Framework Navigator",
  labs: "Global SDL Research Labs",
  events: "Symposia & Events",
  assessment: "SDL Readiness Self-Assessment",
};

function PanelContent({ id }: { id: string }) {
  if (id === "frameworks") return <FrameworkPanel />;
  if (id === "labs") return <LabsPanel />;
  if (id === "events") return <EventsPanel />;
  if (id === "assessment") return <SelfAssessmentPanel />;
  return null;
}

export default function Features() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }); },
      { threshold: 0.1 }
    );
    const cards = document.querySelectorAll(".fade-in-up");
    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);

  function handleClick(feature: typeof features[number]) {
    if (feature.action === "scroll" && feature.target) {
      document.getElementById(feature.target)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const next = activePanel === feature.id ? null : feature.id;
    setActivePanel(next);
  }

  return (
    <section id="features" className="py-24 bg-background relative" data-testid="section-features">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase tracking-wide">
            Platform Capabilities
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isActive = activePanel === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => handleClick(feature)}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="text-left bg-card border rounded-2xl p-6 sm:p-8 fade-in-up transition-all duration-300 hover:-translate-y-2"
                style={{
                  transitionDelay: `${index * 80}ms`,
                  borderColor: (isActive || hoveredId === feature.id) ? feature.color : undefined,
                  boxShadow: isActive
                    ? `0 12px 40px ${feature.color}30`
                    : hoveredId === feature.id
                    ? `0 6px 24px ${feature.color}20`
                    : undefined,
                }}
                data-testid={`card-feature-${index}`}
              >
                {/* cchub-style rounded square icon badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    backgroundColor: `${feature.color}18`,
                    color: feature.color,
                    transform: hoveredId === feature.id ? "scale(1.12) rotate(-4deg)" : "scale(1)",
                  }}
                >
                  <feature.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3
                  className="font-heading text-lg sm:text-xl font-bold mb-3 transition-colors duration-200"
                  style={{ color: (isActive || hoveredId === feature.id) ? feature.color : undefined }}
                >
                  {feature.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                <p className="text-xs mt-4 font-semibold transition-opacity duration-200" style={{ color: feature.color }}>
                  {"action" in feature && feature.action === "scroll" ? "↓ Jump to section" : isActive ? "▲ Collapse" : "▼ Explore"}
                </p>
              </button>
            );
          })}
        </div>

        {activePanel && (() => {
          const activeFeat = features.find(f => f.id === activePanel);
          const activeColor = activeFeat?.color ?? "#e63946";
          return (
            <div
              ref={panelRef}
              className="mt-8 bg-card border rounded-2xl p-6 md:p-8"
              style={{ borderColor: `${activeColor}40` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${activeColor}18`, color: activeColor }}>
                    {activeFeat && <activeFeat.icon size={16} strokeWidth={1.8} />}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{PANEL_TITLES[activePanel]}</h3>
                </div>
                <button onClick={() => setActivePanel(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-border" aria-label="Close panel">
                  <X size={16} />
                </button>
              </div>
              <PanelContent id={activePanel} />
            </div>
          );
        })()}
      </div>
    </section>
  );
}
