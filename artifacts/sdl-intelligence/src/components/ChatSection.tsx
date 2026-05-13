import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Bot, User, Sparkles, Plus, Trash2, Copy, Check, MessageSquare } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; messages: Message[]; updatedAt: number };

const WELCOME: Message = {
  role: "assistant",
  content: "Hello! I'm the SDL Intelligence research assistant. I can help you explore SDL frameworks, research, labs, and more. What would you like to know?",
};

const SUGGESTIONS = [
  "Explain Garrison's 3D SDL framework",
  "SDL research in African contexts?",
  "Compare Knowles, Garrison, and Candy",
  "Current trends in SDL research?",
];

const STORAGE_KEY = "sdl-conversations";
const ACTIVE_KEY = "sdl-active-id";

function genId() { return `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function load(): Conversation[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function save(convs: Conversation[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(convs)); } catch {}
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
        <Bot size={15} />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-border text-muted-foreground hover:text-foreground"
      title="Copy"
    >
      {done ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

export default function ChatSection() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = load();
    const lastId = localStorage.getItem(ACTIVE_KEY);
    setConvs(saved);
    if (saved.length > 0) {
      setActiveId(saved.find(c => c.id === lastId)?.id ?? saved[0].id);
    }
  }, []);

  useEffect(() => { if (convs.length) save(convs); }, [convs]);
  useEffect(() => { if (activeId) localStorage.setItem(ACTIVE_KEY, activeId); }, [activeId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convs, loading, activeId]);

  const active = convs.find(c => c.id === activeId);
  const messages = active?.messages ?? [WELCOME];
  const hasUserMsg = messages.some(m => m.role === "user");

  const newChat = useCallback(() => {
    const conv: Conversation = { id: genId(), title: "New conversation", messages: [WELCOME], updatedAt: Date.now() };
    setConvs(prev => [conv, ...prev]);
    setActiveId(conv.id);
    setInput("");
    textareaRef.current?.focus();
  }, []);

  const deleteConv = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvs(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      if (!next.length) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(ACTIVE_KEY); }
      return next;
    });
  }, [activeId]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    let cid = activeId;
    let base = messages;

    if (!cid) {
      const conv: Conversation = { id: genId(), title: trimmed.slice(0, 50), messages: [WELCOME], updatedAt: Date.now() };
      setConvs(prev => [conv, ...prev]);
      setActiveId(conv.id);
      cid = conv.id;
      base = [WELCOME];
    }

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...base, userMsg];
    const isFirst = !base.some(m => m.role === "user");

    setConvs(prev => prev.map(c => c.id === cid ? {
      ...c, messages: next, updatedAt: Date.now(),
      title: isFirst ? trimmed.slice(0, 50) : c.title,
    } : c));

    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Server error (HTTP ${res.status})`);
      }
      const data = (await res.json()) as { content: string };
      setConvs(prev => prev.map(c => c.id === cid ? {
        ...c, messages: [...next, { role: "assistant", content: data.content }], updatedAt: Date.now(),
      } : c));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setConvs(prev => prev.map(c => c.id === cid ? {
        ...c, messages: [...next, { role: "assistant", content: `Error: ${msg}` }], updatedAt: Date.now(),
      } : c));
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
  }

  function onInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  }

  return (
    <section id="chat" className="py-24 bg-background relative border-t border-border" data-testid="section-chat">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase tracking-wide">
            SDL Knowledge Agent
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Ask about frameworks, research, labs, and more.
          </p>
        </div>

        <div className="flex bg-card border border-border rounded-2xl overflow-hidden shadow-xl h-[520px] sm:h-[600px] md:h-[660px]">

          {/* ── Sidebar ── */}
          <div className="hidden md:flex w-56 flex-col border-r border-border bg-background shrink-0">
            <div className="p-3 border-b border-border">
              <button
                onClick={newChat}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus size={15} /> New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {convs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center mt-10 px-3 leading-relaxed">
                  Start a conversation — it will appear here
                </p>
              ) : convs.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors group flex items-center gap-2 ${
                    activeId === conv.id
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-border/40 hover:text-foreground"
                  }`}
                >
                  <MessageSquare size={12} className="shrink-0 opacity-50" />
                  <span className="truncate flex-1">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConv(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded hover:text-destructive transition-all"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </button>
              ))}
            </div>
          </div>

          {/* ── Chat area ── */}
          <div className="flex flex-col flex-1 min-w-0">

            {/* Header */}
            <div className="bg-background border-b border-border px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Bot size={15} />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm leading-tight">SDL Research Assistant</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles size={9} className="text-primary" />
                    <span>Gemini · SDL knowledge base</span>
                  </div>
                </div>
              </div>
              <button
                onClick={newChat}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                <Plus size={12} /> New
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 font-body">
              {messages.map((msg, i) =>
                msg.role === "assistant" ? (
                  <div key={i} className="flex gap-3 items-start group max-w-[88%]">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Bot size={13} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-muted-foreground font-medium px-1">SDL Assistant</span>
                      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      <div className="flex px-1">
                        <CopyBtn text={msg.content} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 items-start justify-end group max-w-[88%] self-end">
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[11px] text-muted-foreground font-medium px-1">You</span>
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                      <div className="flex justify-end px-1">
                        <CopyBtn text={msg.content} />
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-foreground/10 border border-border flex items-center justify-center text-foreground shrink-0 mt-0.5">
                      <User size={13} />
                    </div>
                  </div>
                )
              )}

              {loading && <TypingIndicator />}

              {!hasUserMsg && !loading && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="text-xs px-3 py-2 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-background border-t border-border shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={onInput}
                  onKeyDown={onKey}
                  placeholder="Ask a question about SDL… (Enter to send, Shift+Enter for new line)"
                  disabled={loading}
                  rows={1}
                  className="flex-1 bg-card border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60 resize-none text-sm leading-relaxed"
                  data-testid="input-chat"
                />
                <button
                  onClick={() => void send(input)}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  data-testid="button-chat-send"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 text-center mt-2">
                Grounded in peer-reviewed SDL research · Powered by Gemini AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
