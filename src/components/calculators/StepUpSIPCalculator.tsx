import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, TrendingUp } from 'lucide-react';

export default function StepUpSIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualStepUp, setAnnualStepUp] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const stats = useMemo(() => {
    let totalInvestment = 0;
    let maturityValue = 0;
    const r = expectedReturn / 12 / 100;
    const data = [];
    
    let currentMonthly = monthlyInvestment;
    let accumulatedValue = 0;

    for (let year = 1; year <= timePeriod; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvestment += currentMonthly;
        accumulatedValue = (accumulatedValue + currentMonthly) * (1 + r);
      }
      
      data.push({
        year: `Yr ${year}`,
        investment: Math.round(totalInvestment),
        value: Math.round(accumulatedValue)
      });
      
      currentMonthly = currentMonthly * (1 + (annualStepUp / 100));
    }

    return {
      totalInvestment,
      maturityValue: accumulatedValue,
      estimatedReturns: accumulatedValue - totalInvestment,
      data: [{ year: 'Start', investment: 0, value: 0 }, ...data]
    };
  }, [monthlyInvestment, annualStepUp, expectedReturn, timePeriod]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-8">
        <div className="glass p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Step-Up Inputs</h3>
            <TrendingUp size={16} className="text-brand-primary" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-white/60">Initial Monthly SIP</label>
                <div className="relative group/input">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">₹</span>
                  <input 
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-7 pr-3 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="500" max="100000" step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-white/60">Annual Step-Up (%)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={annualStepUp}
                    onChange={(e) => setAnnualStepUp(Math.max(0, Number(e.target.value)))}
                    className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-7 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="50" step="1"
                value={annualStepUp}
                onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-white/60">Expected Return (p.a)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Math.max(0, Number(e.target.value)))}
                    className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-7 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="30" step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="text-white/60">Time Period (Years)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-10 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono uppercase">Yrs</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="100" step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full accent-brand-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <p className="text-xs font-mono text-white/40 uppercase mb-1">Total Investment</p>
            <p className="text-xl font-bold">{formatCurrency(stats.totalInvestment)}</p>
          </div>
          <div className="bg-brand-primary/10 border border-brand-primary/20 p-5 rounded-2xl">
            <p className="text-xs font-mono text-brand-primary uppercase mb-1">Estimated Returns</p>
            <p className="text-xl font-bold text-brand-primary">{formatCurrency(stats.estimatedReturns)}</p>
          </div>
          <div className="bg-white/10 border border-white/20 p-5 rounded-2xl">
            <p className="text-xs font-mono text-white/40 uppercase mb-1">Maturity Value</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.maturityValue)}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass rounded-[32px] p-8 border-white/10 min-h-[400px] flex flex-col">
          <h3 className="font-bold mb-8">Growth Projection (Step-Up SIP)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'JetBrains Mono' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  width={65}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#00E676', fontWeight: 'bold' }}
                  formatter={(val: number) => [formatCurrency(val), 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00E676" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="investment" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-12 text-[10px] font-mono text-white/40 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary" /> STEP-UP VALUE
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" /> TOTAL INVESTED
            </div>
          </div>
      </div>
    </div>
  );
}
