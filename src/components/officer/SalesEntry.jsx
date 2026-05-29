import React from "react";
import { calculateIncentive } from "../../utils/incentiveCalculator";

export default function SalesEntry({
  carModels,
  slabs,
  salesData,
  setSalesData,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}) {
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const years = ["2025", "2026", "2027"];

  const handleUnitChange = (modelId, val) => {
    const parsed = val === "" ? 0 : Math.max(0, parseInt(val, 10));
    setSalesData(prev => ({
      ...prev,
      [modelId]: parsed
    }));
  };


  const renderSlabBadge = (units) => {
    if (units <= 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          No Sales
        </span>
      );
    }

    const { slab, payoutPerUnit } = calculateIncentive(units, slabs);

    if (!slab) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
          Outside Slabs (₹0)
        </span>
      );
    }


    let badgeColor = "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50";
    if (slab.id.includes("1") || slab.payout <= 1500) {
      badgeColor = "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/50";
    } else if (slab.id.includes("2") || slab.payout <= 2500) {
      badgeColor = "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50";
    } else {
      badgeColor = "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50";
    }

    const maxText = slab.max === null ? "+" : `-${slab.max}`;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
        Slab {slab.min}{maxText} • ₹{payoutPerUnit.toLocaleString("en-IN")}/car
      </span>
    );
  };

  return (
    <div className="space-y-6">

      <div className="bg-white dark:bg-toyota-charcoal p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-gray-950 dark:text-white">Active Period</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Select reporting period to log model unit sales</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 sm:w-40">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-toyota-red text-sm font-semibold"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 sm:w-28">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-toyota-red text-sm font-semibold"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>


      <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Sales Entry Grid</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update unit quantities sold to calculate live incentives</p>
          </div>
          <div className="text-right text-xs font-semibold text-gray-400 dark:text-gray-500">
            Period: {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
          </div>
        </div>

        <div className="overflow-x-auto">
          {carModels.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-bold text-gray-950 dark:text-white">No Models Configured</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ask your Admin to configure car models in the inventory database.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-100/50 dark:bg-gray-800/80 text-xs text-gray-700 dark:text-gray-300 uppercase font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3">Vehicle Model</th>
                  <th scope="col" className="px-6 py-3">Variant Specification</th>
                  <th scope="col" className="px-6 py-3 w-32 print:text-center">Units Sold</th>
                  <th scope="col" className="px-6 py-3">Active Compensation Slab</th>
                  <th scope="col" className="px-6 py-3 text-right">Per Car ₹</th>
                  <th scope="col" className="px-6 py-3 text-right">Subtotal ₹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {carModels.map((model) => {
                  const units = salesData[model.id] || 0;
                  const { payoutPerUnit, total } = calculateIncentive(units, slabs);
                  return (
                    <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/35 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {model.name}
                        <span className="block md:hidden text-[10px] text-gray-400 mt-0.5">{model.suffix}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="hidden md:inline bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded mr-1.5 font-sans font-bold">
                          {model.suffix}
                        </span>
                        {model.variant}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={units || ""}
                          onChange={(e) => handleUnitChange(model.id, e.target.value)}
                          className="w-20 text-center px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-toyota-red text-sm font-semibold print:border-none print:bg-transparent print:ring-0"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderSlabBadge(units)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        ₹{payoutPerUnit.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-950 dark:text-white">
                        ₹{total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
