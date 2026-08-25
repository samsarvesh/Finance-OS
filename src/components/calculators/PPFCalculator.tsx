import React, { useState, useMemo } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function PPFCalculator() {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [timePeriod, setTimePeriod] = useState(15);
  const [interestRate] = useState(7.1); // Fixed rate for PPF

  const stats = useMemo(() => {
    const P = annualInvestment;
    const r = interestRate / 100;
    const n = timePeriod;

    // Formula for PPF: F = P [({(1+r)^n} - 1) / r] * (1+r)
    // Note: Assuming investment at start of the year
    const maturityValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvested = P * n;

    return {
      maturityValue: Math.round(maturityValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(maturityValue - totalInvested)
    };
  }, [annualInvestment, timePeriod, interestRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <ShieldCheck className="text-brand-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono uppercase">PPF Calculator</h3>
              <p className="text-[10px] text-white/40 tracking-widest leading-none">Safe Sovereign Savings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">ANNUAL INVESTMENT</span>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={annualInvestment}
                    onChange={(e) => setAnnualInvestment(Math.max(0, Number(e.target.value)))}
                    className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <input 
                type="range" min="500" max="150000" step="500"
                value={annualInvestment}
                onChange={(e) => setAnnualInvestment(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
              <p className="text-[10px] text-white/20 text-right italic">Max ₹1.5L per year allowed</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-sm">
                <span className="text-white/40">TIME PERIOD (YEARS)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Math.min(100, Math.max(15, Number(e.target.value))))}
                    className="w-32 bg-white/5 border border-white/10 rounded-lg py-1 pl-3 pr-8 text-right text-white font-mono text-xs focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 font-mono uppercase text-[8px]">Yrs</span>
                </div>
              </div>
              <input 
                type="range" min="15" max="100" step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full accent-brand-primary h-2 bg-white/5 rounded-full appearance-none"
              />
              <p className="text-[10px] text-white/20 text-right italic">Minimum term is 15 years</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-sm text-white/40">Current Interest Rate</span>
              <span className="text-brand-primary font-bold">{interestRate}% p.a.</span>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
          <Info className="text-brand-primary flex-shrink-0" size={20} />
          <p className="text-xs text-white/40 italic leading-relaxed">
            PPF is EEE: Exempt-Exempt-Exempt. Your investment, interest, and maturity are all tax-free.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Maturity Value</p>
            <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.maturityValue)}</h4>
            <div className="h-2 w-24 bg-brand-primary mx-auto my-6 rounded-full" />
            <div className="flex justify-center gap-8">
               <div>
                 <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Invested</p>
                 <p className="font-bold">{formatCurrency(stats.totalInvested)}</p>
               </div>
               <div>
                 <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Return</p>
                 <p className="font-bold text-brand-primary">{formatCurrency(stats.totalReturns)}</p>
               </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
            <h4 className="font-bold text-sm">Lock-in Period</h4>
            <p className="text-xs text-white/40 leading-relaxed">Funds are locked for 15 years, with partial withdrawals allowed after 7 years under special cases.</p>
          </div>
          <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
            <h4 className="font-bold text-sm">Safety Level</h4>
            <p className="text-xs text-white/40 leading-relaxed">100% Sovereign Guarantee as it's a government-backed savings scheme.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
