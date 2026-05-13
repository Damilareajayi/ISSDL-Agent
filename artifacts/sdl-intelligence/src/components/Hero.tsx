import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
      const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.4,
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
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${0.08 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.4;
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
          background: "radial-gradient(ellipse at center, rgba(var(--hero-particle), 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center w-full px-4" style={{ marginTop: "-4vh" }}>
        <p
          className="font-body text-primary uppercase tracking-[0.25em] text-sm mb-8 font-medium"
          style={{ letterSpacing: "0.3em" }}
          data-testid="text-hero-eyebrow"
        >
          The Global Knowledge Hub for Self-Directed Learning
        </p>

        <h1
          ref={titleRef}
          className="font-heading font-bold text-foreground uppercase leading-none"
          style={{ fontSize: "clamp(52px, 9.5vw, 148px)", letterSpacing: "-0.01em", lineHeight: 0.95 }}
          data-testid="text-hero-title"
        >
          SDL
          <br />
          <span className="text-primary" style={{ textShadow: "0 0 80px rgba(var(--hero-particle), 0.35)" }}>
            INTELLIGENCE
          </span>
        </h1>

        <div
          className="mt-10 mb-8"
          style={{
            width: "clamp(60px, 8vw, 120px)", height: "1px",
            background: "linear-gradient(to right, transparent, var(--primary), transparent)",
            opacity: 0.6,
          }}
        />

        <p className="font-body text-muted-foreground max-w-xl text-xl leading-relaxed mb-12" data-testid="text-hero-subtitle">
          Explore research, frameworks, and global collaboration in Self-Directed Learning
        </p>

        <button
          onClick={scrollToFeatures}
          className="font-heading font-bold uppercase tracking-widest px-10 py-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5"
          style={{ fontSize: "0.85rem", letterSpacing: "0.18em" }}
          data-testid="button-start-exploring"
        >
          Start Exploring
        </button>

        <p
          className="font-body text-muted-foreground text-xs mt-8 tracking-wider uppercase"
          style={{ opacity: 0.55, letterSpacing: "0.15em" }}
          data-testid="text-hero-powered-by"
        >
          RECAST Lab, Florida State University &nbsp;&middot;&nbsp; SDL Research Lab, North-West University
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
