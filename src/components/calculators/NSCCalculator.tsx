import React, { useState, useMemo } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NSCCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [tenure, setTenure] = useState(5);
  const [interestRate] = useState(7.7); // Fixed rate for NSC

  const stats = useMemo(() => {
    // NSC compounding is annual, but paid at maturity
    const r = interestRate / 100;
    const n = tenure;
    const maturityValue = investment * Math.pow(1 + r, n);
    const totalInterest = maturityValue - investment;

    const chartData = [
      {
        name: 'NSC Breakdown',
        Investment: investment,
        Interest: Math.round(totalInterest)
      }
    ];

    return {
      maturityValue: Math.round(maturityValue),
      totalInterest: Math.round(totalInterest),
      chartData
    };
  }, [investment, interestRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
      <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center">
            <ShieldCheck className="text-brand-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono">NSC CERTIFICATE</h3>
            <p className="text-[10px] text-white/40 tracking-widest leading-none">Fixed 5-Year Savings</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <label className="text-white/40">INITIAL INVESTMENT</label>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-secondary font-mono">₹</span>
                <input 
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Math.max(0, Number(e.target.value)))}
                  className="w-48 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-right text-white font-mono text-xs focus:border-brand-secondary outline-none transition-all"
                />
              </div>
            </div>
            <input type="range" min="1000" max="1500000" step="1000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full h-2 accent-brand-secondary bg-white/5 rounded-full appearance-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Interest Rate</p>
                <p className="font-bold text-brand-secondary">{interestRate}% p.a.</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Lock-in</p>
                  <input 
                    type="number" value={tenure} onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg text-xs p-1 text-right focus:border-brand-secondary outline-none"
                  />
                </div>
                <input type="range" min="1" max="100" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-1.5 accent-brand-secondary bg-white/5 rounded-full appearance-none" />
             </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Maturity Breakdown</p>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={stats.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    formatter={(val: number) => formatCurrency(val)}
                  />
                  <Bar dataKey="Investment" stackId="a" fill="rgba(255,255,255,0.1)" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="Interest" stackId="a" fill="#D4FF3F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span className="text-[8px] font-mono text-white/40 uppercase">Invested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                <span className="text-[8px] font-mono text-white/40 uppercase">Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-brand-secondary/20 bg-brand-secondary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-mono text-brand-secondary font-bold uppercase mb-4 tracking-widest">Maturity Amount</p>
            <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.maturityValue)}</h4>
            <div className="h-1 w-20 bg-brand-secondary mx-auto my-6 rounded-full" />
            <p className="text-white/40 text-sm italic">Guaranteed returns after {tenure} years</p>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-brand-secondary flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              NSC interest is taxable, but it is "re-invested" in the first 4 years, making it eligible for 80C deduction itself.
            </p>
        </div>
      </div>
    </div>
  );
}
