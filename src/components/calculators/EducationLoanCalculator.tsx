import React, { useState, useMemo } from 'react';
import { GraduationCap, Info } from 'lucide-react';

export default function EducationLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(11);
  const [moratoriumYears, setMoratoriumYears] = useState(4); // Duration of study
  const [repaymentYears, setRepaymentYears] = useState(10); // Duration to pay back after study

  const stats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 100;
    
    // During moratorium, simple interest usually accumulates
    const accumulatedInterest = P * r * moratoriumYears;
    const effectivePrincipal = P + accumulatedInterest;
    
    // Repayment Phase EMI
    const monthlyRate = interestRate / 12 / 100;
    const n = repaymentYears * 12;
    const emi = (effectivePrincipal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      accumulatedInterest: Math.round(accumulatedInterest),
      effectivePrincipal: Math.round(effectivePrincipal),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  }, [loanAmount, interestRate, moratoriumYears, repaymentYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
               <GraduationCap className="text-indigo-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">STUDENT LOAN</h3>
               <p className="text-[10px] text-white/40 tracking-widest leading-none">Career Investment Engine</p>
             </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest">Loan Amount</span>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                    className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-indigo-400 font-mono text-sm focus:border-indigo-400 outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <input type="range" min="50000" max="10000000" step="50000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1.5 accent-indigo-400 bg-white/5 rounded-full appearance-none cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                   <span className="font-mono text-white/40 uppercase tracking-widest leading-tight">Moratorium</span>
                   <div className="relative group/input">
                    <input 
                      type="number"
                      value={moratoriumYears}
                      onChange={(e) => setMoratoriumYears(Math.min(10, Math.max(1, Number(e.target.value))))}
                      className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-indigo-400 outline-none transition-all font-bold"
                    />
                  </div>
                 </div>
                 <input type="range" min="1" max="10" value={moratoriumYears} onChange={(e) => setMoratoriumYears(Number(e.target.value))} className="w-full h-1.5 accent-indigo-400 bg-white/5 rounded-full appearance-none cursor-pointer" />
                 <p className="text-[9px] text-white/20 italic">(Study Duration)</p>
               </div>
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                   <span className="font-mono text-white/40 uppercase tracking-widest leading-tight">Repayment</span>
                   <div className="relative group/input">
                    <input 
                      type="number"
                      value={repaymentYears}
                      onChange={(e) => setRepaymentYears(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-indigo-400 outline-none transition-all font-bold"
                    />
                  </div>
                 </div>
                 <input type="range" min="1" max="100" value={repaymentYears} onChange={(e) => setRepaymentYears(Number(e.target.value))} className="w-full h-1.5 accent-indigo-400 bg-white/5 rounded-full appearance-none cursor-pointer" />
                 <p className="text-[9px] text-white/20 italic">(Post-moratorium)</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest">Interest Rate</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-right text-indigo-400 font-mono text-sm focus:border-indigo-400 outline-none transition-all font-bold"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] font-mono">%</span>
                </div>
              </div>
              <input type="range" min="5" max="18" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-1.5 accent-indigo-400 bg-white/5 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 bg-indigo-500/5 flex gap-4 items-start">
            <Info className="text-indigo-400 flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              Accumulated Interest during study period is added to your principal. Repayment starts only after you complete the course.
            </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase mb-4 tracking-widest">Monthly EMI Post-Study</p>
            <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.emi)}</h4>
            <div className="h-1 w-20 bg-indigo-500 mx-auto my-6 rounded-full" />
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Interest</p>
                 <p className="font-bold text-indigo-400">{formatCurrency(stats.totalInterest)}</p>
               </div>
               <div>
                 <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Maturity Debt</p>
                 <p className="font-bold">{formatCurrency(stats.effectivePrincipal)}</p>
               </div>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all" />
        </div>

        <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
           <h4 className="font-bold text-sm">Interest accumulation</h4>
           <p className="text-xs text-white/40 leading-relaxed">During your {moratoriumYears} years of study, your loan will accumulate <span className="text-white font-bold">{formatCurrency(stats.accumulatedInterest)}</span> in interest which is capitalized.</p>
        </div>
      </div>
    </div>
  );
}
