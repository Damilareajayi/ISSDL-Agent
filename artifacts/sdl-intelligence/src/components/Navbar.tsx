import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#05070f]/90 glass-nav py-4 border-b border-[#1e3054]" : "bg-transparent py-6"
      }`}
      data-testid="navbar"
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="font-heading font-bold text-sm tracking-wider text-[#4f8ef7] cursor-pointer"
          onClick={() => scrollTo("hero")}
          data-testid="link-logo"
        >
          SDL INTELLIGENCE
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollTo("features")}
            className="text-sm font-medium text-[#8a9bc2] hover:text-[#f0f4ff] transition-colors"
            data-testid="link-features"
          >
            Features
          </button>
          <button 
            onClick={() => scrollTo("chat")}
            className="text-sm font-medium text-[#8a9bc2] hover:text-[#f0f4ff] transition-colors"
            data-testid="link-chat"
          >
            Chat
          </button>
          <button 
            onClick={() => scrollTo("about")}
            className="text-sm font-medium text-[#8a9bc2] hover:text-[#f0f4ff] transition-colors"
            data-testid="link-about"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
}
