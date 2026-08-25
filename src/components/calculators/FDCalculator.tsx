import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Wallet, Info } from 'lucide-react';

export default function FDCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(5);

  const stats = useMemo(() => {
    // Formula for Compounded FD: A = P(1 + r/n)^(nt)
    const n = 4;
    const r = rate / 100;
    const t = time;
    const maturityValue = investment * Math.pow(1 + r / n, n * t);
    const estimatedReturns = maturityValue - investment;

    const chartData = [
      {
        name: 'Fixed Deposit Breakdown',
        Principal: Math.round(investment),
        Interest: Math.round(estimatedReturns)
      }
    ];

    return {
      maturityValue,
      estimatedReturns,
      chartData
    };
  }, [investment, rate, time]);

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
               <Wallet className="text-brand-primary" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">FIXED DEPOSIT</h3>
               <p className="text-xs text-white/40 uppercase tracking-widest leading-none">Safe Returns Engine</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">TOTAL INVESTMENT</span>
                <div className="relative group/input">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xs font-mono">₹</span>
                  <input 
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-56 bg-white/5 border border-white/10 rounded-lg py-1 pl-7 pr-3 text-right text-white font-mono text-sm focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input 
                type="range" min="1000" max="1000000" step="5000"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">INTEREST RATE (p.a)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                    className="w-36 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">%</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="15" step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">TIME PERIOD (Years)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={time}
                    onChange={(e) => setTime(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-36 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-10 text-right text-white font-mono text-sm focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-[10px] font-mono uppercase">Yrs</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="100" step="1"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="glass p-6 rounded-3xl border-white/5 bg-white/5">
              <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Interest Earned</p>
              <p className="text-xl font-bold text-brand-primary">{formatCurrency(stats.estimatedReturns)}</p>
           </div>
           <div className="glass p-6 rounded-3xl border-white/5 bg-white/10">
              <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Maturity Value</p>
              <p className="text-xl font-bold">{formatCurrency(stats.maturityValue)}</p>
           </div>
        </div>
      </div>

      <div className="min-h-[400px] relative flex flex-col justify-center">
         <div className="absolute inset-0 flex items-center justify-center -z-10 bg-[radial-gradient(circle_at_center,rgba(0,230,118,0.05),transparent)] opacity-50" />
         
         <div className="flex-1 w-full flex items-center">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={stats.chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                formatter={(val: number) => formatCurrency(val)}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="Principal" stackId="a" fill="rgba(255,255,255,0.1)" radius={[10, 0, 0, 10]} />
              <Bar dataKey="Interest" stackId="a" fill="#00E676" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
         </div>

         <div className="mt-8 p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-brand-primary flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 italic leading-relaxed">
              Note: Estimates based on quarterly compounding (standard in India). Actual interest may vary slightly depending on monthly or cumulative payouts.
            </p>
         </div>
      </div>
    </div>
  );
}
