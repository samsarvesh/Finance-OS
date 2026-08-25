import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { domToBlob, domToJpeg } from 'modern-screenshot';
import { 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  RefreshCcw, 
  Percent, 
  Clock, 
  IndianRupee, 
  Home, 
  Briefcase, 
  ShieldCheck, 
  Car, 
  GraduationCap, 
  User,
  Calculator as CalcIcon,
  ChevronLeft,
  ArrowRight,
  PieChart,
  Wallet,
  Share2,
  Camera,
  FileDown,
  Copy,
  Download
} from 'lucide-react';
import SIPCalculator from './SIPCalculator';
import LumpsumCalculator from './LumpsumCalculator';
import EMICalculator from './EMICalculator';
import EligibilityCalculator from './EligibilityCalculator';
import IncomeTaxCalculator from './IncomeTaxCalculator';
import StepUpSIPCalculator from './StepUpSIPCalculator';
import CAGRCalculator from './CAGRCalculator';
import FDCalculator from './FDCalculator';
import RetirementCalculator from './RetirementCalculator';
import CompoundingCalculator from './CompoundingCalculator';
import SWPCalculator from './SWPCalculator';
import GoalSIPCalculator from './GoalSIPCalculator';
import InterestFreeComparison from './InterestFreeComparison';
import PPFCalculator from './PPFCalculator';
import InflationCalculator from './InflationCalculator';
import SimpleInterestCalculator from './SimpleInterestCalculator';
import RDCalculator from './RDCalculator';
import LoanPrepaymentCalculator from './LoanPrepaymentCalculator';
import EducationLoanCalculator from './EducationLoanCalculator';
import HomeLoanCalculator from './HomeLoanCalculator';
import PersonalLoanCalculator from './PersonalLoanCalculator';
import CarLoanCalculator from './CarLoanCalculator';
import NPSCalculator from './NPSCalculator';
import EPFCalculator from './EPFCalculator';
import NSCCalculator from './NSCCalculator';

// Fallback for not yet implemented tools
const ComingSoon = ({ name }: { name: string }) => (
  <div className="h-[400px] flex flex-col items-center justify-center text-center glass rounded-[40px] border-white/5 p-12">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white/20">
      <CalcIcon size={32} />
    </div>
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <p className="text-white/40 max-w-sm">This calculator is being calibrated with the latest financial formulas and tax laws. Coming very soon!</p>
  </div>
);

type Category = 'Investment' | 'Retirement' | 'Loans';

interface Tool {
  id: string;
  name: string;
  icon: any;
  category: Category;
  description: string;
}

const TOOLS: Tool[] = [
  // Investment
  { id: 'SIP', name: 'SIP Calculator', icon: TrendingUp, category: 'Investment', description: 'Regular monthly investments growth.' },
  { id: 'GoalSIP', name: 'Goal SIP', icon: Target, category: 'Investment', description: 'Monthly saving needed for a target amount.' },
  { id: 'StepUpSIP', name: 'Step-Up SIP', icon: ArrowUpRight, category: 'Investment', description: 'Growth with annual contribution increase.' },
  { id: 'Lumpsum', name: 'Lumpsum', icon: IndianRupee, category: 'Investment', description: 'One-time investment growth over time.' },
  { id: 'Compounding', name: 'Compounding', icon: RefreshCcw, category: 'Investment', description: 'Power of frequency-based compounding.' },
  { id: 'CAGR', name: 'CAGR Calculator', icon: Percent, category: 'Investment', description: 'Annualized rate of return calculator.' },
  { id: 'SWP', name: 'SWP Calculator', icon: PieChart, category: 'Investment', description: 'Monthly withdrawals from an investment corpus.' },
  { id: 'Inflation', name: 'Inflation', icon: Clock, category: 'Investment', description: 'Future value of money adjusted for inflation.' },
  { id: 'SimpleInterest', name: 'Simple Interest', icon: CalcIcon, category: 'Investment', description: 'Basic interest calculation on principal.' },
  
  // Retirement & Savings
  { id: 'PPF', name: 'PPF Calculator', icon: ShieldCheck, category: 'Retirement', description: 'Public Provident Fund growth and tax benefits.' },
  { id: 'NSC', name: 'NSC Calculator', icon: ShieldCheck, category: 'Retirement', description: 'National Savings Certificate returns.' },
  { id: 'NPS', name: 'NPS Calculator', icon: Briefcase, category: 'Retirement', description: 'National Pension Scheme maturity & annuity.' },
  { id: 'EPF', name: 'EPF Calculator', icon: Briefcase, category: 'Retirement', description: 'Employee Provident Fund corpus projection.' },
  { id: 'FD', name: 'FD Calculator', icon: Wallet, category: 'Retirement', description: 'Fixed Deposit returns with tax impact.' },
  { id: 'RD', name: 'RD Calculator', icon: Wallet, category: 'Retirement', description: 'Recurring Deposit maturity value.' },
  { id: 'Retirement', name: 'Retirement / FIRE', icon: Target, category: 'Retirement', description: 'Calculate corpus needed to retire early.' },
  
  // Loans & EMI
  { id: 'HomeLoan', name: 'Home Loan', icon: Home, category: 'Loans', description: 'Detailed Home Loan EMI and schedule.' },
  { id: 'InterestFree', name: 'Interest-Free Loan', icon: Percent, category: 'Loans', description: 'Calculate true cost of schemes (vs standard).' },
  { id: 'Prepayment', name: 'Loan Pre-payment', icon: ArrowUpRight, category: 'Loans', description: 'Interest saved by paying early.' },
  { id: 'Eligible', name: 'Home Loan Eligibility', icon: ShieldCheck, category: 'Loans', description: 'How much loan can you actually get?' },
  { id: 'CarLoan', name: 'Car Loan', icon: Car, category: 'Loans', description: 'Vehicle loan EMI and interest costs.' },
  { id: 'EducationLoan', name: 'Educational Loan', icon: GraduationCap, category: 'Loans', description: 'Study loan with moratorium periods.' },
  { id: 'PersonalLoan', name: 'Personal Loan', icon: User, category: 'Loans', description: 'Unsecured loan EMI and processing fees.' },
  { id: 'EMI', name: 'EMI Loan', icon: CalcIcon, category: 'Loans', description: 'General purpose loan calculator.' },
  { id: 'Tax', name: 'Income Tax (FY 24-25)', icon: PieChart, category: 'Loans', description: 'Calculate tax under Old vs New regime.' },
];

