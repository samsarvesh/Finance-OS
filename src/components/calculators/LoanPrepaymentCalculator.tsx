import React, { useState, useMemo } from 'react';
import { ArrowUpRight, TrendingUp, Info } from 'lucide-react';

export default function LoanPrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000);
  const [prepaymentMonth, setPrepaymentMonth] = useState(12); // Prepay after 1 year

  const stats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    // Standard EMI formula
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalWithoutPrepayment = emi * n;
    const interestWithoutPrepayment = totalWithoutPrepayment - P;

    // With Prepayment
    let balance = P;
    let totalWithPrepayment = 0;
    let monthsElapsed = 0;

    // Phase 1: Before prepayment
    for (let i = 1; i <= prepaymentMonth; i++) {
        const interestComponent = balance * r;
        const principalComponent = emi - interestComponent;
        balance -= principalComponent;
        totalWithPrepayment += emi;
        monthsElapsed++;
    }

    // Apply Prepayment
    balance -= prepaymentAmount;
    totalWithPrepayment += prepaymentAmount;

    // Phase 2: After prepayment (calculating remaining months with same EMI)
    while (balance > 0 && monthsElapsed < 1200) { // Safety limit 100 years
        const interestComponent = balance * r;
        let principalComponent = emi - interestComponent;
        
        if (balance < principalComponent) {
            principalComponent = balance;
        }

        balance -= principalComponent;
        totalWithPrepayment += (principalComponent + interestComponent);
        monthsElapsed++;
    }

    const interestSaved = totalWithoutPrepayment - totalWithPrepayment;
    const monthsSaved = n - monthsElapsed;

    return {
      emi,
      interestWithoutPrepayment,
      totalWithPrepayment,
      interestSaved: Math.round(interestSaved),
      monthsSaved: Math.max(0, monthsSaved)
    };
  }, [loanAmount, interestRate, tenureYears, prepaymentAmount, prepaymentMonth]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
               <TrendingUp className="text-brand-primary" size={20} />
             </div>
             <h3 className="font-bold font-mono text-sm tracking-tight uppercase">Loan Details</h3>
          </div>
          
          <div className="space-y-6">
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-white/40 uppercase tracking-widest">Loan Amount</span>
                  <div className="relative group/input">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                    <input 
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-5 pr-2 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <input type="range" min="100000" max="10000000" step="50000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1 accent-brand-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-white/40 uppercase tracking-widest text-brand-primary">Interest Rate</span>
                  <div className="relative group/input">
                    <input 
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                      className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px]">%</span>
                  </div>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                  <div className="relative group/input">
                    <input 
                      type="number"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
               <ArrowUpRight className="text-brand-primary" size={20} />
             </div>
             <h3 className="font-bold font-mono text-sm tracking-tight uppercase text-brand-primary">Prepayment</h3>
          </div>
          
          <div className="space-y-6">
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-brand-primary/60 uppercase tracking-widest leading-tight">Lumpsum Prepay</span>
                  <div className="relative group/input">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                    <input 
                      type="number"
                      value={prepaymentAmount}
                      onChange={(e) => setPrepaymentAmount(Math.max(0, Number(e.target.value)))}
                      className="w-32 bg-white/10 border border-brand-primary/20 rounded-lg py-1 pl-5 pr-2 text-right text-white font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <input type="range" min="10000" max="5000000" step="10000" value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(Number(e.target.value))} className="w-full h-1 accent-brand-primary bg-white/10 rounded-full appearance-none cursor-pointer" />
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-brand-primary/60 uppercase tracking-widest leading-tight">After Month #</span>
                  <div className="relative group/input">
                    <input 
                      type="number"
                      value={prepaymentMonth}
                      onChange={(e) => setPrepaymentMonth(Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-white/10 border border-brand-primary/20 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
         <div className="glass p-12 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Estimated Interest Saved</p>
              <h4 className="text-6xl md:text-8xl font-black text-white mb-2 leading-none tracking-tighter">{formatCurrency(stats.interestSaved)}</h4>
              <p className="text-white/40 text-[10px] uppercase font-mono mt-6 tracking-widest">You finish your loan <span className="text-brand-primary font-bold">{stats.monthsSaved} months</span> earlier!</p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all" />
         </div>

         <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-8 rounded-3xl border-white/5">
               <p className="text-[10px] font-mono text-white/40 uppercase mb-2 tracking-widest">Original Interest</p>
               <p className="text-2xl font-bold">{formatCurrency(stats.interestWithoutPrepayment)}</p>
            </div>
            <div className="glass p-8 rounded-3xl border-white/5">
               <p className="text-[10px] font-mono text-white/40 uppercase mb-2 tracking-widest text-brand-primary">Total Interest Saved</p>
               <p className="text-2xl font-bold text-brand-primary">{formatCurrency(stats.interestSaved)}</p>
            </div>
         </div>

         <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-brand-primary flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              Prepaying even a small amount early in the tenure can drastically reduce your interest cost because principal reduction in the initial years saves years of interest compounding.
            </p>
         </div>
      </div>
    </div>
  );
}
