"use client";
import { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowRight, Loader2, IndianRupee } from "lucide-react";

export default function LoanCalculator() {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    principal: 5000000,
    rateOfInterest: 8.5,
    tenureMonths: 240,
    prepaymentAmount: 0,
  });
  const [result, setResult] = useState<any>(null);

  const calculateLoan = async () => {
    setLoading(true);
    try {
      // Connects to your running Java Backend
      const res = await axios.post("http://localhost:8080/api/loan/calculate", inputs);
      setResult(res.data);
    } catch (error) {
      console.error("API Error - Is backend running?", error);
      alert("Could not connect to backend. Is the Java app running on port 8080?");
    }
    setLoading(false);
  };

  const COLORS = ["#2dd4bf", "#f97316"]; // Teal (Principal), Orange (Interest)

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT SIDE: Inputs */}
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-teal-400 mb-6">Loan Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Loan Amount (₹)</label>
              <input
                type="number"
                value={inputs.principal}
                onChange={(e) => setInputs({ ...inputs, principal: Number(e.target.value) })}
                className="mt-2 w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Interest Rate (%)</label>
                <input
                  type="number"
                  value={inputs.rateOfInterest}
                  onChange={(e) => setInputs({ ...inputs, rateOfInterest: Number(e.target.value) })}
                  className="mt-2 w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl focus:border-teal-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tenure (Months)</label>
                <input
                  type="number"
                  value={inputs.tenureMonths}
                  onChange={(e) => setInputs({ ...inputs, tenureMonths: Number(e.target.value) })}
                  className="mt-2 w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-xl focus:border-teal-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700">
              <label className="text-teal-400 text-xs uppercase tracking-wider font-bold">Monthly Prepayment (₹)</label>
              <div className="relative">
                <input
                    type="number"
                    value={inputs.prepaymentAmount}
                    onChange={(e) => setInputs({ ...inputs, prepaymentAmount: Number(e.target.value) })}
                    className="mt-2 w-full bg-slate-900 border border-teal-500/50 rounded-xl p-4 text-xl focus:border-teal-400 focus:outline-none shadow-[0_0_15px_rgba(45,212,191,0.1)] transition-colors"
                />
                <span className="absolute right-4 top-6 text-slate-500 text-sm">extra / month</span>
              </div>
            </div>

            <button
              onClick={calculateLoan}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-extrabold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Calculate Savings"} <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Results */}
        <div className="flex flex-col justify-center space-y-6 pt-4">
          {!result ? (
            <div className="text-center text-slate-500 bg-slate-800/30 p-10 rounded-3xl border border-slate-800 border-dashed">
              <p>Enter your loan details and hit Calculate to see the magic.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Main EMI Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border-l-4 border-teal-500 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Monthly EMI</p>
                    <p className="text-5xl font-bold text-white mt-2 flex items-center gap-1">
                        <IndianRupee size={32} className="text-slate-500"/>
                        {result.emi.toLocaleString('en-IN')}
                    </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-xs uppercase font-bold">Total Interest</p>
                    <p className="text-2xl font-bold text-orange-400 mt-1">₹{result.totalInterest.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-xs uppercase font-bold">Total Payable</p>
                    <p className="text-2xl font-bold text-teal-400 mt-1">₹{result.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-64 w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Principal", value: inputs.principal },
                        { name: "Interest", value: result.totalInterest },
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 text-xs mt-[-20px]">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#2dd4bf]"></div> Principal</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f97316]"></div> Interest</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}