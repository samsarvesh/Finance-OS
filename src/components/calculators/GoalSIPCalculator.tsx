import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, IndianRupee } from 'lucide-react';

export default function GoalSIPCalculator() {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const stats = useMemo(() => {
    // Formula for target SIP: M = T / [ ((1+i)^n - 1) / i * (1+i) ]
    const T = targetAmount;
    const i = rate / 12 / 100;
    const n = years * 12;

    const monthlySIP = T / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvested = monthlySIP * n;

    return {
      monthlySIP: Math.round(monthlySIP),
      totalInvested: Math.round(totalInvested),
      returnsNeeded: Math.round(targetAmount - totalInvested)
    };
  }, [targetAmount, rate, years]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <Target className="text-brand-primary" />
          <h3 className="text-xl font-bold">Reverse Goal Planning</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-mono text-white/40 uppercase">Target corpus Value</label>
            <div className="relative group/input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary font-mono">₹</span>
              <input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-white/5 p-4 pl-10 rounded-2xl border border-white/5 group-hover/input:border-white/20 focus:border-brand-primary outline-none transition-all font-bold text-lg"
              />
            </div>
            <input 
              type="range" min="100000" max="100000000" step="100000"
              value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-full appearance-none mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-white/40 mb-1">
              <span>EXPECTED RETURN (%)</span>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
              </div>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-full appearance-none" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-white/40 mb-1">
              <span>TIME HORIZON (YEARS)</span>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
              </div>
            </div>
            <input type="range" min="1" max="100" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-full appearance-none" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center shadow-xl">
           <p className="text-xs font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Monthly Investment Needed</p>
           <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.monthlySIP)}</h4>
           <div className="h-2 w-24 bg-brand-primary mx-auto my-6 rounded-full" />
           <p className="text-white/40 text-sm">Estimated contribution for {years} years</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl text-center">
            <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Total Invested</p>
            <p className="text-lg font-bold">{formatCurrency(stats.totalInvested)}</p>
          </div>
          <div className="glass p-6 rounded-3xl text-center">
            <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Return Needed</p>
            <p className="text-lg font-bold text-brand-primary">{formatCurrency(stats.returnsNeeded)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
