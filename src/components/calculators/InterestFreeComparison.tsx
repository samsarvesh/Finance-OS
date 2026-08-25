import React, { useState, useMemo } from 'react';
import { AlertCircle, Scale } from 'lucide-react';

export default function InterestFreeComparison() {
  const [productPrice, setProductPrice] = useState(100000);
  const [discountForCash, setDiscountForCash] = useState(10); // 10% discount if paid upfront
  const [emiTenure, setEmiTenure] = useState(12);
  const [processingFee, setProcessingFee] = useState(1999);

  const stats = useMemo(() => {
    // Hidden cost calculation
    const upfrontCost = productPrice * (1 - discountForCash / 100);
    const emiMonthly = (productPrice + processingFee) / emiTenure;
    const totalEmiCost = productPrice + processingFee;
    
    // Implicit Interest Rate calculation (simplified IRR)
    const hiddenInterest = totalEmiCost - upfrontCost;
    const monthlyRate = hiddenInterest / upfrontCost / emiTenure;
    const effectiveAnnualRate = monthlyRate * 12 * 100;

    return {
      upfrontCost,
      totalEmiCost,
      hiddenInterest,
      effectiveAnnualRate: effectiveAnnualRate.toFixed(2),
      emiMonthly
    };
  }, [productPrice, discountForCash, emiTenure, processingFee]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4 p-6 glass rounded-3xl border-brand-secondary/20 bg-brand-secondary/5">
        <Scale className="text-brand-secondary" size={32} />
        <div>
           <h3 className="text-xl font-bold">"Zero Interest" Reality Check</h3>
           <p className="text-xs text-white/40 uppercase font-mono tracking-widest mt-1">Exposing the hidden costs of No-Cost EMI</p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[40px] border-white/5 space-y-8">
          <div className="space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest">Product Price</span>
                <div className="relative group/input">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-secondary text-[10px] font-mono">₹</span>
                  <input 
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Math.max(0, Number(e.target.value)))}
                    className="w-40 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-right text-brand-secondary font-mono text-sm focus:border-brand-secondary outline-none transition-all font-bold"
                  />
                </div>
             </div>
             <input type="range" min="1000" max="1000000" step="1000" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} className="w-full h-1.5 accent-brand-secondary bg-white/5 rounded-full appearance-none cursor-pointer" />
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest leading-tight">Upfront Discount</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={discountForCash}
                    onChange={(e) => setDiscountForCash(Math.max(0, Number(e.target.value)))}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-2 pr-6 text-right text-brand-secondary font-mono text-sm focus:border-brand-secondary outline-none transition-all font-bold"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-secondary text-[10px] font-mono">%</span>
                </div>
             </div>
             <input type="range" min="0" max="50" step="1" value={discountForCash} onChange={(e) => setDiscountForCash(Number(e.target.value))} className="w-full h-1.5 accent-brand-secondary bg-white/5 rounded-full appearance-none cursor-pointer" />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                  <input 
                    type="number"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Math.min(120, Math.max(1, Number(e.target.value))))}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-brand-secondary outline-none transition-all font-bold"
                  />
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-white/40 uppercase tracking-widest">Fees</span>
                  <input 
                    type="number"
                    value={processingFee}
                    onChange={(e) => setProcessingFee(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-brand-secondary outline-none transition-all font-bold"
                  />
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[40px] bg-red-500/5 border-red-500/20 text-center relative overflow-hidden">
              <p className="text-[10px] font-mono text-red-500 font-bold uppercase mb-2">Effective annual interest</p>
              <h4 className="text-6xl font-black text-white leading-none">{stats.effectiveAnnualRate}%</h4>
              <p className="text-white/40 text-[10px] mt-4 italic font-mono uppercase tracking-widest">Reality vs Marketing</p>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle size={80} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-3xl border-white/5">
                <p className="text-[10px] font-mono text-white/40 uppercase mb-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> Cash Purchase</p>
                <p className="text-lg font-bold">{formatCurrency(stats.upfrontCost)}</p>
              </div>
              <div className="glass p-6 rounded-3xl border-white/5">
                <p className="text-[10px] font-mono text-white/40 uppercase mb-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> No-Cost EMI</p>
                <p className="text-lg font-bold">{formatCurrency(stats.totalEmiCost)}</p>
              </div>
           </div>

           <div className="p-6 glass rounded-3xl border-red-500/10 bg-red-500/5">
              <p className="text-xs leading-relaxed text-white/40">
                <span className="font-bold text-red-400">Verdict:</span> By choosing EMI, you loss the cash discount and pay fees, effectively costing <span className="text-white font-bold">{formatCurrency(stats.hiddenInterest)}</span> more.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
