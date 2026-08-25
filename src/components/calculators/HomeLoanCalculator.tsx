import React, { useState, useMemo } from 'react';
import { Home, ShieldCheck, Landmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HomeLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const stats = useMemo(() => {
    const r = rate / (12 * 100);
    const n = tenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    const chartData = [
      {
        name: 'Loan Breakdown',
        Principal: loanAmount,
        Interest: Math.round(totalInterest)
      }
    ];

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      chartData
    };
  }, [loanAmount, rate, tenure]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
               <Home className="text-brand-primary" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">HOME LOAN</h3>
               <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest leading-none mt-1">Mortgage Planner</p>
             </div>
           </div>

           <div className="space-y-8">
             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Loan Amount</span>
                 <div className="relative group/input">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                    <input 
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                  </div>
               </div>
               <input type="range" min="500000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Interest Rate</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">%</span>
                  </div>
               </div>
               <input type="range" min="5" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-10 text-right text-white font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[10px] font-mono uppercase">Yrs</span>
                  </div>
               </div>
               <input type="range" min="1" max="100" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-1.5 accent-brand-primary bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>
           </div>

           <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Total Cost Breakdown</p>
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
                  <Bar dataKey="Principal" stackId="a" fill="rgba(255,255,255,0.1)" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="Interest" stackId="a" fill="#00E676" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span className="text-[8px] font-mono text-white/40 uppercase">Principal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-[8px] font-mono text-white/40 uppercase">Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-12 rounded-[40px] border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-mono text-brand-primary font-bold uppercase mb-4 tracking-widest">Monthly Home EMI</p>
            <h4 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none">{formatCurrency(stats.emi)}</h4>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-brand-primary">{formatCurrency(stats.totalInterest)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPayment)}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Home size={160} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-brand-primary">
              <ShieldCheck size={18} />
              <h4 className="font-bold text-sm tracking-tight">Tax Benefits (Sec 24b)</h4>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              You can claim a deduction of up to <span className="text-white font-bold">₹2 Lakhs</span> per year on the interest paid towards a self-occupied home loan.
            </p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-brand-secondary">
              <Landmark size={18} />
              <h4 className="font-bold text-sm tracking-tight">Tax Benefits (Sec 80C)</h4>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              The principal repayment is eligible for a deduction of up to <span className="text-white font-bold">₹1.5 Lakhs</span> per year under Section 80C.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
