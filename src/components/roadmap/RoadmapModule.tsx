import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Map, ChevronRight, Loader2, CheckCircle2, Clock, BookOpen, RefreshCw } from 'lucide-react';
import { generateRoadmap, Roadmap } from '../../services/roadmapService';

export default function RoadmapModule() {
  const [goal, setGoal] = useState('');
  const [knowledge, setKnowledge] = useState('Beginner');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const QUOTES = [
    { text: "Failing to plan is planning to fail.", author: "Benjamin Franklin", color: "text-brand-primary" },
    { text: "A goal without a plan is just a wish.", author: "Saint-Exupéry", color: "text-brand-secondary" },
    { text: "Planning is bringing the future into the present so that you can do something about it now.", author: "Alan Lakein", color: "text-brand-primary" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setIsLoading(true);
    try {
      const data = await generateRoadmap(goal, knowledge);
      setRoadmap(data);
    } catch (err) {
      alert("Failed to build your roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-white/5 border-t-brand-primary"
          />
          <Map className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">AI is calculating your path...</h3>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2 px-12">Analyzing goal: {goal}</p>
        </div>
      </div>
    );
  }

  if (roadmap) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-12 mb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono font-bold text-brand-primary mb-4 uppercase">
              <Sparkles size={12} /> AI-Generated Roadmap
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your Path to {roadmap.goal}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-white/40 uppercase font-mono text-[10px] tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="text-brand-primary" /> Est. Duration: {roadmap.estimatedTime}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setRoadmap(null)}
            className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> New Goal
          </button>
        </header>

        <div className="relative space-y-8">
           {/* Timeline line */}
           <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-primary via-brand-secondary to-transparent" />
           
           {roadmap.steps.map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="flex gap-8 relative z-10"
             >
               <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-bg-card border border-white/10 flex items-center justify-center text-brand-primary shadow-xl">
                 <span className="font-mono font-bold">{i + 1}</span>
               </div>
               <div className="glass p-6 rounded-[32px] border-white/5 flex-1 hover:border-white/20 transition-all group">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors">{step.title}</h4>
                 </div>
                 <p className="text-white/60 text-sm leading-relaxed mb-6">{step.description}</p>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-white/40">
                      <Clock size={14} className="text-brand-primary" /> {step.duration}
                    </div>
                 </div>
               </div>
             </motion.div>
           ))}
        </div>

        <div className="glass p-8 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center">
          <CheckCircle2 className="mx-auto text-brand-primary mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Roadmap Locked!</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto">This path is optimized based on current market trends and academic standards.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-2xl mx-auto space-y-12">
      <header className="text-center">
        <div className="w-20 h-20 bg-brand-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Map className="text-brand-primary" size={40} />
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4">Smart Roadmap Builder</h2>
        <p className="text-white/60 text-lg leading-relaxed">Describe your financial goal, and our AI will architect your complete learning journey.</p>
      </header>

      <div className="glass p-8 rounded-[40px] border-white/10 space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-mono text-white/40 uppercase tracking-widest font-bold">What is your ultimate goal?</label>
          <textarea 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Become a profitable swing trader, Master personal tax planning, or Understand how banks function..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[120px] focus:outline-none focus:border-brand-primary transition-all text-white placeholder:text-white/20 leading-relaxed"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-mono text-white/40 uppercase tracking-widest font-bold">Your current level</label>
          <div className="flex bg-white/5 p-1 rounded-2xl">
            {['Beginner', 'Intermediate', 'Expert'].map(l => (
              <button 
                key={l}
                onClick={() => setKnowledge(l)}
                className={`flex-1 py-4 rounded-xl text-xs font-bold transition-all ${knowledge === l ? 'bg-brand-primary text-bg-deep' : 'text-white/40 hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={!goal.trim()}
          className="w-full py-5 bg-brand-primary text-bg-deep rounded-[24px] font-bold text-xl flex items-center justify-center gap-3 glow-btn shadow-2xl disabled:opacity-50 disabled:pointer-events-none"
        >
          Architect My Future <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center px-4 py-10 border-t border-white/5 opacity-60">
        <motion.div 
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1 }}
          className="text-center italic max-w-2xl"
        >
          <p className="text-sm md:text-base text-white/70 leading-relaxed mb-3">
            "{QUOTES[currentQuoteIndex].text}"
          </p>
          <cite className={`text-[10px] font-mono uppercase tracking-widest font-bold ${QUOTES[currentQuoteIndex].color}`}>
            — {QUOTES[currentQuoteIndex].author}
          </cite>
        </motion.div>
      </div>
    </motion.div>
  );
}
