import React, { useState } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestore";
import { DEFAULT_CAR_MODELS, DEFAULT_SLAB_CONFIG, DEFAULT_SLAB_HISTORY } from "../../constants/defaultData";
import CarModelTable from "./CarModelTable";
import SlabEngine from "./SlabEngine";
import Toast from "../shared/Toast";

export default function AdminDashboard() {
  const [carModels, setCarModels, loadingModels] = useFirestoreCollection("carModels", DEFAULT_CAR_MODELS);
  const [slabs, setSlabs, loadingSlabs] = useFirestoreCollection("slabConfig", DEFAULT_SLAB_CONFIG);
  const [history, setHistory, loadingHistory] = useFirestoreCollection("slabHistory", DEFAULT_SLAB_HISTORY);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleHistoryLog = (action, details) => {
    const newEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details
    };
    setHistory(prevHistory => [newEntry, ...prevHistory]);
  };

  const totalModels = carModels ? carModels.length : 0;
  const activeSlabs = slabs ? slabs.length : 0;
  const maxPayout = slabs && slabs.length > 0 ? Math.max(...slabs.map(s => s.payout)) : 0;

  const isLoading = loadingModels || loadingSlabs || loadingHistory;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-toyota-dark text-gray-900 dark:text-gray-100 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-toyota-red border-t-transparent" />
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse">
          Loading Admin Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-toyota-dark text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">


        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">Admin Management Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Configure vehicle inventories, dynamic compensation tiers, and monitor historical audit logs.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white dark:bg-toyota-charcoal rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:shadow-lg transition-shadow duration-200">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-toyota-red rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Toyota Models
              </span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-1 block">
                {totalModels}
              </span>
            </div>
          </div>


          <div className="bg-white dark:bg-toyota-charcoal rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:shadow-lg transition-shadow duration-200">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Active Slab Tiers
              </span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-1 block">
                {activeSlabs}
              </span>
            </div>
          </div>


          <div className="bg-white dark:bg-toyota-charcoal rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:shadow-lg transition-shadow duration-200">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14a2 2 0 110-4h1.414M12 14v1M12 14v-2" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Highest Slab Rate
              </span>
              <span className="text-3xl font-black text-gray-900 dark:text-white mt-1 block">
                ₹{maxPayout.toLocaleString("en-IN")}<span className="text-xs font-semibold text-gray-400 dark:text-gray-500">/car</span>
              </span>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <CarModelTable
              carModels={carModels}
              setCarModels={setCarModels}
              triggerToast={triggerToast}
            />
          </div>
          <div>
            <SlabEngine
              slabs={slabs}
              setSlabs={setSlabs}
              triggerToast={triggerToast}
              onHistoryLog={handleHistoryLog}
            />
          </div>
        </div>


        <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-950 dark:text-white">Audit Log & Configuration History</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tracks all slab modifications and updates</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Clear all audit history?")) {
                  setHistory([]);
                  triggerToast("History log cleared.", "success");
                }
              }}
              className="text-xs font-semibold text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors"
            >
              Clear Log
            </button>
          </div>
          <div className="p-6">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
                No activity history found.
              </p>
            ) : (
              <div className="flow-root max-h-60 overflow-y-auto pr-2">
                <ul className="-mb-8">
                  {history.map((item, itemIdx) => (
                    <li key={item.id}>
                      <div className="relative pb-8">
                        {itemIdx !== history.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3 items-start">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-950/20 text-toyota-red flex items-center justify-center ring-8 ring-white dark:ring-toyota-charcoal">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white">
                                {item.action}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono break-all">
                                {item.details}
                              </p>
                            </div>
                            <div className="text-right text-[10px] whitespace-nowrap text-gray-400 dark:text-gray-500 font-semibold">
                              {new Date(item.timestamp).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>


      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
