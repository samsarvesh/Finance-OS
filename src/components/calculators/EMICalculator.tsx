import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Percent, Calendar, HelpCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(10);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const r = rate / (12 * 100); // monthly interest rate
    const n = tenure * 12; // number of months
    const emiCalc = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    setEmi(Math.round(emiCalc));
    setTotalPayment(Math.round(emiCalc * n));
    setTotalInterest(Math.round(emiCalc * n - loanAmount));
  }, [loanAmount, rate, tenure]);

  const chartData = [
    {
      name: 'EMI Breakdown',
      Principal: loanAmount,
      Interest: totalInterest
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

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
                <CreditCard size={14} className="text-brand-primary" /> Loan Amount
              </label>
              <div className="relative group/input">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary text-xs font-mono">₹</span>
                <input 
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                  className="w-56 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-7 pr-3 text-right text-brand-primary font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
              </div>
            </div>
            <input 
              type="range" min="100000" max="10000000" step="50000" 
              value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Percent size={14} className="text-brand-secondary" /> Interest Rate (p.a)
              </label>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-7 text-right text-brand-secondary font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary text-xs font-mono">%</span>
              </div>
            </div>
            <input 
              type="range" min="5" max="24" step="0.1" 
              value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="slider secondary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-brand-accent" /> Tenure (Years)
              </label>
              <div className="relative group/input">
                <input 
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-10 text-right text-brand-accent font-mono text-lg focus:border-brand-primary outline-none transition-all group-hover/input:border-white/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-accent text-[10px] font-mono uppercase">Yrs</span>
              </div>
            </div>
            <input 
              type="range" min="1" max="100" step="1" 
              value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
              className="slider accent"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <p className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Payment Breakdown</p>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#141416', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Bar dataKey="Principal" stackId="a" fill="rgba(255,255,255,0.1)" radius={[6, 0, 0, 6]} />
                <Bar dataKey="Interest" stackId="a" fill="#D4FF3F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-[10px] font-mono text-white/40 uppercase">Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-secondary" />
              <span className="text-[10px] font-mono text-white/40 uppercase">Interest</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="glass p-8 rounded-[40px] border-brand-secondary/20 bg-brand-secondary/5 flex flex-col justify-center min-h-[300px] text-center">
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">Monthly EMI</p>
          <h3 className="text-6xl font-bold text-white mb-4">₹{emi.toLocaleString()}</h3>
          <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Total Interest</p>
              <p className="text-xl font-bold text-brand-secondary">₹{totalInterest.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-mono mb-1">Total Payment</p>
              <p className="text-xl font-bold">₹{totalPayment.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-3xl border-white/5 flex items-start gap-4">
          <HelpCircle size={20} className="text-brand-primary flex-shrink-0 mt-1" />
          <p className="text-xs text-white/60 leading-relaxed italic">
            This calculation assumes standard compounding. Actual EMI may vary slightly based on the bank's processing fees and specific terms.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
