import React, { useState, useEffect } from "react";
import { calculateIncentive } from "../../utils/incentiveCalculator";
import { DEFAULT_MONTHLY_TRENDS } from "../../constants/defaultData";


function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 400;
    const startValue = displayValue;
    const endValue = value;

    if (startValue === endValue) return;

    let animId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (endValue - startValue) + startValue);

      setDisplayValue(current);

      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value]);

  return <span>{displayValue.toLocaleString("en-IN")}</span>;
}

export default function IncentiveTracker({ totalUnits, grandTotal, slabs, selectedMonthName, selectedYear }) {


  const { slab: overallSlab } = calculateIncentive(totalUnits, slabs);

  const handlePrint = () => {
    window.print();
  };


  const currentMonthLabel = `${selectedMonthName.substring(0, 3)} ${selectedYear}`;
  const trendData = [
    ...DEFAULT_MONTHLY_TRENDS,
    { month: currentMonthLabel, totalUnits: totalUnits, totalPayout: grandTotal }
  ];


  const maxPayout = Math.max(...trendData.map(d => d.totalPayout), 10000);
  const chartHeight = 110;
  const barWidth = 36;
  const gap = 32;

  return (
    <div className="lg:sticky lg:top-24 w-full lg:w-96 flex-shrink-0 space-y-6">


      <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none">


        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 print:bg-transparent print:border-b-2 print:border-gray-300">
          <h2 className="text-base font-bold text-gray-950 dark:text-white">Compensation Summary</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 print:hidden">Real-time calculations for this period</p>
        </div>


        <div className="p-6 space-y-6">

          <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
            <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Grand Total Payout
            </span>
            <div className="text-4xl sm:text-5xl font-black text-toyota-red dark:text-white mt-2 select-all font-sans flex items-center justify-center gap-1">
              <span>₹</span>
              <AnimatedNumber value={grandTotal} />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block mt-1.5">
              Calculated dynamically via active slab configurations
            </span>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-toyota-dark/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 print:bg-transparent">
              <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Total Units Sold
              </span>
              <span className="text-xl font-black text-gray-950 dark:text-white mt-1 block">
                {totalUnits} <span className="text-xs font-normal text-gray-500">cars</span>
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-toyota-dark/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 print:bg-transparent">
              <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Overall Slab Tier
              </span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mt-2.5 block truncate uppercase tracking-wide">
                {overallSlab ? (
                  `Slab ${overallSlab.min}${overallSlab.max === null ? "+" : `-${overallSlab.max}`}`
                ) : (
                  "No Tier Achieved"
                )}
              </span>
            </div>
          </div>


          <button
            onClick={handlePrint}
            className="w-full py-3 bg-toyota-dark dark:bg-toyota-red text-white hover:bg-gray-800 dark:hover:bg-toyota-redHover font-bold rounded-lg shadow-sm hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 print:hidden text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Export PDF Report
          </button>
        </div>
      </div>


      <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6 print:hidden">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-950 dark:text-white">Monthly Incentive Trend</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">Visualizing payouts over the last 4 periods</p>
        </div>


        <div className="flex justify-center pt-2">
          <svg width="100%" viewBox="0 0 320 180" className="overflow-visible">

            <line x1="10" y1="120" x2="310" y2="120" stroke="#E5E7EB" className="dark:stroke-gray-800" strokeWidth="1" />
            <line x1="10" y1="70" x2="310" y2="70" stroke="#F3F4F6" className="dark:stroke-gray-800/40" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="10" y1="20" x2="310" y2="20" stroke="#F3F4F6" className="dark:stroke-gray-800/40" strokeWidth="1" strokeDasharray="3 3" />


            {trendData.map((data, idx) => {
              const x = 20 + idx * (barWidth + gap);

              const height = maxPayout > 0 ? (data.totalPayout / maxPayout) * 100 : 0;
              const y = 120 - height;
              const isCurrent = idx === trendData.length - 1;

              return (
                <g key={idx} className="group transition-all duration-300">

                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-[9px] font-black text-gray-900 dark:text-gray-200 fill-current"
                  >
                    ₹{data.totalPayout >= 1000 ? `${(data.totalPayout / 1000).toFixed(1)}k` : data.totalPayout}
                  </text>


                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(height, 2)}
                    rx="4"
                    className={`transition-all duration-300 ${isCurrent
                        ? "fill-toyota-red drop-shadow-[0_2px_4px_rgba(235,10,30,0.2)]"
                        : "fill-indigo-600/70 hover:fill-indigo-600 dark:fill-gray-700/80 dark:hover:fill-gray-700"
                      }`}
                  />


                  {height > 18 && (
                    <text
                      x={x + barWidth / 2}
                      y={y + 14}
                      textAnchor="middle"
                      className="text-[9px] font-black fill-white"
                    >
                      {data.totalUnits}
                    </text>
                  )}


                  <text
                    x={x + barWidth / 2}
                    y={136}
                    textAnchor="middle"
                    className={`text-[9px] font-bold fill-current ${isCurrent
                        ? "text-toyota-red font-black"
                        : "text-gray-400 dark:text-gray-500"
                      }`}
                  >
                    {data.month.split(" ")[0]}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={148}
                    textAnchor="middle"
                    className="text-[8px] font-semibold text-gray-400 dark:text-gray-600 fill-current"
                  >
                    {data.month.split(" ")[1]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

    </div>
  );
}
