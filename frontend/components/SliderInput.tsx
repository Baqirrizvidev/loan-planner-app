import { motion } from "framer-motion";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (val: number) => void;
}

export default function SliderInput({ label, value, min, max, step=1, suffix="", onChange }: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="group bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-violet-500/50 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</label>
        
        {/* TYPING INPUT */}
        <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400/50 transition-all">
          <input 
            type="number" 
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-transparent text-right text-white font-mono font-bold w-28 focus:outline-none"
          />
          <span className="text-slate-500 text-xs ml-2 font-bold">{suffix}</span>
        </div>
      </div>
      
      {/* SLIDER TRACK */}
      <div className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer">
        <motion.div 
          className="absolute h-full bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full" 
          style={{ width: `${percentage}%` }} 
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div 
            className="absolute h-5 w-5 bg-white border-2 border-cyan-400 rounded-full -top-1.5 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-0 pointer-events-none"
            style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
}