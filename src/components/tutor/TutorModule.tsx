import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronRight, Send, User, Bot, Sparkles } from 'lucide-react';
import { chatWithTutor } from '../../services/tutorService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const markdownComponents = {
  table: ({ children }: any) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
      <table className="w-full text-left border-collapse min-w-[500px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-brand-primary/10 transition-colors">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-white/5">
      {children}
    </tbody>
  ),
  th: ({ children }: any) => (
    <th className="px-3 md:px-5 py-4 text-[10px] md:text-[11px] font-mono font-bold text-brand-primary uppercase tracking-widest border-b border-white/10 text-center">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="px-3 md:px-5 py-4 text-xs md:text-sm text-white/80 leading-relaxed border-b border-white/5 last:border-0">
      {children}
    </td>
  ),
  tr: ({ children }: any) => (
    <tr className="hover:bg-white/[0.02] transition-colors">
      {children}
    </tr>
  ),
  h1: ({ children }: any) => <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-xl font-bold text-brand-primary mt-8 mb-4 border-l-4 border-brand-primary pl-4">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-lg font-bold text-white mt-6 mb-3">{children}</h3>,
  p: ({ children }: any) => <p className="mb-4 last:mb-0 leading-relaxed text-white/80">{children}</p>,
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-white/80 ml-2">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-white/80 ml-2">{children}</ol>,
  li: ({ children }: any) => <li className="marker:text-brand-primary">{children}</li>,
  strong: ({ children }: any) => <strong className="text-brand-primary font-bold">{children}</strong>,
  code: ({ node, inline, className, children, ...props }: any) => (
    <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-brand-primary text-[0.9em]" {...props}>
      {children}
    </code>
  ),
};

export default function TutorModule() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "I'm your AI Finance Tutor. Ask me any doubts from Finance. I will provide highly structured financial analysis and explanations." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithTutor(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecteing to the financial markets data. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="h-full w-full max-w-full mx-auto p-0 flex flex-col overflow-hidden"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-2 flex-shrink-0 px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-4 border-b border-white/5 bg-bg-deep/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-brand-primary/20 flex items-center justify-center relative shadow-lg shadow-brand-primary/5">
            <MessageSquare className="text-brand-primary" size={20} />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-brand-primary rounded-full border-4 border-bg-deep animate-pulse shadow-[0_0_10px_#00E676]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">AI Finance Tutor</h2>
            <div className="flex items-center gap-2">
              <p className="text-[8px] md:text-[9px] text-brand-primary font-mono font-bold tracking-widest uppercase flex items-center gap-1 bg-brand-primary/5 px-2 py-0.5 rounded-full border border-brand-primary/10">
                <Sparkles size={8} /> Active
              </p>
              <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
              <p className="text-[8px] md:text-[9px] text-white/40 uppercase font-mono tracking-widest">v4.0.2 Stable</p>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-gradient-to-b from-transparent to-white/[0.02]"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex gap-3 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex flex-shrink-0 items-center justify-center font-bold text-xs shadow-xl ${m.role === 'model' ? 'bg-brand-primary text-bg-deep' : 'bg-white/10 text-white'}`}>
                {m.role === 'model' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`
                p-4 md:p-6 rounded-[24px] md:rounded-[28px] max-w-[92%] md:max-w-[85%] border shadow-2xl relative
                ${m.role === 'model' 
                  ? 'bg-white/[0.03] rounded-tl-none border-white/5 shadow-white/[0.02]' 
                  : 'bg-brand-primary/10 rounded-tr-none border-brand-primary/20 text-white shadow-brand-primary/[0.05]'}
              `}>
                <div className="text-white selection:bg-brand-primary/30">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 md:gap-6"
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-brand-primary text-bg-deep flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Bot size={20} className="animate-spin" />
            </div>
            <div className="bg-white/[0.03] px-6 py-4 rounded-[24px] rounded-tl-none border border-white/5 flex items-center">
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative group p-4 md:p-6 border-t border-white/5 bg-bg-deep/80 backdrop-blur-xl flex-shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-[24px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        <div className="relative max-w-5xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search financial databases, analyze formulas..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-[20px] p-5 pr-16 md:pr-24 focus:outline-none focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/5 transition-all text-sm md:text-base shadow-2xl backdrop-blur-xl placeholder:text-white/20"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 p-3.5 md:p-4 rounded-xl transition-all duration-300
              ${input.trim() 
                ? 'bg-brand-primary text-bg-deep hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/30' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'}
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
