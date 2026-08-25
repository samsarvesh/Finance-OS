import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, Calendar, Percent, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LumpsumCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [totalValue, setTotalValue] = useState(0);
  const [estReturns, setEstReturns] = useState(0);

  useEffect(() => {
    const total = investment * Math.pow(1 + rate / 100, years);
    setTotalValue(Math.round(total));
    setEstReturns(Math.round(total - investment));
  }, [investment, rate, years]);

  const chartData = [
    {
      name: 'Lumpsum Breakdown',
      Principal: investment,
      Interest: estReturns
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[40px] border-white/5 space-y-8"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <IndianRupee size={14} className="text-brand-primary" /> Total Investment
              </label>
              <div className="relative group/input">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">₹</span>
                <input 
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Math.max(0, Number(e.target.value)))}
                  className="w-56 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-7 pr-3 text-right text-brand-primary font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
              </div>
            </div>
            <input 
              type="range" min="5000" max="10000000" step="5000" 
              value={investment} onChange={(e) => setInvestment(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Percent size={14} className="text-brand-secondary" /> Expected Return (p.a)
              </label>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-7 text-right text-brand-secondary font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary text-xs font-mono">%</span>
              </div>
            </div>
            <input 
              type="range" min="1" max="30" step="0.5" 
              value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="slider secondary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-brand-accent" /> Time Period
              </label>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-10 text-right text-brand-accent font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-accent text-[10px] font-mono uppercase">Yrs</span>
              </div>
            </div>
            <input 
              type="range" min="1" max="100" step="1" 
              value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="slider accent"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Growth Breakdown</p>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="Principal" stackId="a" fill="rgba(255,255,255,0.1)" radius={[6, 0, 0, 6]} />
                <Bar dataKey="Interest" stackId="a" fill="#D4FF3F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="glass p-8 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 flex flex-col justify-center min-h-[300px] text-center">
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Estimated Future Value</p>
          <h3 className="text-6xl font-bold text-brand-primary mb-4">₹{totalValue.toLocaleString()}</h3>
          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Invested Amount</p>
              <p className="text-xl font-bold">₹{investment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Est. Returns</p>
              <p className="text-xl font-bold text-brand-secondary">₹{estReturns.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Wealth Factor</p>
              <p className="text-lg font-bold">{(totalValue / investment).toFixed(2)}x</p>
            </div>
          </div>
          <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono">Interest</p>
              <p className="text-lg font-bold">Compounded</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
