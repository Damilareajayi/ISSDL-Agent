import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm the SDL Intelligence research assistant. How can I help you explore self-directed learning today?",
};

const SUGGESTIONS = [
  "Explain Garrison's multidimensional SDL framework",
  "What does SDL research look like in African contexts?",
  "Compare Knowles, Garrison, and Candy's SDL models",
  "What are current trends in self-directed learning research?",
];

function TypingIndicator() {
  return (
    <div className="flex gap-4 max-w-[85%]">
      <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7] shrink-0">
        <Bot size={18} />
      </div>
      <div className="bg-[#1e3054]/30 border border-[#1e3054] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#4f8ef7] animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-[#4f8ef7] animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-[#4f8ef7] animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const hasConversation = messages.length > 1;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { content: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't reach the server. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <section
      id="chat"
      className="py-24 bg-[#05070f] relative border-t border-[#1e3054]"
      data-testid="section-chat"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#f0f4ff] mb-4 uppercase tracking-wide">
            SDL Knowledge Agent
          </h2>
          <p className="font-body text-[#8a9bc2] text-lg max-w-2xl mx-auto">
            Ask about frameworks, research, labs, and more.
          </p>
        </div>

        <div className="bg-[#0e1a2e] border border-[#1e3054] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-[#05070f] border-b border-[#1e3054] p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#f0f4ff] text-sm">
                  Research Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#8a9bc2]">
                  <Sparkles size={10} className="text-[#4f8ef7]" />
                  <span>Powered by Gemini</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 font-body">
            {messages.map((msg, i) =>
              msg.role === "assistant" ? (
                <div key={i} className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7] shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="bg-[#1e3054]/30 border border-[#1e3054] rounded-2xl rounded-tl-sm p-4 text-[#f0f4ff] whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex gap-4 max-w-[85%] self-end flex-row-reverse"
                >
                  <div className="w-8 h-8 rounded bg-[#f0f4ff]/10 border border-[#f0f4ff]/20 flex items-center justify-center text-[#f0f4ff] shrink-0">
                    <User size={18} />
                  </div>
                  <div className="bg-[#4f8ef7] text-[#f0f4ff] rounded-2xl rounded-tr-sm p-4 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              ),
            )}

            {isLoading && <TypingIndicator />}

            {/* Suggestion chips — only before first user turn */}
            {!hasConversation && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#1e3054] text-[#8a9bc2] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-[#05070f] border-t border-[#1e3054] shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about SDL..."
                disabled={isLoading}
                className="w-full bg-[#0e1a2e] border border-[#1e3054] rounded-xl py-3 pl-4 pr-12 text-[#f0f4ff] placeholder:text-[#8a9bc2] focus:outline-none focus:border-[#4f8ef7] transition-colors disabled:opacity-60"
                data-testid="input-chat"
              />
              <button
                onClick={() => void send(input)}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-[#4f8ef7] text-[#f0f4ff] rounded-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-chat-send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
