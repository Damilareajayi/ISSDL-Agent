import { useEffect, useRef, useState } from "react";

// Particle accent colors — used for stat numbers
const STATS = [
  { value: 600, suffix: "M+", label: "Papers Indexed",          color: "#FF5A45" },
  { value: 17,  suffix: "",   label: "Open-Access SDL Volumes", color: "#F59E0B" },
  { value: 40,  suffix: "+",  label: "Years of Research",       color: "#06B6D4" },
  { value: 5,   suffix: "",   label: "Global Research Labs",    color: "#10B981" },
];

const FULL_SUBTITLE = "Explore research, frameworks, and global collaboration in Self-Directed Learning";

function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return count;
}

function StatCounter({ value, suffix, label, color, triggered }: { value: number; suffix: string; label: string; color: string; triggered: boolean }) {
  const count = useCountUp(value, 1800, triggered);
  return (
    <div className="text-center">
      <div
        className="font-heading font-bold tabular-nums"
        style={{ fontSize: "clamp(22px, 5.5vw, 44px)", lineHeight: 1, color }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-body uppercase tracking-wider mt-2 leading-tight" style={{ fontSize: "clamp(9px, 2vw, 12px)", color: "var(--hero-text-subtle)" }}>
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [statsVisible, setStatsVisible] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  // Typewriter effect with short initial delay
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const timer = setInterval(() => {
        i++;
        setSubtitleText(FULL_SUBTITLE.slice(0, i));
        if (i >= FULL_SUBTITLE.length) {
          clearInterval(timer);
          setTypingDone(true);
        }
      }, 28);
      return () => clearInterval(timer);
    }, 600);
    return () => clearTimeout(delay);
  }, []);

  // Stats IntersectionObserver
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = {
      x: number; y: number; radius: number;
      dx: number; dy: number; alpha: number;
      pulse: number; pulseSpeed: number;
    };

    let particles: Particle[] = [];
    let animId: number;

    const getParticleColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--hero-particle").trim() || "79, 142, 247";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(160, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.4,
          dx: (Math.random() - 0.5) * 0.35,
          dy: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.55 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.012,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = getParticleColor();

      particles.forEach((p, i) => {
        p.x += p.dx; p.y += p.dy; p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${currentAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x, ddy = p.y - p2.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${0.12 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
      data-testid="section-hero"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: "90vw", height: "55vh",
          background: "radial-gradient(ellipse at center, rgba(var(--hero-particle),0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full px-5 sm:px-6" style={{ marginTop: "-4vh" }}>
        <p
          className="font-body uppercase font-medium mb-6 sm:mb-8 tracking-[0.12em] sm:tracking-[0.22em] text-[10px] sm:text-xs md:text-sm"
          style={{ color: "rgba(var(--hero-particle), 1)" }}
          data-testid="text-hero-eyebrow"
        >
          The Global Knowledge Hub for Self-Directed Learning
        </p>

        <h1
          ref={titleRef}
          className="font-heading font-bold uppercase leading-none w-full"
          style={{ fontSize: "clamp(36px, 11.5vw, 148px)", letterSpacing: "-0.01em", lineHeight: 0.95, color: "var(--hero-text)" }}
          data-testid="text-hero-title"
        >
          SDL
          <br />
          <span style={{ color: "rgba(var(--hero-particle), 1)", textShadow: "0 0 80px rgba(var(--hero-particle), 0.4)" }}>
            INTELLIGENCE
          </span>
        </h1>

        <div
          className="mt-8 sm:mt-10 mb-6 sm:mb-8"
          style={{
            width: "clamp(50px, 8vw, 120px)", height: "1px",
            background: "linear-gradient(to right, transparent, rgba(var(--hero-particle),1), transparent)",
            opacity: 0.6,
          }}
        />

        <p
          className="font-body max-w-xl text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-12 px-2"
          style={{ color: "var(--hero-text-muted)" }}
          data-testid="text-hero-subtitle"
        >
          {subtitleText}
          <span
            style={{
              color: "rgba(var(--hero-particle), 1)",
              animation: typingDone ? "blink 1s step-end infinite" : "none",
              fontWeight: 300,
            }}
          >|</span>
        </p>

        <button
          onClick={scrollToFeatures}
          className="font-heading font-bold uppercase tracking-widest px-8 sm:px-10 py-3.5 sm:py-4 rounded-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl text-xs sm:text-sm"
          style={{ letterSpacing: "0.15em", backgroundColor: "rgba(var(--hero-particle),1)", color: "#fff" }}
          data-testid="button-start-exploring"
        >
          Start Exploring
        </button>

        {/* Animated stat counters */}
        <div
          ref={statsRef}
          className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-6 sm:gap-y-8 w-full max-w-3xl"
          style={{ paddingTop: "1.25rem", borderTop: "1px solid rgba(var(--hero-particle),0.2)" }}
        >
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} triggered={statsVisible} />
          ))}
        </div>

        <p
          className="font-body mt-6 sm:mt-8 uppercase text-center px-4 leading-relaxed"
          style={{ color: "var(--hero-text-subtle)", fontSize: "clamp(8px, 2vw, 11px)", letterSpacing: "0.1em" }}
          data-testid="text-hero-powered-by"
        >
          RECAST Lab, Florida State University
          <span className="mx-2 hidden sm:inline">&middot;</span>
          <br className="sm:hidden" />
          SDL Research Lab, North-West University
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "clamp(50px, 6vw, 100px)" }}
        >
          <path
            d="M0,40 C200,90 400,10 600,50 C800,90 1000,20 1200,55 C1320,75 1380,45 1440,50 L1440,100 L0,100 Z"
            style={{ fill: "var(--background)" }}
          />
          <path
            d="M0,55 C180,20 360,80 540,50 C720,20 900,75 1080,45 C1240,20 1360,65 1440,55 L1440,100 L0,100 Z"
            style={{ fill: "var(--background)", opacity: 0.6 }}
          />
        </svg>
      </div>
    </section>
  );
}
