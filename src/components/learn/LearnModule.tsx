import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, BookOpen, Clock, Award, ArrowLeft, Loader2, CheckCircle, Brain, XCircle, RefreshCw } from 'lucide-react';
import { generateLesson, LessonContent } from '../../services/learnService';
import { generateQuiz, MCQ } from '../../services/quizService';
import { Course, COURSES, LESSON_PLANS } from '../../data/coursesData';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

export default function LearnModule({ onStartRoadmap }: { onStartRoadmap: () => void }) {
  const { user, profile, markLessonComplete } = useAuth();
  const [activeCourse, setActiveCourse] = useState<Course | null>(() => {
    // Check if we navigated here with a course intent
    const intent = sessionStorage.getItem('af_learn_intent');
    if (intent) {
      sessionStorage.removeItem('af_learn_intent');
      return COURSES.find(c => c.title.toLowerCase() === intent.toLowerCase()) || COURSES.find(c => c.title === 'Financial Rules') || null;
    }
    return null;
  });
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Knowledge Check State
  const [isTesting, setIsTesting] = useState(false);
  const [testQuestions, setTestQuestions] = useState<MCQ[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testResult, setTestResult] = useState<'pass' | 'fail' | null>(null);

  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (user && profile) {
      setCompletedLessons(profile.completedLessons || {});
    } else {
      try {
        const saved = localStorage.getItem('af_completed_lessons');
        if (saved) setCompletedLessons(JSON.parse(saved));
      } catch (e) {}
    }
  }, [user, profile]);

  const saveProgress = async (courseTitle: string, lessonTitle: string) => {
    await markLessonComplete(courseTitle, lessonTitle);
    const updated = { ...completedLessons };
    if (!updated[courseTitle]) {
      updated[courseTitle] = [];
    }
    if (!updated[courseTitle].includes(lessonTitle)) {
      updated[courseTitle].push(lessonTitle);
    }
    setCompletedLessons(updated);
  };


  const startContent = async (course: Course, lessonTitle: string) => {
    setSelectedLesson(lessonTitle);
    setIsLoading(true);
    try {
      const data = await generateLesson(`${course.title}: ${lessonTitle}`, course.level);
      setLessonData(data);
    } catch (err) {
      alert("Failed to load lesson. Please try again.");
      setSelectedLesson(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startKnowledgeCheck = async () => {
    if (!selectedLesson || !activeCourse) return;
    setIsLoading(true);
    try {
      const questions = await generateQuiz(selectedLesson, activeCourse.level, 5);
      setTestQuestions(questions);
      setIsTesting(true);
      setCurrentTestIndex(0);
      setTestScore(0);
      setTestResult(null);
    } catch (error) {
      console.error("Test generation failed", error);
      alert("Failed to generate Knowledge Check. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAnswer = (index: number) => {
    if (index === testQuestions[currentTestIndex].correctAnswer) {
      setTestScore(prev => prev + 1);
    }

    if (currentTestIndex < testQuestions.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      const finalScore = index === testQuestions[currentTestIndex].correctAnswer ? testScore + 1 : testScore;
      const passGrade = 4; // 80% (4 out of 5)
      
      if (finalScore >= passGrade) {
        setTestResult('pass');
        saveProgress(activeCourse!.title, selectedLesson!);
      } else {
        setTestResult('fail');
      }
    }
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setLessonData(null);
    setIsTesting(false);
    setTestResult(null);
  };

  const handleBackToCourses = () => {
    setActiveCourse(null);
    setSelectedLesson(null);
    setLessonData(null);
  };

  const getCourseProgress = (courseTitle: string) => {
    const completed = completedLessons[courseTitle]?.length || 0;
    const total = LESSON_PLANS[courseTitle]?.length || 12;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <h3 className="text-xl font-bold">{isTesting ? "Generating Knowledge Check..." : "Generating Professional Insights..."}</h3>
        <p className="text-white/40 font-mono text-sm uppercase">Topic: {selectedLesson}</p>
      </div>
    );
  }

  // Quiz View
  if (isTesting && testQuestions.length > 0) {
    const q = testQuestions[currentTestIndex];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto p-8">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h4 className="text-xs font-mono text-brand-primary uppercase tracking-widest mb-1">Knowledge Check</h4>
            <h3 className="text-xl font-bold">{selectedLesson}</h3>
          </div>
          {!testResult && (
            <div className="text-right">
              <span className="text-xs font-mono text-white/40">STEP</span>
              <p className="text-lg font-bold">{currentTestIndex + 1}/5</p>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!testResult ? (
            <motion.div 
              key={currentTestIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="glass p-8 rounded-3xl border-white/5 bg-white/5">
                <p className="text-xl leading-relaxed font-medium">{q.question}</p>
              </div>
              <div className="grid gap-3">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleTestAnswer(i)}
                    className="p-6 glass rounded-2xl border-white/5 hover:border-brand-primary/40 hover:bg-white/5 text-left transition-all active:scale-[0.98] group"
                  >
                    <span className="text-brand-primary font-mono mr-4 group-hover:scale-110 transition-transform inline-block">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-12 rounded-[40px] border-white/5 text-center space-y-8"
            >
              {testResult === 'pass' ? (
                <>
                  <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,230,118,0.2)]">
                    <CheckCircle className="text-brand-primary" size={48} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Mastery Verified!</h2>
                    <p className="text-white/60">You scored {testScore}/5. This topic has been added to your completed syllabus.</p>
                  </div>
                  <button 
                    onClick={handleBackToLessons}
                    className="px-10 py-5 bg-brand-primary text-bg-deep rounded-2xl font-bold hover:scale-105 transition-all shadow-glow"
                  >
                    Return to Syllabus
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="text-red-400" size={48} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Review Required</h2>
                    <p className="text-white/60">You scored {testScore}/5. A minimum score of 4/5 (80%) is required to certify completion. Take a moment to review the material.</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => setIsTesting(false)}
                      className="px-8 py-4 glass text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                      Read Again
                    </button>
                    <button 
                      onClick={startKnowledgeCheck}
                      className="px-8 py-4 bg-white text-bg-deep rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <RefreshCw size={18} /> Retry Knowledge Check
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Lesson Content View
  if (lessonData && activeCourse && selectedLesson) {
    const isCompleted = completedLessons[activeCourse.title]?.includes(selectedLesson);
    
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 pb-20"
      >
        <button 
          onClick={handleBackToLessons}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Back to Syllabus</span>
        </button>

        <header className="space-y-4">
          <div className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded inline-block ${activeCourse.color}`}>
            {activeCourse.level}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{lessonData.title}</h1>
          <p className="text-xl text-white/60 leading-relaxed italic border-l-4 border-brand-primary pl-6 py-2">
            {lessonData.summary}
          </p>
        </header>

        <div className="space-y-16">
          {lessonData.sections.map((section, i) => (
            <section key={i} className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-xs font-mono">0{i+1}</span>
                {section.heading}
              </h2>
              <div className="prose prose-invert prose-emerald max-w-none prose-p:text-white/80 prose-p:leading-relaxed prose-headings:text-white">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </div>

        <div className="glass p-8 rounded-[40px] border-brand-primary/20 bg-brand-primary/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Award className="text-brand-primary" /> Key Takeaways
          </h3>
          <ul className="grid md:grid-cols-2 gap-4">
            {lessonData.keyTakeaways.map((task, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/80">
                <CheckCircle size={18} className="text-brand-primary flex-shrink-0" />
                {task}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-12 flex justify-center">
          {isCompleted ? (
            <div className="flex items-center gap-3 text-brand-primary font-bold text-xl glass px-12 py-6 rounded-3xl border-brand-primary/20">
              <CheckCircle size={28} /> Mastery Verified
            </div>
          ) : (
            <button 
              onClick={startKnowledgeCheck}
              className="px-12 py-6 bg-white text-bg-deep rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 group"
            >
              <Brain size={24} className="text-brand-primary group-hover:rotate-12 transition-transform" /> 
              Take Knowledge Check <ChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (activeCourse) {
    const lessons = LESSON_PLANS[activeCourse.title] || [];
    const { completed, total, percent } = getCourseProgress(activeCourse.title);
    
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-5xl mx-auto">
        <button onClick={handleBackToCourses} className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Domains
        </button>

        <header className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded inline-block mb-3 ${activeCourse.color}`}>
                {activeCourse.level}
              </div>
              <h2 className="text-4xl font-bold mb-2">{activeCourse.title} Syllabus</h2>
              <p className="text-white/40">12 Expertly curated modules to master {activeCourse.title.toLowerCase()}.</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-brand-primary font-bold">{completed}/{total} COMPLETED</span>
              <div className="w-32 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((lesson, i) => {
            const isCompleted = completedLessons[activeCourse.title]?.includes(lesson);
            return (
              <div 
                key={i}
                onClick={() => startContent(activeCourse, lesson)}
                className={`glass p-6 rounded-3xl border-white/5 hover:border-brand-primary/40 transition-all cursor-pointer flex items-center justify-between group ${isCompleted ? 'bg-brand-primary/5 border-brand-primary/20' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-white/20">{(i+1).toString().padStart(2, '0')}</span>
                  <span className={`font-medium transition-colors ${isCompleted ? 'text-white' : 'group-hover:text-brand-primary'}`}>{lesson}</span>
                </div>
                {isCompleted ? (
                  <CheckCircle size={18} className="text-brand-primary" />
                ) : (
                  <ChevronRight size={16} className="text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Financial Domains</h2>
        <p className="text-white/40">Select a specialization to begin your professional journey.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {COURSES.map((course, i) => {
          const { completed, total, percent } = getCourseProgress(course.title);
          return (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              onClick={() => setActiveCourse(course)}
              className="glass p-8 rounded-[40px] border-white/5 hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`text-[10px] uppercase font-bold tracking-widest inline-block px-3 py-1 rounded-full ${course.color}`}>
                  {course.level}
                </div>
                {completed > 0 && (
                  <div className="text-[10px] font-mono text-brand-primary font-bold">
                    {percent}% DONE
                  </div>
                )}
              </div>
              
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{course.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{course.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-6 pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                    <Clock size={14} className="text-brand-primary" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                    <BookOpen size={14} className="text-brand-primary" />
                    {total} Lessons
                  </div>
                  <div className="ml-auto p-2 rounded-xl bg-white/5 group-hover:bg-brand-primary group-hover:text-bg-deep transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
                {completed > 0 && (
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${percent}%` }} />
                  </div>
                )}
              </div>

              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Award size={160} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 p-12 glass rounded-[40px] border-white/5 text-center space-y-4">
        <h4 className="text-2xl font-bold">Want a tailored path?</h4>
        <p className="text-white/40 max-w-md mx-auto">Our AI can build a custom curriculum based on your specific goals.</p>
        <button 
          onClick={onStartRoadmap}
          className="mt-6 px-10 py-5 bg-white text-bg-deep rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          Create Personalized Roadmap
        </button>
      </div>
    </motion.div>
  );
}
