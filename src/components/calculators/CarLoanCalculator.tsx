import React, { useState, useMemo } from 'react';
import { Car, Info } from 'lucide-react';

export default function CarLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(800000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);

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
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
               <Car className="text-blue-500" />
             </div>
             <div>
               <h3 className="text-xl font-bold font-mono">CAR LOAN</h3>
               <p className="text-[10px] text-white/40 tracking-widest leading-none">Vehicle Financing</p>
             </div>
           </div>

           <div className="space-y-8">
             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Loan Amount</span>
                 <div className="relative group/input">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 text-[10px] font-mono">₹</span>
                    <input 
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                      className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-blue-500 font-mono text-sm focus:border-blue-500 outline-none transition-all font-bold"
                    />
                  </div>
               </div>
               <input type="range" min="100000" max="10000000" step="50000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-1.5 accent-blue-500 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Interest Rate</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-6 text-right text-blue-500 font-mono text-sm focus:border-blue-500 outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 text-[10px] font-mono">%</span>
                  </div>
               </div>
               <input type="range" min="7" max="18" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1.5 accent-blue-500 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                 <div className="relative group/input">
                    <input 
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 pl-2 pr-10 text-right text-white font-mono text-sm focus:border-blue-500 outline-none transition-all font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[10px] font-mono uppercase">Yrs</span>
                  </div>
               </div>
               <input type="range" min="1" max="100" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-1.5 accent-blue-500 bg-white/5 rounded-full appearance-none cursor-pointer" />
             </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 text-center relative overflow-hidden">
          <p className="text-[10px] font-mono text-blue-400 font-bold uppercase mb-2">Monthly EMI</p>
          <h4 className="text-6xl font-black text-white mb-2 leading-none">{formatCurrency(stats.emi)}</h4>
          <div className="mt-8 flex justify-center gap-12">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Interest</p>
              <p className="font-bold text-blue-500">{formatCurrency(stats.totalInterest)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-mono mb-1">Total Due</p>
              <p className="font-bold">{formatCurrency(stats.totalPayment)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 flex gap-4 items-start">
            <Info className="text-blue-400 flex-shrink-0" size={20} />
            <p className="text-xs text-white/40 leading-relaxed italic">
              Unlike Home Loans, Car Loans are for depreciating assets. Try to keep the tenure short (3-5 years) to avoid paying more interest than the car's value loss.
            </p>
        </div>
      </div>
    </div>
  );
}
