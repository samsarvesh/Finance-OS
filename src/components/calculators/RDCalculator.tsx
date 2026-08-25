import React, { useState, useMemo } from 'react';
import { Wallet, PieChart as ChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(6.5);
  const [time, setTime] = useState(5);

  const stats = useMemo(() => {
    // Formula for RD Maturity: M = P * [ {(1+i)^n - 1} / {1 - (1+i)^-1/3} ]
    const p = monthlyDeposit;
    const r = rate / 100;
    const n = time * 12; // total months
    
    const i = r / 4;
    const maturityValue = p * ((Math.pow(1 + i, n / 3) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
    const totalInvested = p * n;

    const chartData = [
      {
        name: 'RD Breakdown',
        Invested: Math.round(totalInvested),
        Interest: Math.round(maturityValue - totalInvested)
      }
    ];

    return {
      maturityValue,
      totalInvested,
      totalInterest: maturityValue - totalInvested,
      chartData
    };
  }, [monthlyDeposit, rate, time]);

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
               <h3 className="text-xl font-bold font-mono">RECURRING DEPOSIT</h3>
               <p className="text-[10px] text-white/40 tracking-widest leading-none">Monthly Fixed Income</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">MONTHLY DEPOSIT</span>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">₹</span>
                  <input 
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input type="range" min="500" max="100000" step="500" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">INTEREST RATE (%)</span>
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
              <input type="range" min="1" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">TIME PERIOD (YEARS)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={time}
                    onChange={(e) => setTime(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input type="range" min="1" max="100" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="glass p-6 rounded-3xl border-white/5 bg-white/5">
              <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Total Yield</p>
              <p className="text-xl font-bold text-brand-primary truncate">{formatCurrency(stats.totalInterest)}</p>
           </div>
           <div className="glass p-6 rounded-3xl border-white/5 bg-white/10">
              <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Maturity Amount</p>
              <p className="text-xl font-bold truncate">{formatCurrency(stats.maturityValue)}</p>
           </div>
        </div>
      </div>

      <div className="h-[400px] flex flex-col items-center justify-center">
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
              <Bar dataKey="Invested" stackId="a" fill="rgba(255,255,255,0.1)" radius={[10, 0, 0, 10]} />
              <Bar dataKey="Interest" stackId="a" fill="#00E676" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
