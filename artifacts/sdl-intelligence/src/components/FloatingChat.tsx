import { MessageSquare } from "lucide-react";

export default function FloatingChat() {
  const openChat = () => {
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end gap-2">
      <button
        onClick={openChat}
        className="group flex items-center gap-2.5 rounded-full shadow-2xl font-heading font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]"
        style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", paddingLeft: "1rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
        aria-label="Chat with SDL Agent"
      >
        {/* Pulse ring */}
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: "var(--primary)", animation: "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite" }}
          />
          <MessageSquare size={16} className="relative" />
        </span>
        <span className="hidden sm:inline whitespace-nowrap">Chat with SDL Agent</span>
        <span className="sm:hidden">Chat</span>
      </button>
    </div>
  );
}
