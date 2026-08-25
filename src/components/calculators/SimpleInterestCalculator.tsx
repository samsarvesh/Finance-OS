import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(5);

  const stats = useMemo(() => {
    // Formula: I = P * R * T / 100
    const interest = (principal * rate * time) / 100;
    const total = principal + interest;
    
    return {
      interest,
      total
    };
  }, [principal, rate, time]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-2xl mx-auto glass p-10 rounded-[40px] border-white/5 space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <Calculator className="text-white/60" size={24} />
        </div>
        <div>
           <h3 className="text-2xl font-bold tracking-tight">Simple Interest</h3>
           <p className="text-xs text-white/40 uppercase font-mono tracking-widest leading-none">Standard P*R*T Calculation</p>
        </div>
      </div>

      <div className="grid gap-8">
         <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-white/40">
              <label>PRINCIPAL AMOUNT</label>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">₹</span>
                <input 
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                  className="w-56 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            <input type="range" min="1000" max="10000000" step="1000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
         </div>

         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-white/40">
                <label>RATE (% P.A)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
                </div>
              </div>
              <input type="range" min="1" max="50" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-white/40">
                <label>TIME (YEARS)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={time}
                    onChange={(e) => setTime(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input type="range" min="1" max="100" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-8 bg-brand-primary/10 rounded-[32px] border border-brand-primary/20 text-center">
           <p className="text-[10px] font-mono text-brand-primary uppercase mb-2">Total Interest</p>
           <p className="text-3xl font-bold text-brand-primary">{formatCurrency(stats.interest)}</p>
        </div>
        <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 text-center">
           <p className="text-[10px] font-mono text-white/40 uppercase mb-2">Total Amount</p>
           <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
        </div>
      </div>
    </div>
  );
}
