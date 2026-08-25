import React, { useState, useMemo } from 'react';
import { Target, Percent } from 'lucide-react';

export default function CAGRCalculator() {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [duration, setDuration] = useState(5);

  const cagr = useMemo(() => {
    if (duration <= 0 || initialValue <= 0) return 0;
    // Formula: [(Final Value / Initial Value) ^ (1 / duration)] - 1
    const value = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
    return value.toFixed(2);
  }, [initialValue, finalValue, duration]);

  const absoluteReturn = useMemo(() => {
    return (((finalValue - initialValue) / initialValue) * 100).toFixed(2);
  }, [initialValue, finalValue]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="glass p-8 rounded-3xl space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
              <Percent className="text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold">Compound Annual Growth</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-mono text-white/40 uppercase">Initial Value</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                <input 
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-8 pr-4 font-mono focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-white/40 uppercase">Final Value</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono">₹</span>
                <input 
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-8 pr-4 font-mono focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-mono text-white/40">
                <label className="uppercase">Duration (Years)</label>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="100" step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Calculated CAGR</p>
              <h4 className="text-6xl font-bold mb-2 tracking-tighter">{cagr}%</h4>
              <p className="text-white/40 text-sm italic">Compounded every year</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all" />
          </div>

          <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm font-mono">ABSOLUTE RETURN</span>
                <span className="text-xl font-bold text-brand-secondary">+{absoluteReturn}%</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-white/40 text-sm font-mono">TOTAL PROFIT</span>
                <span className="text-xl font-bold">{formatCurrency(finalValue - initialValue)}</span>
              </div>
          </div>
          
          <div className="p-6 glass rounded-2xl border-white/5 bg-white/5">
            <div className="flex gap-3">
              <Target className="text-brand-primary flex-shrink-0" size={20} />
              <p className="text-xs text-white/40 leading-relaxed italic">
                CAGR is the best way to compare returns of different asset classes like Stocks vs FD over different time horizons. It smooths out market volatility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
