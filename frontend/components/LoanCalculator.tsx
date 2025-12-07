"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { IndianRupee, Percent, Calendar, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface LoanResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

// 1. NEW CUSTOM TOOLTIP COMPONENT (Fixes the "strange caption")
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-2xl border border-violet-100">
        <p className="text-violet-900 font-bold text-xs uppercase tracking-wider mb-1">
          {payload[0].name}
        </p>
        <p className="text-violet-600 text-xl font-bold font-mono">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function LoanCalculator() {
  const [inputs, setInputs] = useState({
    principal: 5000000,
    rateOfInterest: 8.5,
    tenureMonths: 240,
    prepaymentAmount: 0,
  });
  const [result, setResult] = useState<LoanResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(calculateLoan, 500);
    return () => clearTimeout(timer);
  }, [inputs]);

  const calculateLoan = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/loan/calculate", inputs);
      setResult(res.data);
    } catch (error) {
      console.error("Backend offline");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const numVal = value === "" ? 0 : parseFloat(value);
    setInputs((prev) => ({ ...prev, [field]: numVal }));
  };

  const formatCurrency = (val: number) => 
    val.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mb-12 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-thin tracking-tight text-white mb-2">
          Loan <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300">Architect</span>
        </h1>
        <p className="text-violet-200 text-lg font-light tracking-wide opacity-80">
          Design your debt-free future.
        </p>
      </motion.div>

      {/* INPUTS ROW */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {/* Loan Amount */}
        <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transition-all duration-300 hover:border-cyan-400/50">
           <div className="flex items-center gap-2 mb-2 text-cyan-300">
             <IndianRupee size={18} />
             <label className="text-xs font-bold uppercase tracking-widest">Loan Amount</label>
           </div>
           <input
             type="number"
             value={inputs.principal || ""}
             onChange={(e) => handleInputChange("principal", e.target.value)}
             className="w-full bg-transparent text-3xl font-light text-white placeholder-violet-300 focus:outline-none"
             placeholder="0"
           />
           <div className="h-1 w-full bg-violet-900/50 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-400 w-1/2 group-focus-within:w-full transition-all duration-500"></div>
           </div>
        </div>

        {/* Interest Rate */}
        <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transition-all duration-300 hover:border-fuchsia-400/50">
           <div className="flex items-center gap-2 mb-2 text-fuchsia-300">
             <Percent size={18} />
             <label className="text-xs font-bold uppercase tracking-widest">Interest Rate</label>
           </div>
           <input
             type="number"
             value={inputs.rateOfInterest || ""}
             onChange={(e) => handleInputChange("rateOfInterest", e.target.value)}
             className="w-full bg-transparent text-3xl font-light text-white placeholder-violet-300 focus:outline-none"
             placeholder="8.5"
           />
           <div className="h-1 w-full bg-violet-900/50 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-fuchsia-400 w-1/3 group-focus-within:w-full transition-all duration-500"></div>
           </div>
        </div>

        {/* Tenure */}
        <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl transition-all duration-300 hover:border-violet-400/50">
           <div className="flex items-center gap-2 mb-2 text-violet-300">
             <Calendar size={18} />
             <label className="text-xs font-bold uppercase tracking-widest">Tenure (Months)</label>
           </div>
           <input
             type="number"
             value={inputs.tenureMonths || ""}
             onChange={(e) => handleInputChange("tenureMonths", e.target.value)}
             className="w-full bg-transparent text-3xl font-light text-white placeholder-violet-300 focus:outline-none"
             placeholder="240"
           />
           <div className="h-1 w-full bg-violet-900/50 mt-4 rounded-full overflow-hidden">
             <div className="h-full bg-violet-400 w-2/3 group-focus-within:w-full transition-all duration-500"></div>
           </div>
        </div>

        {/* Prepayment */}
        <div className="group bg-gradient-to-br from-fuchsia-900/20 to-violet-900/40 border border-fuchsia-500/30 p-6 rounded-3xl transition-all duration-300">
           <div className="flex items-center gap-2 mb-2 text-fuchsia-200">
             <TrendingDown size={18} />
             <label className="text-xs font-bold uppercase tracking-widest">Monthly Prepay</label>
           </div>
           <input
             type="number"
             value={inputs.prepaymentAmount || ""}
             onChange={(e) => handleInputChange("prepaymentAmount", e.target.value)}
             className="w-full bg-transparent text-3xl font-light text-fuchsia-100 placeholder-fuchsia-800 focus:outline-none"
             placeholder="0"
           />
           <p className="text-xs text-fuchsia-300/60 mt-4">Extra monthly payment</p>
        </div>
      </motion.div>

      {/* RESULTS SECTION */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* BIG EMI CARD */}
          <div className="lg:col-span-2 bg-[#1e1b4b]/80 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-center shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]"></div>
             
             <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-4">Your Monthly Payment</p>
             <h2 className="text-7xl md:text-8xl font-thin text-white tracking-tighter">
               {formatCurrency(result.emi).split('.')[0]}
               <span className="text-2xl text-violet-400 ml-2 font-normal">/mo</span>
             </h2>

             <div className="mt-10 flex gap-12 border-t border-white/5 pt-8">
                <div>
                   <p className="text-xs text-violet-400 uppercase tracking-widest mb-1">Total Interest</p>
                   <p className="text-3xl text-fuchsia-400 font-light">{formatCurrency(result.totalInterest)}</p>
                </div>
                <div>
                   <p className="text-xs text-violet-400 uppercase tracking-widest mb-1">Total Payable</p>
                   <p className="text-3xl text-cyan-400 font-light">{formatCurrency(result.totalAmount)}</p>
                </div>
             </div>
          </div>

          {/* CHART CARD */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex items-center justify-center relative shadow-lg">
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie
                   data={[
                     { name: "Principal", value: inputs.principal },
                     { name: "Interest", value: result.totalInterest },
                   ]}
                   innerRadius={80}
                   outerRadius={100}
                   paddingAngle={8}
                   dataKey="value"
                   stroke="none"
                 >
                   <Cell fill="#22d3ee" /> {/* Cyan */}
                   <Cell fill="#e879f9" /> {/* Fuchsia */}
                 </Pie>
                 {/* 2. USING CUSTOM TOOLTIP HERE */}
                 <Tooltip content={<CustomTooltip />} />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Label */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <p className="text-xs text-violet-300 uppercase tracking-wider">Breakdown</p>
                </div>
             </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}