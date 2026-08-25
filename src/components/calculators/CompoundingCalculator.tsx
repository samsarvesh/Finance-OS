import React, { useState, useMemo } from 'react';
import { IndianRupee, Clock, TrendingUp } from 'lucide-react';

export default function CompoundingCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(10);
  const [frequency, setFrequency] = useState(12); // monthly

  const stats = useMemo(() => {
    // Formula: A = P(1 + r/n)^(nt)
    const p = principal;
    const r = rate / 100;
    const n = frequency;
    const t = time;
    const amount = p * Math.pow(1 + r / n, n * t);
    
    return {
      amount,
      interest: amount - p
    };
  }, [principal, rate, time, frequency]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-2xl mx-auto glass p-8 rounded-[40px] border-white/5 space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="text-brand-primary" />
        <h3 className="text-xl font-bold">Compound Interest Master</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase">Principal Amount</label>
            <input 
              type="number" 
              value={principal} 
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-brand-primary transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase">Rate of Interest (% p.a)</label>
            <input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-brand-primary transition-all font-mono"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase">Time Period (Years)</label>
            <input 
              type="number" 
              value={time} 
              onChange={(e) => setTime(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-brand-primary transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase">Compounding Frequency</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/5 focus:border-brand-primary transition-all font-mono"
            >
              <option value="1">Yearly</option>
              <option value="2">Half-Yearly</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 grid md:grid-cols-2 gap-4">
        <div className="p-6 bg-brand-primary/10 rounded-3xl border border-brand-primary/20">
          <p className="text-[10px] font-mono text-brand-primary uppercase mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-brand-primary">{formatCurrency(stats.interest)}</p>
        </div>
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-[10px] font-mono text-white/40 uppercase mb-1">Maturity Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.amount)}</p>
        </div>
      </div>
    </div>
  );
}
