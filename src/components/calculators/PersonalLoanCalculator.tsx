import React, { useState, useMemo } from 'react';
import { User, ShieldAlert } from 'lucide-react';

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [rate, setRate] = useState(14);
  const [tenure, setTenure] = useState(3);

  const stats = useMemo(() => {
    const r = rate / (12 * 100);
    const n = tenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
               <User className="text-orange-500" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono tracking-tighter">PERSONAL LOAN</h3>
               <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none">Unsecured Credit</p>
             </div>
           </div>

           <div className="space-y-8">
             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Loan Amount</span>
                 <div className="relative group/input">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-500 text-[10px] font-mono">₹</span>
                    <input 
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-orange-500 font-mono text-sm focus:border-orange-500 outline-none transition-all font-bold"
                    />
                  </div>
               </div>
               <input type="range" min="10000" max="2500000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-orange-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Interest Rate</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-right text-orange-500 font-mono text-sm focus:border-orange-500 outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 text-[10px] font-mono">%</span>
                  </div>
               </div>
               <input type="range" min="8" max="25" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-orange-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-10 text-right text-white font-mono text-sm focus:border-orange-500 outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[10px] font-mono uppercase">Yrs</span>
                  </div>
               </div>
               <input type="range" min="1" max="100" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-orange-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-10 rounded-[40px] border-orange-500/20 bg-orange-500/5 text-center">
              <p className="text-[10px] font-mono text-orange-400 font-bold uppercase mb-2">Monthly EMI</p>
              <h4 className="text-5xl font-black text-white mb-4">{formatCurrency(stats.emi)}</h4>
              <div className="flex justify-between text-left border-t border-white/5 pt-6">
                 <div>
                   <p className="text-[10px] text-white/40 uppercase font-mono">Interest Cost</p>
                   <p className="text-lg font-bold text-orange-500">{formatCurrency(stats.totalInterest)}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] text-white/40 uppercase font-mono">Final Maturity</p>
                   <p className="text-lg font-bold">{formatCurrency(stats.totalPayment)}</p>
                 </div>
              </div>
           </div>

           <div className="p-6 glass rounded-2xl border-orange-500/10 bg-orange-500/5 flex gap-4">
              <ShieldAlert className="text-orange-500 flex-shrink-0" size={20} />
              <p className="text-xs text-white/60 leading-relaxed italic">
                Personal loans are "Unsecured", meaning lenders take higher risk and thus charge higher interest. Check for hidden processing fees before signing.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
