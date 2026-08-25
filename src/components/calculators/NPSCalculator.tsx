import React, { useState, useMemo } from 'react';
import { Briefcase, Info } from 'lucide-react';

export default function NPSCalculator() {
  const [investment, setInvestment] = useState(10000);
  const [age, setAge] = useState(25);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [annuityPercent, setAnnuityPercent] = useState(40);

  const stats = useMemo(() => {
    const retirementAge = 100;
    const yearsToInvest = Math.max(0, retirementAge - age);
    const n = yearsToInvest * 12;
    const r = expectedReturn / 12 / 100;
    
    // Future Value of Monthly SIP formula
    const maturityCorpus = investment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = investment * n;
    
    const annuityAmount = maturityCorpus * (annuityPercent / 100);
    const lumpSumAmount = maturityCorpus - annuityAmount;

    // Assuming 6% annuity return
    const monthlyPension = (annuityAmount * 0.06) / 12;

    return {
      maturityCorpus: Math.round(maturityCorpus),
      totalInvested: Math.round(totalInvested),
      annuityAmount: Math.round(annuityAmount),
      lumpSumAmount: Math.round(lumpSumAmount),
      monthlyPension: Math.round(monthlyPension)
    };
  }, [investment, age, expectedReturn, annuityPercent]);

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
        <div className="glass p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-brand-primary" />
            <h3 className="font-bold">NPS Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Monthly Contribution</label>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input type="range" min="500" max="150000" step="500" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Current Age</label>
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
              <input type="range" min="18" max="100" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <p className="text-[9px] text-white/20 text-right">Investment up to age 100</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Expected Returns (%)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono">%</span>
                </div>
              </div>
              <input type="range" min="5" max="15" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Annuity Purchase (%)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={annuityPercent}
                    onChange={(e) => setAnnuityPercent(Math.max(40, Number(e.target.value)))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
                </div>
              </div>
              <input type="range" min="40" max="100" step="1" value={annuityPercent} onChange={(e) => setAnnuityPercent(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
              <p className="text-[9px] text-white/20 text-right">Min 40% mandatory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Est. Monthly Pension</p>
            <h4 className="text-6xl md:text-8xl font-black text-white mb-2 leading-none">{formatCurrency(stats.monthlyPension)}</h4>
            <div className="flex justify-center gap-12 mt-8">
               <div>
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Maturity Corpus</p>
                  <p className="font-bold">{formatCurrency(stats.maturityCorpus)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Tax-Free Lumpsum</p>
                  <p className="font-bold text-brand-primary">{formatCurrency(stats.lumpSumAmount)}</p>
               </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
            <h4 className="font-bold text-sm">Tax Advantage (80CCD)</h4>
            <p className="text-xs text-white/40 leading-relaxed">Extra deduction of <span className="text-white font-bold">₹50,000</span> allowed under Sec 80CCD(1B) beyond the ₹1.5L limit of 80C.</p>
          </div>
          <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
            <h4 className="font-bold text-sm">Equity Exposure</h4>
            <p className="text-xs text-white/40 leading-relaxed">You can choose your equity allocation up to 75% for higher growth (Active Choice).</p>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-brand-primary flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              NPS is one of the lowest-cost investment products globally. Your monthly pension depends on the Annuity rate at the time of retirement.
            </p>
        </div>
      </div>
    </div>
  );
}
