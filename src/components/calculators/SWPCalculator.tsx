import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Info, ArrowDownRight } from 'lucide-react';

export default function SWPCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [timePeriod, setTimePeriod] = useState(10);

  const stats = useMemo(() => {
    let balance = totalInvestment;
    const r = expectedReturn / 12 / 100;
    const totalWithdrawn = monthlyWithdrawal * timePeriod * 12;
    const data = [];

    for (let year = 1; year <= timePeriod; year++) {
      for (let month = 1; month <= 12; month++) {
        balance = (balance - monthlyWithdrawal) * (1 + r);
      }
      data.push({
        year: `Yr ${year}`,
        balance: Math.max(0, Math.round(balance)),
      });
      if (balance <= 0) break;
    }

    return {
      finalBalance: Math.max(0, balance),
      totalWithdrawn,
      data: [{ year: 'Start', balance: totalInvestment }, ...data]
    };
  }, [totalInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">SWP Settings</h3>
            <ArrowDownRight size={16} className="text-red-500" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Total Investment</label>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-56 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input type="range" min="100000" max="50000000" step="100000" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Monthly Withdrawal</label>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-red-500 text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={monthlyWithdrawal}
                    onChange={(e) => setMonthlyWithdrawal(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-red-500 font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input type="range" min="1000" max="500000" step="1000" value={monthlyWithdrawal} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Expected Return (%)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-7 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono">%</span>
                </div>
              </div>
              <input type="range" min="1" max="25" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Time Period (Years)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input type="range" min="1" max="100" step="1" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
           <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Withdrawn</p>
             <p className="text-xl font-bold text-red-500">{formatCurrency(stats.totalWithdrawn)}</p>
           </div>
           <div className="p-5 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
             <p className="text-[10px] text-brand-primary uppercase font-mono mb-1">Final Balance</p>
             <p className="text-xl font-bold text-brand-primary">{formatCurrency(stats.finalBalance)}</p>
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass rounded-[32px] p-8 border-white/10 flex flex-col">
        <h3 className="font-bold mb-8">Capital Sustainability Projection</h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSWP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                interval={timePeriod >= 50 ? 19 : timePeriod >= 20 ? 4 : 0}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
              />
              <YAxis axisLine={false} tickLine={false} width={65} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141416', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#00E676' }}
                formatter={(val: number) => [formatCurrency(val), 'Balance']}
              />
              <Area type="monotone" dataKey="balance" stroke="#00E676" strokeWidth={3} fill="url(#colorSWP)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex items-start gap-3 p-4 bg-white/5 rounded-2xl">
          <Info size={18} className="text-brand-primary flex-shrink-0" />
          <p className="text-[10px] text-white/40 leading-relaxed italic">
            A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount at regular intervals. It is tax-efficient compared to dividends.
          </p>
        </div>
      </div>
    </div>
  );
}
