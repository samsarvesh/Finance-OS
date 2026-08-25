export interface Course {
  title: string;
  level: string;
  duration: string;
  color: string;
  description: string;
}

export const COURSES: Course[] = [
  { title: 'Personal Finance', level: 'Beginner', duration: '5h+', color: 'bg-green-500/10 text-green-500', description: 'Budgeting, emergency funds, and individual wealth building.' },
  { title: 'Stock Market', level: 'Beginner to Advanced', duration: '10h+', color: 'bg-blue-500/10 text-blue-500', description: 'Technical & Fundamental analysis, Equity research, and Trading.' },
  { title: 'Banking', level: 'Intermediate', duration: '6h+', color: 'bg-yellow-500/10 text-yellow-500', description: 'Commercial banking, Central banks, and the Credit system.' },
  { title: 'Derivatives', level: 'Advanced', duration: '12h+', color: 'bg-purple-500/10 text-purple-500', description: 'Options, Futures, Swaps, and sophisticated hedging techniques.' },
  { title: 'Crypto & Web3', level: 'Intermediate', duration: '8h+', color: 'bg-orange-500/10 text-orange-500', description: 'Blockchain fundamentals, DeFi, and Digital Asset security.' },
  { title: 'Economics', level: 'Intermediate', duration: '7h+', color: 'bg-pink-500/10 text-pink-500', description: 'Macro/Micro dynamics, Monetary policy, and Global markets.' },
  { title: 'Tax & GST', level: 'Intermediate', duration: '5h+', color: 'bg-red-500/10 text-red-500', description: 'Individual taxation, GST compliance, and Tax planning.' },
  { title: 'Insurance', level: 'Beginner', duration: '4h+', color: 'bg-indigo-500/10 text-indigo-500', description: 'Life, Health, and General insurance principles and claims.' },
  { title: 'Corporate Finance', level: 'Advanced', duration: '15h+', color: 'bg-emerald-500/10 text-emerald-500', description: 'Capital budgeting, WACC, and Mergers & Acquisitions.' },
  { title: 'Mutual Funds', level: 'Beginner', duration: '6h+', color: 'bg-cyan-500/10 text-cyan-500', description: 'NAV, Expense ratios, SIPs, and Portfolio diversification.' },
  { title: 'Financial Rules', level: 'All Levels', duration: '8h+', color: 'bg-indigo-500/10 text-indigo-500', description: 'Comprehensive guide to the 30+ golden rules of personal wealth.' },
];

