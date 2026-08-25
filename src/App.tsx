/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Calculator, 
  TrendingUp, 
  MessageSquare, 
  PlayCircle,
  Award,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Map,
  LogIn,
  LogOut,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CalculatorsHub from './components/calculators/CalculatorsHub';
import QuizModule from './components/quiz/QuizModule';
import TutorModule from './components/tutor/TutorModule';
import LearnModule from './components/learn/LearnModule';
import RoadmapModule from './components/roadmap/RoadmapModule';
import DashboardModule from './components/dashboard/DashboardModule';
import AuthModal from './components/auth/AuthModal';
import ProfileSettingsModal from './components/auth/ProfileSettingsModal';
import { useAuth } from './context/AuthContext';

type Page = 'home' | 'learn' | 'test' | 'tutor' | 'tools' | 'dashboard' | 'roadmap';

export default function App() {
  const { user, profile, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'learn', label: 'Learn', icon: PlayCircle },
    { id: 'roadmap', label: 'Path Finder', icon: Map },
    { id: 'test', label: 'Test Hub', icon: Award },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
    { id: 'tools', label: 'Fin Tools', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border-subtle bg-bg-deep/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <span className="font-bold text-bg-deep font-mono">A</span>
          </div>
          <span className="font-bold tracking-tight">Finance OS</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className={`
        fixed inset-0 z-40 bg-bg-deep md:relative flex flex-col border-r border-border-subtle transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
      `}>
        <div className={`p-6 flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-4' : 'gap-3'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex-shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.4)]">
              <CreditCard className="text-bg-deep" size={24} />
            </div>
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-bold text-lg leading-tight tracking-tight">Finance OS</h1>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-medium">By Sam Sarvesh</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id as Page);
                setIsMenuOpen(false);
              }}
              title={isSidebarCollapsed ? item.label : ''}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${currentPage === item.id 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} className={currentPage === item.id ? 'text-brand-primary' : 'group-hover:text-white'} />
              {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              {currentPage === item.id && !isSidebarCollapsed && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_#00E676]" 
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          {user ? (
            <div className={`glass p-3 rounded-2xl flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
              <div 
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer group flex-1"
                title="Open Profile Settings"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                {!isSidebarCollapsed && (
                  <div className="overflow-hidden text-left">
                    <p className="text-xs font-bold text-white truncate group-hover:text-brand-primary transition-colors">
                      {user.displayName || 'Learner'}
                    </p>
                    <p className="text-[10px] text-white/40 font-mono truncate">{user.email}</p>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    title="Profile & Customer Settings"
                    className="p-1.5 text-white/40 hover:text-brand-primary hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => logout()}
                    title="Sign Out"
                    className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} transition-all hover:border-brand-primary/40`}
            >
              <LogIn size={16} className="text-brand-primary" />
              {!isSidebarCollapsed && <span>Sign In / Sync</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 relative h-[calc(100vh-64px)] md:h-screen bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed ${currentPage === 'tutor' ? 'overflow-hidden' : 'overflow-y-auto'}`}>

        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <LandingPage 
              key="home" 
              onStart={() => setCurrentPage('learn')} 
              onViewRoadmap={() => setCurrentPage('roadmap')} 
            />
          )}
          
          {currentPage === 'learn' && (
            <LearnModule onStartRoadmap={() => setCurrentPage('roadmap')} />
          )}

          {currentPage === 'roadmap' && (
            <RoadmapModule />
          )}

          {currentPage === 'tools' && (
            <motion.div key="tools" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CalculatorsHub />
            </motion.div>
          )}

          {currentPage === 'tutor' && (
            <TutorModule />
          )}

          {currentPage === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-[radial-gradient(circle_at_top_right,rgba(0,230,118,0.05),transparent)]">
              <QuizModule onClose={() => setCurrentPage('home')} />
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <DashboardModule onNavigate={(p) => setCurrentPage(p)} />
          )}
        </AnimatePresence>
      </main>

      {/* Auth Modal & Profile Settings Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

function LandingPage({ onStart, onViewRoadmap }: { onStart: () => void, onViewRoadmap: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-6xl mx-auto px-6 py-12 lg:py-24"
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-brand-primary mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            AI-POWERED FINANCIAL ECOSYSTEM
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Finance made <span className="text-brand-primary italic">human.</span>
          </h1>
          <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-lg">
            Master everything from budgeting to algorithmic trading. An engineering project by <span className="text-white font-medium underline underline-offset-4 decoration-brand-primary/40">Sam Sarvesh</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onViewRoadmap}
              className="px-8 py-4 bg-brand-primary text-bg-deep rounded-2xl font-bold text-lg flex items-center justify-center gap-2 glow-btn"
            >
              Get Personalized Roadmap <ChevronRight size={20} />
            </button>
            <button 
              onClick={onStart}
              className="px-8 py-4 glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border-subtle pt-8">
            <div>
              <p className="text-2xl font-mono font-bold text-white">50+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Micro-courses</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-white italic">GPT-4o</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Powered Tutor</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary/20 blur-[120px] rounded-full -z-10" />
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass rounded-[40px] p-8 border-white/20 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <TrendingUp className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Portfolio Growth</h3>
                  <p className="text-xs text-white/40">Personal Tracker</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg bg-brand-primary/20 text-brand-primary text-xs font-mono font-bold">+24.8%</div>
            </div>
            
            <div className="space-y-4">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-brand-primary shadow-[0_0_10px_#00E676]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-8">
                <span>GOAL: WEALTH CREATION</span>
                <span>65% ACHIEVED</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/40 font-mono mb-1">STREAK</p>
                  <p className="text-xl font-bold">12 Days 🔥</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-white/40 font-mono mb-1">EXPERTISE</p>
                  <p className="text-xl font-bold">Lvl 4</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-brand-secondary" />
                </div>
                <p className="text-xs leading-relaxed italic text-white/60">
                  "Hey! Based on your progress, you're ready for the <b>Options Hedging</b> module."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


