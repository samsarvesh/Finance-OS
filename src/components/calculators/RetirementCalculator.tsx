import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, Wallet, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(45);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [postRetirementReturns, setPostRetirementReturns] = useState(8);

  const stats = useMemo(() => {
    const yearsToRetire = retirementAge - currentAge;
    const expensesAtRetirement = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
    
    const realReturn = ((1 + postRetirementReturns / 100) / (1 + inflation / 100)) - 1;
    const lifeExpectancy = 100;
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
    
    const monthlyRealReturn = realReturn / 12;
    const nMonths = yearsInRetirement * 12;
    const corpusNeeded = expensesAtRetirement * ((1 - Math.pow(1 + monthlyRealReturn, -nMonths)) / monthlyRealReturn);

    const chartData = [
      {
        name: 'Retirement Wealth',
        'Corpus Needed': Math.round(corpusNeeded),
        'Ann. Expenses @ Retirement': Math.round(expensesAtRetirement * 12)
      }
    ];

    return {
      yearsToRetire,
      expensesAtRetirement,
      corpusNeeded,
      chartData
    };
  }, [currentAge, retirementAge, monthlyExpenses, inflation, postRetirementReturns]);

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
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500" size={20} />
            <h3 className="font-bold">FIRE Parameters</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Current Age</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Math.min(100, Math.max(18, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input type="range" min="18" max="100" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40 text-brand-primary font-bold">Retirement Goal</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Math.min(100, Math.max(currentAge + 1, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-brand-primary font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input type="range" min={currentAge + 1} max="100" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Current Monthly Expenses</label>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input type="range" min="5000" max="500000" step="5000" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-white/40">Expected Inflation (%)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={inflation}
                    onChange={(e) => setInflation(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-6 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono">%</span>
                </div>
              </div>
              <input type="range" min="1" max="15" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Target Retirement Corpus</p>
            <h4 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">{formatCurrency(stats.corpusNeeded)}</h4>
            <div className="flex justify-center gap-8 pt-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Monthly Cost then</p>
                <p className="font-bold">{formatCurrency(stats.expensesAtRetirement)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Time to Goal</p>
                <p className="font-bold text-brand-primary">{stats.yearsToRetire} Years</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all" />
        </div>

        <div className="glass p-8 rounded-3xl border-white/5">
          <p className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Projection Analysis</p>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.chartData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="Corpus Needed" fill="#00E676" radius={[6, 6, 6, 6]} barSize={20} />
                <Bar dataKey="Ann. Expenses @ Retirement" fill="rgba(255,255,255,0.1)" radius={[6, 6, 6, 6]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              <span className="text-[10px] font-mono text-white/40 uppercase">Corpus Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-[10px] font-mono text-white/40 uppercase">Yearly Expenses</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <TrendingUp className="text-brand-primary" size={20} />
             </div>
             <h4 className="font-bold">The Rule of 25x</h4>
             <p className="text-xs text-white/40 leading-relaxed">
               A popular FIRE guideline suggests you need 25 times your annual expenses to retire. For you, that would be <span className="text-white font-bold">{formatCurrency(stats.expensesAtRetirement * 12 * 25)}</span>.
             </p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <Wallet className="text-brand-primary" size={20} />
             </div>
             <h4 className="font-bold">Diversified Corpus</h4>
             <p className="text-xs text-white/40 leading-relaxed">
               Ensure your corpus is spread across Equity (growth), Debt (income), and Cash (emergency) to sustain market volatility during retirement.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
