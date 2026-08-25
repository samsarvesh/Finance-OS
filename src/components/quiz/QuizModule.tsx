import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, ArrowLeft, RefreshCw, Timer } from 'lucide-react';
import { generateQuiz, MCQ } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';

interface QuizModuleProps {
  onClose: () => void;
}

export default function QuizModule({ onClose }: QuizModuleProps) {
  const { user, profile, recordQuizSolved } = useAuth();
  const [topic, setTopic] = useState('Stock Market');
  const [difficulty, setDifficulty] = useState('Mid');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizState, setQuizState] = useState<'selection' | 'loading' | 'active' | 'result'>('selection');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [masteryCount, setMasteryCount] = useState(0);

  // Load mastery count from profile or local storage
  useEffect(() => {
    if (user && profile) {
      const domainHistory = profile.quizHistory?.[topic] || [];
      setMasteryCount(domainHistory.length);
    } else {
      const history = JSON.parse(localStorage.getItem('quiz_history') || '{}');
      const domainHistory = history[topic] || [];
      setMasteryCount(domainHistory.length);
    }
  }, [topic, user, profile]);

  const startQuiz = async () => {
    setQuizState('loading');
    try {
      // Fetch seen questions to exclude
      let domainHistory: string[] = [];
      if (user && profile) {
        domainHistory = profile.quizHistory?.[topic] || [];
      } else {
        const history = JSON.parse(localStorage.getItem('quiz_history') || '{}');
        domainHistory = history[topic] || [];
      }
      
      // Send last 50 questions as exclusion context to prevent repetition 
      // While also tracking total count for 1000+ goal
      const excludeContext = domainHistory.slice(-50).join(', ');

      const q = await generateQuiz(topic, difficulty, questionCount, excludeContext);
      setQuestions(q);
      setQuizState('active');
      setCurrentIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(q.length * 60); // 1 minute per question
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to load quiz. Please check your AI key.");
      setQuizState('selection');
    }
  };

  const saveToHistory = async (newQuestions: MCQ[]) => {
    for (const q of newQuestions) {
      const qTitle = q.question.substring(0, 100);
      await recordQuizSolved(topic, qTitle);
    }
    const history = JSON.parse(localStorage.getItem('quiz_history') || '{}');
    const domainHistory = history[topic] || [];
    setMasteryCount(domainHistory.length);
  };


  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      saveToHistory(questions);
      setQuizState('result');
    }
  };

  useEffect(() => {
    let timer: any;
    if (quizState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && quizState === 'active') {
      setQuizState('result');
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizState === 'selection') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-brand-primary" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Adaptive Quiz Engine</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-white/40 text-xs">Domain Mastery:</span>
            <div className="bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/20">
              <span className="text-brand-primary text-xs font-mono font-bold">{masteryCount} / 1000+</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-1 italic">Vast question pool ensures no repetition.</p>
        </header>

        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-mono text-white/40 uppercase tracking-widest">Select Domain</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Stock Market', 
                'Personal Finance', 
                'Banking', 
                'Derivatives', 
                'Crypto', 
                'Economics', 
                'Tax & GST', 
                'Insurance', 
                'Corporate Finance', 
                'Mutual Funds',
                'Financial Rules'
              ].map(t => (
                <button 
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`p-4 rounded-2xl border text-[11px] md:text-sm font-medium transition-all ${topic === t ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-mono text-white/40 uppercase tracking-widest">Difficulty Level</label>
            <div className="grid grid-cols-5 bg-white/5 p-1 rounded-2xl">
              {['Noob', 'Mid', 'Pro', 'Extreme', 'God Tier'].map(d => (
                <button 
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl text-[10px] font-bold transition-all ${difficulty === d ? 'bg-brand-primary text-bg-deep' : 'text-white/40 hover:text-white'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-mono text-white/40 uppercase tracking-widest">Number of Questions</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="10" 
                max="50" 
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="flex-1 accent-brand-primary"
              />
              <span className="w-12 text-center font-mono font-bold text-brand-primary truncate">{questionCount}</span>
            </div>
            <div className="flex justify-between text-[10px] text-white/20 font-mono px-1">
              <span>10 Qs</span>
              <span>50 Qs</span>
            </div>
          </div>

          <button 
            onClick={startQuiz}
            className="w-full py-4 bg-brand-primary text-bg-deep rounded-2xl font-bold text-lg glow-btn shadow-lg"
          >
            Generate Challenge
          </button>
        </div>
      </motion.div>
    );
  }

  if (quizState === 'loading') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-white/5 border-t-brand-primary"
          />
          <RefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">AI is crafting your test...</h3>
          <p className="text-white/40 text-sm font-mono italic">Adjusting difficulty for {difficulty} level</p>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    const q = questions[currentIndex];
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto h-full flex flex-col">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-brand-primary uppercase font-bold tracking-tighter">QUESTION {currentIndex + 1} OF {questions.length}</span>
            <h3 className="text-sm font-bold opacity-60">Topic: {topic}</h3>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <Timer size={16} className={timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white/40'} />
            <span className={`font-mono text-sm font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-white'}`}>{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-[40px] border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <HelpCircle size={120} />
             </div>
             <motion.h2 
               key={currentIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-2xl font-bold leading-tight"
             >
               {q.question}
             </motion.h2>
          </div>

          <div className="grid gap-4">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctAnswer;
              const isSelected = i === selectedAnswer;
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleAnswer(i)}
                  className={`
                    w-full p-6 rounded-3xl text-left transition-all duration-300 border relative group
                    ${showResult 
                      ? isCorrect 
                        ? 'bg-green-500/10 border-green-500 text-green-500' 
                        : isSelected ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/5 opacity-50'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 size={24} />}
                    {showResult && isSelected && !isCorrect && <XCircle size={24} />}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass p-6 rounded-3xl border-brand-secondary/20 overflow-hidden"
              >
                <h4 className="font-mono text-xs font-bold text-brand-secondary uppercase mb-2">Deep Learning Insight</h4>
                <p className="text-white/60 text-sm leading-relaxed">{q.explanation}</p>
                <button 
                  onClick={nextQuestion}
                  className="mt-6 w-full py-4 bg-brand-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  {currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'} <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 max-w-2xl mx-auto text-center space-y-12">
        <header>
          <div className="w-32 h-32 rounded-full border-8 border-brand-primary/20 flex items-center justify-center mx-auto mb-8 relative">
            <svg className="absolute inset-0 rotate-[-90deg]" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
               <motion.circle 
                 cx="50" cy="50" r="46" fill="none" stroke="#00E676" strokeWidth="8" 
                 strokeDasharray="290"
                 strokeDashoffset={290 - (290 * percentage) / 100}
                 strokeLinecap="round"
                 initial={{ strokeDashoffset: 290 }}
                 animate={{ strokeDashoffset: 290 - (290 * percentage) / 100 }}
                 transition={{ duration: 1, delay: 0.5 }}
               />
            </svg>
            <span className="text-4xl font-bold font-mono">{percentage}%</span>
          </div>
          <h2 className="text-3xl font-bold">Concept Mastery</h2>
          <p className="text-white/40 mt-2">Score: {score} / {questions.length} Questions Correct</p>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl">
             <p className="text-xs font-mono text-white/40 uppercase mb-2">Total Mastery</p>
             <p className="text-xl font-bold">{masteryCount} Questions</p>
          </div>
          <div className="glass p-6 rounded-3xl">
             <p className="text-xs font-mono text-white/40 uppercase mb-2">Time spent</p>
             <p className="text-xl font-bold">{Math.round((questions.length * 60 - timeLeft) / 60)} mins</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={startQuiz}
            className="w-full py-4 bg-brand-primary text-bg-deep rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <RefreshCw size={20} /> Retry with New Questions
          </button>
          <button 
            onClick={() => setQuizState('selection')}
            className="w-full py-4 glass text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} /> Change Topic
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
