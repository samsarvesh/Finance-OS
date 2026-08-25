import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ShieldCheck, Info } from 'lucide-react';

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [tax, setTax] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(0);

  useEffect(() => {
    // Simplified Indian Income Tax Calculation (Old Regime - estimated)
    let taxableIncome = Math.max(0, income - deductions - 50000); // Standard deduction 50k
    let taxCalc = 0;

    if (taxableIncome > 1000000) {
      taxCalc += (taxableIncome - 1000000) * 0.3;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      taxCalc += (taxableIncome - 500000) * 0.2;
      taxableIncome = 500000;
    }
    if (taxableIncome > 250000) {
      taxCalc += (taxableIncome - 250000) * 0.05;
    }

    // Add 4% Cess
    taxCalc *= 1.04;

    // Rebate under 87A if taxable income <= 5L
    if (taxableIncome + 50000 <= 500000) {
      taxCalc = 0;
    }

    setTax(Math.round(taxCalc));
    setEffectiveRate(income > 0 ? Number(((taxCalc / income) * 100).toFixed(1)) : 0);
  }, [income, deductions]);

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
                <Landmark size={14} className="text-brand-primary" /> Annual Gross Income
              </label>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">₹</span>
                <input 
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                  className="w-56 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-brand-primary font-mono text-lg focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            <input 
              type="range" min="300000" max="5000000" step="25000" 
              value={income} onChange={(e) => setIncome(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-secondary" /> 80C & Other Deductions
              </label>
              <div className="relative group/input">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-secondary text-xs font-mono">₹</span>
                <input 
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))}
                  className="w-48 bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-right text-brand-secondary font-mono text-lg focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            <input 
              type="range" min="0" max="500000" step="5000" 
              value={deductions} onChange={(e) => setDeductions(Number(e.target.value))}
              className="slider secondary"
            />
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="glass p-8 rounded-[40px] border-red-500/20 bg-red-500/5 flex flex-col justify-center min-h-[300px] text-center">
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Estimated Annual Tax</p>
          <h3 className="text-6xl font-bold text-white mb-4">₹{tax.toLocaleString()}</h3>
          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Effective Rate</p>
              <p className="text-xl font-bold">{effectiveRate}%</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Monthly Tax</p>
              <p className="text-xl font-bold">₹{Math.round(tax / 12).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-3xl border-white/5 flex items-start gap-4">
          <Info size={20} className="text-brand-primary flex-shrink-0 mt-1" />
          <p className="text-[11px] text-white/60 leading-relaxed italic">
            This is a simplified estimation based on the Old Tax Regime. Actual tax liability depends on various exemptions like HRA, LTA, and professional tax which are not included here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
