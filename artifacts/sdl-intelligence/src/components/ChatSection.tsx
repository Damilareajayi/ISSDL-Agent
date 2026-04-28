import { Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatSection() {
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
          <div className="bg-[#05070f] border-b border-[#1e3054] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#f0f4ff] text-sm">Research Assistant</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#8a9bc2]">
                  <Sparkles size={10} className="text-[#4f8ef7]" />
                  <span>Powered by Claude AI & Gemini</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 font-body">
            {/* AI Message */}
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7] shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-[#1e3054]/30 border border-[#1e3054] rounded-2xl rounded-tl-sm p-4 text-[#f0f4ff]">
                <p>Hello! I am the SDL Intelligence research assistant. How can I help you explore self-directed learning today?</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 max-w-[85%] self-end flex-row-reverse">
              <div className="w-8 h-8 rounded bg-[#f0f4ff]/10 border border-[#f0f4ff]/20 flex items-center justify-center text-[#f0f4ff] shrink-0">
                <User size={18} />
              </div>
              <div className="bg-[#4f8ef7] text-[#f0f4ff] rounded-2xl rounded-tr-sm p-4">
                <p>Can you summarize Garrison's multidimensional framework of self-directed learning?</p>
              </div>
            </div>

            {/* AI Message */}
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded bg-[#4f8ef7]/10 border border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7] shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-[#1e3054]/30 border border-[#1e3054] rounded-2xl rounded-tl-sm p-4 text-[#f0f4ff] space-y-3">
                <p>Certainly. D.R. Garrison's multidimensional framework (1997) integrates three core dimensions of self-directed learning:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#8a9bc2]">
                  <li><strong className="text-[#f0f4ff]">Self-Management:</strong> The control aspect, concerning the social and behavioral implementation of learning intentions.</li>
                  <li><strong className="text-[#f0f4ff]">Self-Monitoring:</strong> The cognitive responsibility aspect, involving metacognitive processes to evaluate learning strategies.</li>
                  <li><strong className="text-[#f0f4ff]">Motivation:</strong> The entering and task motivation that initiates and maintains the effort.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#05070f] border-t border-[#1e3054]">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Ask a question about SDL..." 
                className="w-full bg-[#0e1a2e] border border-[#1e3054] rounded-xl py-3 pl-4 pr-12 text-[#f0f4ff] placeholder:text-[#8a9bc2] focus:outline-none focus:border-[#4f8ef7] transition-colors"
                disabled
                data-testid="input-chat"
              />
              <button 
                className="absolute right-2 p-2 bg-[#4f8ef7] text-[#f0f4ff] rounded-lg opacity-80 cursor-not-allowed"
                disabled
                data-testid="button-chat-send"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-center text-xs text-[#8a9bc2] mt-3">
              This is a static preview of the conversational interface.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