export const LESSON_PLANS: Record<string, string[]> = {
  'Personal Finance': [
    'Art of Budgeting (50/30/20 Rule)',
    'Building an Emergency Fund (3-6 Month Rule)',
    'Pay Yourself First: The Savings Priority',
    'Debt Management: Snowball vs Avalanche',
    'Psychology of Spending: 24-Hour & 30-Day Rules',
    'Cost Per Use: Value Assessment',
    'Understanding Credit Scores (30% Utilization)',
    'Saving vs Investing',
    'Compound Interest Magic (Rule of 72, 114, 144)',
    'Retirement Planning (4% Rule & Rule of 25)',
    'Insurance: 10x Life Coverage Rule',
    'Financial Goal Setting'
  ],
  'Stock Market': [
    'Market Mechanics & Participants',
    'IPO vs Secondary Market',
    'Trading Risk: The 2% Rule',
    'Asset Allocation: 100 Minus Age Rule',
    'Portfolio Concentration: The 5% Rule',
    'Fundamental Ratios (PE, PB, ROE)',
    'Technical Analysis: Candlesticks',
    'Modern Portfolio Theory',
    'Value vs Growth Investing',
    'Expected Returns: 10, 5, 3 Rule',
    'Risk Management in Trading',
    'Algorithmic Trading Intro'
  ],
  'Banking': ['History of Banking', 'CASA & Term Deposits', 'Asset Liability Management', 'NPA Management', 'Role of RBI/Central Banks', 'Monetary Policy Tools', 'Retail vs Corporate Banking', 'Investment Banking Intro', 'SWIFT & Payment Gateways', 'Basel III Norms', 'Digital Banking & Fintech', 'Anti-Money Laundering (AML)'],
  'Derivatives': ['Introduction to Forwards', 'Futures Contracts Mechanics', 'Option Basics: Calls & Puts', 'The Greeks (Delta, Gamma, Vega)', 'Bull & Bear Spreads', 'Iron Condor Strategy', 'Straddle & Strangle', 'Binomial Option Pricing', 'Black-Scholes Model', 'Currency & Interest Rate Swaps', 'Hedging Corporate Risk', 'Credit Default Swaps (CDS)'],
  'Crypto & Web3': ['Bitcoin & Peer-to-Peer Cash', 'Ethereum & Smart Contracts', 'Proof of Work vs Stake', 'DeFi Protocols & Liquidity', 'Yield Farming & Staking', 'Stablecoins & CBDCs', 'NFT Mechanics & Utility', 'DAO Governance', 'Wallet Security (Cold vs Hot)', 'L1 vs L2 Solutions', 'Crypto Regulation', 'Future of Web3 Finance'],
  'Economics': ['Law of Demand & Supply', 'Rule of 70 (Inflation & Halving Power)', 'GDP & Economic Indicators', 'Inflation vs Deflation', 'Fiscal Policy Essentials', 'Comparative Advantage', 'Externalities & Public Goods', 'Behavioral Economics', 'Trade Balance & Forex', 'Business Cycles', 'Game Theory in Markets', 'Development Economics'],
  'Tax & GST': ['Direct vs Indirect Taxes', 'Income Tax Slabs (Old vs New)', 'Standard Deductions & Exemptions', 'Taxation on Capital Gains', 'GST: CGST, SGST, IGST', 'Input Tax Credit (ITC)', 'GST Composition Scheme', 'E-Way Bill System', 'Corporate Tax Basics', 'Tax Audits & Compliance', 'Double Taxation Avoidance', 'Digital Tax Systems'],
  'Insurance': ['Principle of Utmost Good Faith', 'Types of Life Insurance', 'Health Insurance & Riders', 'General Insurance (Auto, Home)', 'Reinsurance Concepts', 'Underwriting Process', 'Claims Settlement Ratio', 'Solvency Margins', 'Annuity & Pension Plans', 'Group Insurance Policies', 'IRDAI Regulations', 'Social Security Schemes'],
  'Corporate Finance': ['Time Value of Money', 'Capital Budgeting Tools (NPV, IRR)', 'Weighted Average Cost of Capital', 'Capital Structure Theories', 'Dividend Decision Models', 'Working Capital Management', 'Valuation: DCF Analysis', 'Relative Valuation (Multiples)', 'M&A: Buyouts & Synergies', 'Corporate Governance', 'Financial Distress & Bankruptcy', 'Global Treasury Management'],
  'Mutual Funds': [
    'Wealth Creation: 15-15-15 Rule',
    'SIP Step-up: Annual Increase Rule',
    'Types: Equity, Debt, Hybrid',
    'Understanding NAV & Expense Ratio',
    'Direct vs Regular Plans',
    'ELSS for Tax Saving',
    'Index Funds & ETFs',
    'SIP/SWP/STP Mechanics',
    'The 1% Rule (Real Estate Investing)',
    'Reading a Factsheet',
    'Exit Loads & Taxation',
    'Selecting the Right Fund'
  ],
  'Financial Rules': [
    'The Growth Trilogy: Rule of 72, 114 & 144',
    'Budgeting Mastery: 50/30/20 & 40% EMI Rules',
    'Building Liquidity: 3-6 Month Emergency Fund',
    'The Priority: Pay Yourself First Rule',
    'Borrowing Limits: 28% Mortgage & 50% Car Price Rules',
    'Financing: 20/4/10 Car Rule & Education Loan Salary Rule',
    'Retirement: 4% Withdrawal, Rule of 25 & 80% Income Replacement',
    'Investment Guardrails: 100 Minus Age & 5% Wealth Rules',
    'Trading Discipline: The 2% Risk & 1% Real Estate Rules',
    'Wealth Building: 15-15-15 & SIP Step-up Rules',
    'Debt Warfare: Snowball vs Avalanche Methods',
    'Credit Strategy: 30% Utilization Rule',
    'Psychological Gates: 24-Hour, 30-Day & Cost Per Use Rules',
    'The 10-5-3 Rule of Expected Returns',
    'Tax & Inflation: 1% Wealth Tax & Rule of 70',
    'Coverage: 10x Life Insurance Rule'
  ]
};
