import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      alpha: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(100, Math.floor(window.innerWidth / 15));
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 142, 247, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 142, 247, ${0.1 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #05070f 0%, #0d1b3e 100%)"
      }}
      data-testid="section-hero"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <h1 
          className="font-heading font-bold text-[#f0f4ff] uppercase tracking-tight mb-6"
          style={{ fontSize: "clamp(48px, 8vw, 72px)", lineHeight: 1.1 }}
          data-testid="text-hero-title"
        >
          SDL INTELLIGENCE
        </h1>
        <p 
          className="font-body text-[#8a9bc2] text-xl max-w-2xl mb-12 font-medium"
          data-testid="text-hero-subtitle"
        >
          Explore research, frameworks, and global collaboration in Self-Directed Learning
        </p>
        <button 
          onClick={scrollToFeatures}
          className="bg-[#4f8ef7] text-[#f0f4ff] font-heading font-bold uppercase tracking-wider px-8 py-4 rounded-md hover-glow transition-all duration-300"
          style={{ animation: "pulse-glow 2s infinite" }}
          data-testid="button-start-exploring"
        >
          Start Exploring
        </button>
      </div>
    </section>
  );
}
