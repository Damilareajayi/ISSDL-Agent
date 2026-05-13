export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8" data-testid="footer">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">

          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-primary tracking-wider mb-2">SDL INTELLIGENCE</h3>
            <p className="font-body text-muted-foreground text-sm max-w-sm">
              The global knowledge hub for Self-Directed Learning research and collaboration.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-body text-sm font-medium">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-muted-foreground hover:text-primary transition-colors">Home</button>
            <button onClick={() => scrollTo("features")} className="text-muted-foreground hover:text-primary transition-colors">Features</button>
            <button onClick={() => scrollTo("chat")} className="text-muted-foreground hover:text-primary transition-colors">Chat</button>
            <button onClick={() => scrollTo("about")} className="text-muted-foreground hover:text-primary transition-colors">About</button>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} SDL Intelligence. All rights reserved.</p>
          <p className="text-center md:text-right">A research initiative of RECAST Lab, FSU &amp; SDL Research Lab, NWU</p>
        </div>
      </div>
    </footer>
  );
}
