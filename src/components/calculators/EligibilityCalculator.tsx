import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Landmark, TrendingDown, AlertCircle } from 'lucide-react';

export default function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(20);
  const [eligibleLoan, setEligibleLoan] = useState(0);
  const [monthlyEmi, setMonthlyEmi] = useState(0);

  useEffect(() => {
    // Standard rule: Banks allow ~50% of take-home as total EMI
    const maxAllowedEmi = (monthlyIncome * 0.5) - existingEmi;
    const r = rate / (12 * 100);
    const n = tenure * 12;

    if (maxAllowedEmi <= 0) {
      setEligibleLoan(0);
      setMonthlyEmi(0);
      return;
    }

    // Loan Amount = (EMI * ( (1+r)^n - 1) ) / ( r * (1+r)^n )
    const loanAmount = (maxAllowedEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    
    setEligibleLoan(Math.round(loanAmount));
    setMonthlyEmi(Math.max(0, Math.round(maxAllowedEmi)));
  }, [monthlyIncome, existingEmi, rate, tenure]);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-[40px] border-white/5 space-y-10"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Wallet size={14} className="text-brand-primary" /> Monthly Income
              </span>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-[10px] font-mono">₹</span>
                <input 
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                />
              </div>
            </div>
            <input 
              type="range" min="10000" max="500000" step="1000" 
              value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <TrendingDown size={14} className="text-red-400" /> Existing EMIs
              </span>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-red-400 text-[10px] font-mono">₹</span>
                <input 
                  type="number"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Math.max(0, Number(e.target.value)))}
                  className="w-40 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-red-400 font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                />
              </div>
            </div>
            <input 
              type="range" min="0" max="250000" step="1000" 
              value={existingEmi} onChange={(e) => setExistingEmi(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest">Rate (p.a)</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-brand-primary font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <input 
                type="range" min="5" max="18" step="0.1" 
                value={rate} onChange={(e) => setRate(Number(e.target.value))}
                className="slider accent"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-white/40 uppercase tracking-widest">Tenure</span>
                <div className="relative group/input">
                  <input 
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-white font-mono text-sm focus:border-brand-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <input 
                type="range" min="1" max="100" 
                value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                className="slider accent"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="glass p-8 rounded-[40px] border-brand-accent/20 bg-brand-accent/5 flex flex-col justify-center min-h-[300px] text-center">
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2 text-brand-accent">Eligible Loan Amount</p>
          <h3 className="text-6xl font-bold text-white mb-4">₹{eligibleLoan.toLocaleString()}</h3>
          <p className="text-white/40 text-[10px] uppercase font-mono mt-4">Estimated Max Monthly EMI Serviceability</p>
          <p className="text-2xl font-bold text-brand-accent">₹{monthlyEmi.toLocaleString()}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-white/5 flex items-start gap-4 bg-orange-500/5">
          <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-1" />
          <div>
            <h5 className="text-[10px] uppercase font-bold text-orange-400 mb-1">Bank Discretion</h5>
            <p className="text-[11px] text-white/60 leading-relaxed">
              This is an estimate based on FOIR (Fixed Obligation to Income Ratio) of 50%. Actual eligibility depends on Credit Score (CIBIL), employer category, and age.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
