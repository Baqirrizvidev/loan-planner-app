import LoanCalculator from "@/components/LoanCalculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center py-20 px-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">EMI</span> Planner
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Visualize how small prepayments can save you lakhs in interest.
        </p>
      </div>
      
      <LoanCalculator />
    </main>
  );
}