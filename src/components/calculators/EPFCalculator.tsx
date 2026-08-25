import React, { useState, useMemo } from 'react';
import { Briefcase, Info } from 'lucide-react';

export default function EPFCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [employeeContribution, setEmployeeContribution] = useState(12);
  const [interestRate, setInterestRate] = useState(8.25);
  const [age, setAge] = useState(25);

  const stats = useMemo(() => {
    const retirementAge = 100;
    const yearsToInvest = Math.max(0, retirementAge - age);
    const r = interestRate / 100;
    
    // Monthly Contribution: Employee (12%) + Employer (Usually 3.67% to EPF, rest 8.33% to EPS)
    const monthlyContribution = basicSalary * (employeeContribution / 100) + basicSalary * 0.0367;
    
    let corpus = 0;
    const monthlyRate = r / 12;

    for (let i = 1; i <= yearsToInvest * 12; i++) {
        corpus = (corpus + monthlyContribution) * (1 + monthlyRate);
    }

    return {
      monthlyContribution: Math.round(monthlyContribution),
      maturityCorpus: Math.round(corpus),
      totalInvested: Math.round(monthlyContribution * yearsToInvest * 12)
    };
  }, [basicSalary, employeeContribution, interestRate, age]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
               <Briefcase className="text-brand-primary" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">EPF ESTIMATOR</h3>
               <p className="text-[10px] text-white/40 tracking-widest leading-none">Employee Provident Fund</p>
             </div>
           </div>

           <div className="space-y-6">
             <div className="space-y-3">
               <div className="flex justify-between items-center font-mono text-xs">
                 <span className="text-white/40">BASIC SALARY + DA</span>
                 <div className="relative group/input">
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                   <input 
                     type="number"
                     value={basicSalary}
                     onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value)))}
                     className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                   />
                 </div>
               </div>
               <input type="range" min="15000" max="500000" step="1000" value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none" />
             </div>

             <div className="space-y-3">
               <div className="flex justify-between items-center font-mono text-xs">
                 <span className="text-white/40">YOUR CONTRIBUTION (%)</span>
                 <div className="relative group/input">
                   <input 
                     type="number"
                     value={employeeContribution}
                     onChange={(e) => setEmployeeContribution(Math.max(12, Number(e.target.value)))}
                     className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                   />
                   <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
                 </div>
               </div>
               <input type="range" min="12" max="20" step="1" value={employeeContribution} onChange={(e) => setEmployeeContribution(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none" />
             </div>

             <div className="space-y-3">
               <div className="flex justify-between items-center font-mono text-xs">
                 <span className="text-white/40">CURRENT AGE</span>
                 <div className="relative group/input">
                   <input 
                     type="number"
                     value={age}
                     onChange={(e) => setAge(Math.min(100, Math.max(18, Number(e.target.value))))}
                     className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                   />
                   <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                 </div>
               </div>
               <input type="range" min="18" max="100" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none" />
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Est. Corpus @ Age 100</p>
            <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.maturityCorpus)}</h4>
            <div className="mt-8 flex justify-center gap-12">
               <div>
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Monthly EPF Share</p>
                  <p className="font-bold">{formatCurrency(stats.monthlyContribution)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Invested</p>
                  <p className="font-bold">{formatCurrency(stats.totalInvested)}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-brand-primary flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              Employer contributes 12% in total. 3.67% goes to EPF (Savings) and 8.33% goes to EPS (Pension). This calculator only tracks the EPF portion.
            </p>
        </div>
      </div>
    </div>
  );
}
