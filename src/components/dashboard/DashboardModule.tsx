import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  RotateCcw, 
  Target, 
  Flame, 
  Brain, 
  GraduationCap, 
  CheckCircle,
  Circle,
  HelpCircle,
  Compass,
  Trophy,
  Filter,
  BarChart3,
  User as UserIcon,
  LogIn,
  LogOut,
  Settings,
  CloudCheck,
  ShieldCheck,
  UserCheck,
  Briefcase,
  MapPin
} from 'lucide-react';
import { COURSES, LESSON_PLANS, Course } from '../../data/coursesData';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import ProfileSettingsModal from '../auth/ProfileSettingsModal';

interface DashboardProps {
  onNavigate: (page: 'learn' | 'test' | 'tutor' | 'tools' | 'roadmap') => void;
}

export default function DashboardModule({ onNavigate }: DashboardProps) {
  const { user, profile, logout } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Record<string, string[]>>({});
  const [quizHistory, setQuizHistory] = useState<Record<string, string[]>>({});
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync state from profile (if logged in) or localStorage
  useEffect(() => {
    if (user && profile) {
      setCompletedLessons(profile.completedLessons || {});
      setQuizHistory(profile.quizHistory || {});
    } else {
      try {
        const savedLessons = localStorage.getItem('af_completed_lessons');
        if (savedLessons) {
          setCompletedLessons(JSON.parse(savedLessons));
        }
        const savedQuiz = localStorage.getItem('quiz_history');
        if (savedQuiz) {
          setQuizHistory(JSON.parse(savedQuiz));
        }
      } catch (e) {
        console.error('Error loading local progress:', e);
      }
    }
  }, [user, profile]);

  // Compute stats
  const totalLessonsInCurriculum = Object.values(LESSON_PLANS).reduce((acc, list) => acc + list.length, 0);
  const totalCompletedLessons = Object.values(completedLessons).reduce((acc, list) => acc + list.length, 0);
  const totalCourses = COURSES.length;

  const coursesStats = COURSES.map(course => {
    const lessons = LESSON_PLANS[course.title] || [];
    const completed = completedLessons[course.title] || [];
    const count = completed.length;
    const total = lessons.length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const isCompleted = count > 0 && count === total;
    const isInProgress = count > 0 && count < total;
    const isNotStarted = count === 0;

    return {
      course,
      total,
      completedCount: count,
      percent: pct,
      isCompleted,
      isInProgress,
      isNotStarted,
      completedList: completed,
      allLessons: lessons
    };
  });

  const completedCoursesCount = coursesStats.filter(c => c.isCompleted).length;
  const inProgressCoursesCount = coursesStats.filter(c => c.isInProgress).length;
  const overallPercent = totalLessonsInCurriculum > 0 ? Math.round((totalCompletedLessons / totalLessonsInCurriculum) * 100) : 0;

  // Quiz statistics
  const totalQuestionsSolved = Object.values(quizHistory).reduce((acc, list) => acc + list.length, 0);

  // FinIQ Calculation: Base 300 + (Lessons * 15) + (Quizzes * 8) up to 900
  const finIQ = Math.min(900, 300 + (totalCompletedLessons * 15) + (totalQuestionsSolved * 8));

  // Study time estimation: ~20 mins per lesson + 5 mins per quiz
  const totalEstimatedMins = (totalCompletedLessons * 20) + (totalQuestionsSolved * 5);
  const studyHours = Math.floor(totalEstimatedMins / 60);
  const studyMinutes = totalEstimatedMins % 60;

  // Resume course recommendation
  const resumeCandidate = coursesStats.find(c => c.isInProgress) || coursesStats.find(c => c.isNotStarted) || coursesStats[0];

  const handleOpenCourse = (courseTitle: string) => {
    sessionStorage.setItem('af_learn_intent', courseTitle);
    onNavigate('learn');
  };

  // Filtered courses
  const filteredCourses = coursesStats.filter(item => {
    if (filter === 'completed') return item.isCompleted;
    if (filter === 'in_progress') return item.isInProgress;
    if (filter === 'not_started') return item.isNotStarted;
    return true;
  });

  // Achievement Badges
  const BADGES = [
    {
      id: 'first_step',
      title: 'First Step',
      desc: 'Completed your 1st lesson',
      unlocked: totalCompletedLessons >= 1,
      icon: Sparkles
    },
    {
      id: 'fin_novice',
      title: 'Finance Apprentice',
      desc: 'Mastered 5+ lessons',
      unlocked: totalCompletedLessons >= 5,
      icon: BookOpen
    },
    {
      id: 'course_finisher',
      title: 'Course Graduate',
      desc: 'Completed at least 1 full course',
      unlocked: completedCoursesCount >= 1,
      icon: GraduationCap
    },
    {
      id: 'quiz_master',
      title: 'Quiz Champion',
      desc: 'Solved 10+ Test Questions',
      unlocked: totalQuestionsSolved >= 10,
      icon: Award
    },
    {
      id: 'scholar',
      title: 'Finance Scholar',
      desc: 'Completed 3+ full courses',
      unlocked: completedCoursesCount >= 3,
      icon: Trophy
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8"
    >
      {/* Header Section with User Account Profile Sync */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles size={11} />
              Personal Learning Portal
            </span>
            {user ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cloud Synced
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                Local Session
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">Course Progress & Completion</h1>
          <p className="text-xs md:text-sm text-white/50">Comprehensive track record of all finance modules, lessons, and tests completed on Finance OS.</p>
        </div>

        {/* User Account Controls & Explore Button */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <div 
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer group"
                title="Click to edit profile"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-tight group-hover:text-brand-primary transition-colors">
                    {user.displayName || 'Learner'}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono truncate max-w-[120px]">{user.email}</p>
                </div>
              </div>

              {/* Settings button beside customer's name */}
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                title="Profile & Customer Settings (Edit Name, Mail, Age, Gender, etc.)"
                className="ml-1 text-white/40 hover:text-brand-primary hover:bg-white/5 p-1 rounded-lg transition-colors"
              >
                <Settings size={15} />
              </button>

              <button 
                onClick={() => logout()}
                title="Log Out"
                className="text-white/40 hover:text-rose-400 hover:bg-white/5 p-1 rounded-lg transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow"
            >
              <LogIn size={15} className="text-brand-primary" /> Sign In to Save Data
            </button>
          )}

          <button 
            onClick={() => onNavigate('learn')}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-bg-deep font-mono font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
          >
            <BookOpen size={16} /> Explore Courses
          </button>
        </div>
      </div>

      {/* Signed Customer Demographic Overview Card */}
      {user && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-white/60">
              <UserCheck size={14} className="text-brand-primary" />
              <span className="text-white font-bold">{profile?.displayName || user.displayName || 'Customer'}</span>
            </div>

            {profile?.age && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono text-[11px]">
                {profile.age} yrs
              </span>
            )}

            {profile?.gender && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono text-[11px]">
                {profile.gender}
              </span>
            )}

            {profile?.occupation && (
              <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-mono text-[11px]">
                {profile.occupation}
              </span>
            )}

            {profile?.experienceLevel && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px]">
                {profile.experienceLevel} Level
              </span>
            )}

            {profile?.city && (
              <span className="text-white/40 text-[11px] flex items-center gap-1">
                <MapPin size={12} /> {profile.city}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="text-xs font-mono text-brand-primary hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <Settings size={13} /> Edit Profile Details
          </button>
        </div>
      )}

      {/* Cloud Sync Alert Banner when not logged in */}
      {!user && (
        <div className="p-4 rounded-2xl bg-brand-primary/[0.04] border border-brand-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Save & Persist Your Learning Records</h4>
              <p className="text-[11px] text-white/50">Log in or create a free account to securely sync your completed lessons, test answers, and FinIQ score across devices.</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-primary text-bg-deep font-mono font-bold text-xs flex items-center gap-1.5 flex-shrink-0 hover:scale-105 transition-transform"
          >
            <LogIn size={13} /> Sign In / Register
          </button>
        </div>
      )}

      {/* Top Learning Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Completed Courses */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Courses Finished</span>
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-white">
              {completedCoursesCount} <span className="text-sm font-normal text-white/40">/ {totalCourses}</span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              {inProgressCoursesCount} course{inProgressCoursesCount === 1 ? '' : 's'} currently in progress
            </p>
          </div>
        </div>

        {/* Metric 2: Lessons Completed */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Lessons Mastered</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-white">
              {totalCompletedLessons} <span className="text-sm font-normal text-white/40">/ {totalLessonsInCurriculum}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-brand-primary h-full rounded-full transition-all duration-500" style={{ width: `${overallPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Metric 3: FinIQ Rating */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">FinIQ Score</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Brain size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-white">
              {finIQ} <span className="text-sm font-normal text-white/40">/ 900</span>
            </div>
            <p className="text-xs text-brand-primary font-mono mt-1">
              {finIQ >= 750 ? 'Advanced Financial Fluency' : finIQ >= 500 ? 'Intermediate Competency' : 'Foundational Learner'}
            </p>
          </div>
        </div>

        {/* Metric 4: Quiz & Knowledge Checks */}
        <div className="glass p-5 rounded-2xl border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Test Questions Solved</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono text-white">
              {totalQuestionsSolved}
            </div>
            <p className="text-xs text-white/50 mt-1">
              {studyHours > 0 ? `${studyHours}h ${studyMinutes}m` : `${studyMinutes} mins`} estimated study time
            </p>
          </div>
        </div>
      </div>

      {/* Continue Learning Spotlight Banner */}
      {resumeCandidate && (
        <div className="glass rounded-3xl p-6 border-brand-primary/20 bg-gradient-to-r from-brand-primary/[0.04] via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-primary/10">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold">
                  {resumeCandidate.isCompleted ? 'Completed Course' : resumeCandidate.isInProgress ? 'Resume In-Progress Course' : 'Recommended Next Course'}
                </span>
                <span className="text-xs text-white/40 font-mono">• {resumeCandidate.course.level}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{resumeCandidate.course.title}</h3>
              <p className="text-xs text-white/60 line-clamp-1">{resumeCandidate.course.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-mono text-white/40">Course Progress</p>
              <p className="text-sm font-bold text-white font-mono">{resumeCandidate.completedCount} / {resumeCandidate.total} Lessons ({resumeCandidate.percent}%)</p>
            </div>
            <button 
              onClick={() => handleOpenCourse(resumeCandidate.course.title)}
              className="px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-bg-deep font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20"
            >
              {resumeCandidate.isCompleted ? 'Review Course' : resumeCandidate.isInProgress ? 'Continue Learning' : 'Start Course'}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Courses Catalog & Progress Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Your Courses Curriculum</h2>
            <span className="text-xs font-mono text-white/40">({filteredCourses.length} of {totalCourses} Courses)</span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${filter === 'all' ? 'bg-brand-primary text-bg-deep font-bold shadow' : 'text-white/60 hover:text-white'}`}
            >
              All ({totalCourses})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${filter === 'in_progress' ? 'bg-brand-primary text-bg-deep font-bold shadow' : 'text-white/60 hover:text-white'}`}
            >
              In Progress ({inProgressCoursesCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${filter === 'completed' ? 'bg-brand-primary text-bg-deep font-bold shadow' : 'text-white/60 hover:text-white'}`}
            >
              Completed ({completedCoursesCount})
            </button>
            <button
              onClick={() => setFilter('not_started')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${filter === 'not_started' ? 'bg-brand-primary text-bg-deep font-bold shadow' : 'text-white/60 hover:text-white'}`}
            >
              Not Started ({coursesStats.filter(c => c.isNotStarted).length})
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((item) => {
            const isExpanded = expandedCourse === item.course.title;
            return (
              <div 
                key={item.course.title}
                className={`glass rounded-2xl p-5 border transition-all flex flex-col justify-between group ${
                  item.isCompleted 
                    ? 'border-brand-primary/30 bg-brand-primary/[0.02]' 
                    : item.isInProgress 
                    ? 'border-blue-500/30' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-lg font-bold ${
                      item.isCompleted 
                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                        : item.isInProgress 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-white/5 text-white/40'
                    }`}>
                      {item.isCompleted ? '✓ Completed' : item.isInProgress ? 'In Progress' : 'Not Started'}
                    </span>

                    <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                      <Clock size={11} /> {item.course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                    {item.course.title}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1 mb-4">
                    {item.course.description}
                  </p>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white/60">{item.completedCount} of {item.total} Lessons</span>
                      <span className={`font-bold ${item.isCompleted ? 'text-brand-primary' : 'text-white'}`}>{item.percent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.isCompleted ? 'bg-brand-primary' : item.isInProgress ? 'bg-blue-400' : 'bg-white/10'
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions & Expand Lesson List */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCourse(item.course.title)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          item.isCompleted
                            ? 'bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20'
                            : item.isInProgress
                            ? 'bg-brand-primary text-bg-deep hover:bg-brand-primary/90 shadow'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {item.isCompleted ? 'Review Lessons' : item.isInProgress ? 'Continue' : 'Start Course'}
                        <ArrowUpRight size={14} />
                      </button>

                      <button
                        onClick={() => setExpandedCourse(isExpanded ? null : item.course.title)}
                        title="View Lesson Checklist"
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 text-xs font-mono transition-all"
                      >
                        {isExpanded ? 'Hide' : 'Lessons'}
                      </button>
                    </div>

                    {/* Collapsible lesson checklist */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-2"
                        >
                          <div className="bg-black/30 rounded-xl p-3 border border-white/5 max-h-48 overflow-y-auto space-y-2 text-xs">
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Curriculum Checklist</p>
                            {item.allLessons.map((lesson, idx) => {
                              const isDone = item.completedList.includes(lesson);
                              return (
                                <div key={idx} className="flex items-start gap-2 text-white/80">
                                  {isDone ? (
                                    <CheckCircle size={14} className="text-brand-primary flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle size={14} className="text-white/20 flex-shrink-0 mt-0.5" />
                                  )}
                                  <span className={`text-[11px] ${isDone ? 'text-white line-through opacity-60' : 'text-white/70'}`}>
                                    {lesson}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="glass rounded-3xl p-6 border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Course Achievements & Badges</h3>
            <p className="text-xs text-white/40">Milestones unlocked based on completed lessons and quizzes.</p>
          </div>
          <Trophy className="text-brand-primary" size={22} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div 
                key={b.id} 
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center ${
                  b.unlocked 
                    ? 'bg-brand-primary/[0.04] border-brand-primary/30 shadow-lg shadow-brand-primary/5' 
                    : 'bg-white/[0.01] border-white/5 opacity-40'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 ${
                  b.unlocked ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-white/30'
                }`}>
                  <Icon size={22} />
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5">{b.title}</h4>
                <p className="text-[10px] text-white/50 leading-relaxed">{b.desc}</p>
                <span className={`text-[9px] font-mono font-bold mt-2.5 px-2 py-0.5 rounded-full ${
                  b.unlocked ? 'bg-brand-primary/10 text-brand-primary' : 'bg-white/5 text-white/30'
                }`}>
                  {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auth Modal & Profile Settings Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileSettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </motion.div>
  );
}
