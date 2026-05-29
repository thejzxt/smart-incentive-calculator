import React, { useState, useEffect } from "react";

export default function SlabEngine({ slabs, setSlabs, triggerToast, onHistoryLog }) {

  const [localSlabs, setLocalSlabs] = useState([]);
  const [validationError, setValidationError] = useState("");


  useEffect(() => {
    if (slabs) {

      setLocalSlabs(JSON.parse(JSON.stringify(slabs)));
    }
  }, [slabs]);


  useEffect(() => {
    setValidationError(validateSlabs(localSlabs));
  }, [localSlabs]);


  const validateSlabs = (slabsList) => {
    if (!slabsList || slabsList.length === 0) {
      return "At least one slab configuration is required.";
    }


    const sorted = [...slabsList].sort((a, b) => a.min - b.min);

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const slabNum = i + 1;

      if (typeof current.payout !== "number" || isNaN(current.payout) || current.payout <= 0) {
        return `Slab #${slabNum}: ₹ Per Car must be a positive number.`;
      }


      if (typeof current.min !== "number" || isNaN(current.min) || current.min < 0) {
        return `Slab #${slabNum}: Min Units must be 0 or greater.`;
      }


      const isUnlimited = current.max === null || current.max === undefined;
      if (!isUnlimited) {
        if (typeof current.max !== "number" || isNaN(current.max)) {
          return `Slab #${slabNum}: Max Units must be a valid number or toggled to Unlimited (∞).`;
        }
        if (current.min > current.max) {
          return `Slab #${slabNum}: Min Units (${current.min}) cannot be greater than Max Units (${current.max}).`;
        }
      }


      if (i > 0) {
        const prev = sorted[i - 1];
        const isPrevUnlimited = prev.max === null || prev.max === undefined;

        if (isPrevUnlimited) {
          return `Slab #${slabNum}: Cannot have slabs after an Unlimited slab. Only the last slab can be Unlimited (∞).`;
        }

        if (current.min <= prev.max) {
          return `Slab #${slabNum} overlaps with Slab #${i}. Min Units (${current.min}) must be greater than previous Max Units (${prev.max}).`;
        }


        if (current.min !== prev.max + 1) {

          return `Slab #${slabNum}: There is a gap. Min Units (${current.min}) must be exactly ${prev.max + 1} (previous Max + 1).`;
        }
      }
    }

    return "";
  };

  const handleFieldChange = (id, field, value) => {
    setLocalSlabs(prevSlabs => {
      return prevSlabs.map(slab => {
        if (slab.id === id) {
          let updatedValue = value;
          if (field === "min" || field === "max" || field === "payout") {
            updatedValue = value === "" ? "" : Number(value);
          }
          return { ...slab, [field]: updatedValue };
        }
        return slab;
      });
    });
  };

  const handleToggleUnlimited = (id) => {
    setLocalSlabs(prevSlabs => {
      return prevSlabs.map((slab, i) => {
        if (slab.id === id) {
          const currentlyUnlimited = slab.max === null;
          return {
            ...slab,
            max: currentlyUnlimited ? (slab.min + 2) : null
          };
        }
        return slab;
      });
    });
  };

  const handleAddRow = () => {

    let nextMin = 1;
    if (localSlabs.length > 0) {

      const sorted = [...localSlabs].sort((a, b) => a.min - b.min);
      const last = sorted[sorted.length - 1];
      if (last.max !== null) {
        nextMin = last.max + 1;
      } else {

        triggerToast("Please turn off 'Unlimited' on the last slab first to add a new tier.", "error");
        return;
      }
    }

    const newSlab = {
      id: `slab-${Date.now()}`,
      min: nextMin,
      max: null,
      payout: 1000
    };


    const updatedSlabs = localSlabs.map(s => {
      if (s.max === null) {
        return { ...s, max: s.min + 2 };
      }
      return s;
    });

    setLocalSlabs([...updatedSlabs, newSlab]);
  };

  const handleSave = () => {
    if (validationError) {
      triggerToast("Cannot save slab configuration. Please resolve all errors.", "error");
      return;
    }


    const sorted = [...localSlabs].sort((a, b) => a.min - b.min);


    const oldDesc = slabs.map(s => `[${s.min}-${s.max || "+"} = ₹${s.payout}]`).join(", ");
    const newDesc = sorted.map(s => `[${s.min}-${s.max || "+"} = ₹${s.payout}]`).join(", ");

    onHistoryLog(
      "Updated Slab Configurations",
      `Changed from: ${oldDesc} to: ${newDesc}`
    );

    setSlabs(sorted);
    triggerToast("Slab configuration saved!", "success");
  };

  return (
    <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dynamic Slab Engine</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage incentive slabs and payouts per units sold</p>
        </div>
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:border-toyota-red text-gray-700 dark:text-gray-300 font-bold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4.5 h-4.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add Slab Tier
        </button>
      </div>

      <div className="p-6">

        {validationError && (
          <div className="mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 uppercase font-bold">
              <tr>
                <th scope="col" className="px-4 py-3">Slab #</th>
                <th scope="col" className="px-4 py-3">Min Units</th>
                <th scope="col" className="px-4 py-3">Max Units</th>
                <th scope="col" className="px-4 py-3">₹ Per Car</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {localSlabs.map((slab, index) => {
                const isUnlimited = slab.max === null;
                return (
                  <tr key={slab.id} className="hover:bg-gray-50/20 dark:hover:bg-gray-800/10 transition-colors">
                    <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">
                      Slab {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min="0"
                        value={slab.min}
                        onChange={(e) => handleFieldChange(slab.id, "min", e.target.value)}
                        className="w-20 px-2 py-1.5 border border-gray-700 bg-[#121212] text-white rounded-lg focus:ring-1 focus:ring-toyota-red focus:outline-none text-sm font-semibold text-center"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type={isUnlimited ? "text" : "number"}
                          disabled={isUnlimited}
                          value={isUnlimited ? "∞" : (slab.max || "")}
                          onChange={(e) => handleFieldChange(slab.id, "max", e.target.value)}
                          className="w-20 px-2 py-1.5 border border-gray-700 bg-[#121212] text-white disabled:bg-[#1a1a1a] disabled:text-gray-400 rounded-lg focus:ring-1 focus:ring-toyota-red focus:outline-none text-sm font-semibold text-center transition-all"
                        />
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isUnlimited}
                            onChange={() => handleToggleUnlimited(slab.id)}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] checked:bg-[#EB0A1E] checked:border-transparent accent-toyota-red cursor-pointer"
                          />
                          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
                            UNLIMITED
                          </span>
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-gray-400 text-xs font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={slab.payout}
                          onChange={(e) => handleFieldChange(slab.id, "payout", e.target.value)}
                          className="w-28 pl-6 pr-2 py-1.5 border border-gray-700 bg-[#121212] text-white rounded-lg focus:ring-1 focus:ring-toyota-red focus:outline-none text-sm font-semibold"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => {
              setLocalSlabs(JSON.parse(JSON.stringify(slabs)));
            }}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!!validationError}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

