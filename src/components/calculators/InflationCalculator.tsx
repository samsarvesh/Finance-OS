import React, { useState, useMemo } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [timePeriod, setTimePeriod] = useState(10);

  const stats = useMemo(() => {
    // Formula for Future Value: FV = PV * (1 + r)^n
    const pv = currentAmount;
    const r = inflationRate / 100;
    const n = timePeriod;
    const futureValue = pv * Math.pow(1 + r, n);
    
    // Purchasing power: PV = FV / (1 + r)^n
    const purchasingPower = pv / Math.pow(1 + r, n);

    return {
      futureValue: Math.round(futureValue),
      purchasingPower: Math.round(purchasingPower),
      difference: Math.round(futureValue - pv)
    };
  }, [currentAmount, inflationRate, timePeriod]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
               <Clock className="text-brand-primary" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">INFLATION METER</h3>
               <p className="text-[10px] text-white/40 tracking-widest leading-none">Purchasing Power Loss</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-white/40">CURRENT COST / AMOUNT</span>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                  <input 
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input 
                type="range" min="1000" max="1000000" step="5000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-white/40">EXPECTED INFLATION RATE (%)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="25" step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-white/40">TIME HORIZON (YEARS)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-10 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[10px] uppercase font-mono">Yrs</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="100" step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="glass p-10 rounded-[40px] border-white/10 bg-white/5 text-center flex-1 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-xs font-mono text-white/40 font-bold uppercase mb-4 tracking-widest">Future Cost of Lifestyle</p>
            <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.futureValue)}</h4>
            <p className="text-brand-primary text-sm font-bold mt-4">Extra ₹{stats.difference.toLocaleString()} needed</p>
          </div>

          <div className="glass p-8 rounded-3xl border-white/5 bg-red-500/5 text-center">
            <p className="text-[10px] font-mono text-red-400 uppercase mb-2">Value of {formatCurrency(currentAmount)} in today's terms</p>
            <h5 className="text-2xl font-bold">{formatCurrency(stats.purchasingPower)}</h5>
            <p className="text-[10px] text-white/20 mt-1 italic">Hidden tax on your savings</p>
          </div>
        </div>
      </div>
      
      <div className="glass p-6 rounded-3xl border-white/5 flex gap-6 items-start">
         <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
           <TrendingUp className="text-brand-primary" />
         </div>
         <div>
           <h4 className="font-bold mb-1">Beat Inflation with Equity</h4>
           <p className="text-xs text-white/40 leading-relaxed">
             The average inflation in India rests around 5-6%. To preserve purchasing power, your investments must generate a CAGR higher than the inflation rate after taxes.
           </p>
         </div>
      </div>
    </div>
  );
}
