import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, HelpCircle, AlertCircle, Sparkles, Brain, Clock, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';

interface Message {
  sender: 'user' | 'atlas-ai';
  text: string;
  timestamp: string;
}

export default function AiAnalystView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'atlas-ai',
      text: `Hello, I am **Xena AI**, your Chief Quantitative Risk Officer. I have scanned your immutable ledger, investor registries, outstanding internal loans, and active portfolios.

You can ask me complex financial questions or click on one of the quick analysis cards below:`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'How much belongs to investors?', description: 'Calculates active pool liabilities vs deployed assets.' },
    { text: 'Which portfolio performed worst?', description: 'Analyzes drawdowns, roi, and win rates.' },
    { text: 'What is my liquidity?', description: 'Traces cash reserves across pool and personal.' },
    { text: 'Who should I pay this week?', description: 'Checks upcoming maturities and loan returns.' },
    { text: 'Where am I losing money?', description: 'Identifies high drawdown or negative PnL pools.' }
  ];

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'atlas-ai',
            text: data.response,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        throw new Error(data.error || 'The Gemini analyst encountered an issue.');
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'atlas-ai',
          text: `⚠️ **Analysis Interrupted**: ${e.message || 'The AI analyst could not be reached.'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* Top summary bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/20 p-5 rounded-2xl border border-zinc-800 flex items-center gap-4 shadow-xl">
        <div className="h-10 w-10 bg-emerald-950/40 border border-emerald-900 rounded-xl flex items-center justify-center text-emerald-400">
          <Brain size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-1.5">
            Quantum Fund Financial Analyst
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-medium border border-emerald-500/20 uppercase tracking-widest">
              Live Context
            </span>
          </h2>
          <p className="text-xs text-zinc-400">Natural language insights fed directly from your immutable database files</p>
        </div>
      </div>

      {/* Main chat box and quick actions splits */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-0">
        {/* Chat Thread */}
        <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-md">
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {m.sender === 'atlas-ai' ? (
                  <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-900 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <Bot size={16} />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-zinc-300 font-mono text-xs font-bold uppercase">
                    ME
                  </div>
                )}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none font-sans'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-850 rounded-tl-none font-sans'
                    }`}
                  >
                    <div className="markdown-body text-xs font-sans leading-relaxed text-zinc-200">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono text-zinc-500 block ${m.sender === 'user' ? 'text-right' : ''}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-900 flex items-center justify-center flex-shrink-0 text-emerald-400 animate-spin">
                  <Brain size={16} />
                </div>
                <div className="bg-zinc-950 text-zinc-500 border border-zinc-850 p-3.5 rounded-xl rounded-tl-none text-xs flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" />
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Xena is analyzing live ledger matrices...</span>
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-3"
          >
            <input
              type="text"
              placeholder="Ask: 'Where is my liquidity?' or 'What are our risk concentrations?'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Right Side: Quick analysis prompts */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between overflow-y-auto max-h-full">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-300 uppercase tracking-wider mb-1">
                Risk Engine Shortcuts
              </h3>
              <p className="text-xs text-zinc-500">Query your fund indexes instantly</p>
            </div>

            <div className="space-y-3">
              {quickPrompts.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSend(q.text)}
                  className="p-3 bg-zinc-950 border border-zinc-850 hover:border-emerald-500/30 rounded-xl flex items-center justify-between cursor-pointer group hover:bg-zinc-900/40 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-emerald-400 transition-colors">
                      {q.text}
                    </span>
                    <p className="text-[10px] text-zinc-500 font-sans leading-normal">
                      {q.description}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-emerald-400 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