export default function CalculatorsHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('Investment');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const filteredTools = TOOLS.filter(t => t.category === activeCategory);
  const activeTool = TOOLS.find(t => t.id === activeToolId);

  const handleShareScreenshot = async () => {
    if (!captureRef.current) return;
    setIsCapturing(true);
    
    try {
      const blob = await domToBlob(captureRef.current, {
        backgroundColor: '#0A0A0B',
        scale: 2,
      });
      
      if (!blob) return;

      // Copy to clipboard
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        // Optional: Show a "Copied" toast or feedback
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        // Fallback to native share if clipboard fails
        const file = new File([blob], `${activeTool?.name || 'Calculation'}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: activeTool?.name,
            text: `Check out my ${activeTool?.name} results on Finance OS.`
          });
        }
      }
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSaveJPG = async () => {
    if (!captureRef.current) return;
    setIsCapturing(true);

    try {
      const dataUrl = await domToJpeg(captureRef.current, {
        backgroundColor: '#0A0A0B',
        scale: 2,
        quality: 0.95
      });

      if (!dataUrl) return;

      const link = document.createElement('a');
      link.download = `${activeTool?.name || 'Calculation'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('JPG export failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const renderTool = () => {
    switch (activeToolId) {
      case 'SIP': return <SIPCalculator />;
      case 'Lumpsum': return <LumpsumCalculator />;
      case 'EMI': return <EMICalculator />;
      case 'Eligible': return <EligibilityCalculator />;
      case 'Tax': return <IncomeTaxCalculator />;
      case 'StepUpSIP': return <StepUpSIPCalculator />;
      case 'CAGR': return <CAGRCalculator />;
      case 'FD': return <FDCalculator />;
      case 'Retirement': return <RetirementCalculator />;
      case 'Compounding': return <CompoundingCalculator />;
      case 'SWP': return <SWPCalculator />;
      case 'GoalSIP': return <GoalSIPCalculator />;
      case 'InterestFree': return <InterestFreeComparison />;
      case 'PPF': return <PPFCalculator />;
      case 'Inflation': return <InflationCalculator />;
      case 'SimpleInterest': return <SimpleInterestCalculator />;
      case 'RD': return <RDCalculator />;
      case 'Prepayment': return <LoanPrepaymentCalculator />;
      case 'HomeLoan': return <HomeLoanCalculator />;
      case 'EducationLoan': return <EducationLoanCalculator />;
      case 'PersonalLoan': return <PersonalLoanCalculator />;
      case 'CarLoan': return <CarLoanCalculator />;
      case 'NPS': return <NPSCalculator />;
      case 'EPF': return <EPFCalculator />;
      case 'NSC': return <NSCCalculator />;
      default: return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {!activeToolId ? (
          <motion.div
            key="selection-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <header className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Choice of Professionals</h2>
              <p className="text-white/40 max-w-2xl mx-auto text-lg italic">
                Quantify your journey. Navigate the path to financial freedom with clinical precision.
              </p>
            </header>

            <div className="space-y-8">
              {/* Category Selection */}
              <div className="flex justify-center">
                <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/5">
                  {(['Investment', 'Retirement', 'Loans'] as Category[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-8 py-3 rounded-2xl text-xs font-mono font-bold transition-all uppercase tracking-widest ${activeCategory === cat ? 'bg-brand-primary text-bg-deep' : 'text-white/40 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, idx) => (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveToolId(tool.id)}
                    className="group relative glass p-8 rounded-[40px] text-left border-white/5 hover:border-brand-primary/50 hover:bg-white/10 transition-all overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-bg-deep transition-all duration-500">
                        <tool.icon size={26} />
                      </div>
                      <ArrowRight className="text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" size={24} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{tool.name}</h3>
                    <p className="text-xs text-white/40 leading-relaxed font-mono">
                      {tool.description}
                    </p>

                    {/* Decor shadow */}
                    <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/15 transition-all" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tool-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-8">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveToolId(null)}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">{activeTool?.category}</span>
                    <span className="text-white/20 text-xs">/</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{activeTool?.name}</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{activeTool?.name}</h2>
                </div>
              </div>

              <div className="hidden md:flex gap-3">
                 <button 
                  onClick={handleShareScreenshot}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50"
                 >
                   {isCapturing ? <RefreshCcw className="animate-spin" size={14} /> : <Copy size={14} />}
                   {isCapturing ? 'CAPTURING...' : 'SHARE'}
                 </button>
                 <button 
                  onClick={handleSaveJPG}
                  disabled={isCapturing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-bg-deep hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,230,118,0.3)]"
                 >
                   {isCapturing ? <RefreshCcw className="animate-spin" size={14} /> : <Download size={14} />}
                   {isCapturing ? 'GENERATING...' : 'SAVE'}
                 </button>
              </div>
            </div>

            <div ref={captureRef} className="min-h-[500px] p-4 rounded-[40px]">
               {renderTool()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
