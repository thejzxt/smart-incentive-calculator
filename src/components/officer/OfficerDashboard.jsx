import React, { useState, useEffect } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestore";
import { DEFAULT_CAR_MODELS, DEFAULT_SLAB_CONFIG } from "../../constants/defaultData";
import { calculateIncentive } from "../../utils/incentiveCalculator";
import SalesEntry from "./SalesEntry";
import IncentiveTracker from "./IncentiveTracker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function OfficerDashboard() {
  // Load models and slabs from admin configurations
  const [carModels, , loadingModels] = useFirestoreCollection("carModels", DEFAULT_CAR_MODELS);
  const [slabs, , loadingSlabs] = useFirestoreCollection("slabConfig", DEFAULT_SLAB_CONFIG);

  // Initialize selected Month/Year based on current date
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, "0"); // e.g. "05" for May
  });
  
  const [selectedYear, setSelectedYear] = useState(() => {
    return String(new Date().getFullYear()); // e.g. "2026"
  });

  // Sales data state for the active month/year key (toyota_sales_YYYY_MM)
  const storageKey = `toyota_sales_${selectedYear}_${selectedMonth}`;
  const [salesData, setSalesData] = useState({});
  const [loadingSales, setLoadingSales] = useState(true);

  // Load sales data when month/year changes
  useEffect(() => {
    if (loadingModels) return;
    
    let active = true;
    const loadSales = async () => {
      setLoadingSales(true);
      try {
        const docRef = doc(db, "salesData", storageKey);
        const docSnap = await getDoc(docRef);
        if (!active) return;
        
        if (docSnap.exists()) {
          setSalesData(docSnap.data());
        } else {
          // Fallback: initialize empty counts for all models
          const defaultSales = {};
          carModels.forEach((m) => {
            defaultSales[m.id] = 0;
          });
          setSalesData(defaultSales);
        }
      } catch (error) {
        console.warn(`Error loading sales data for ${storageKey}:`, error);
        if (active) setSalesData({});
      } finally {
        if (active) {
          // Small simulated delay for premium loading experience feel
          setTimeout(() => {
            if (active) setLoadingSales(false);
          }, 250);
        }
      }
    };

    loadSales();
    return () => {
      active = false;
    };
  }, [storageKey, carModels, loadingModels]);

  // Persist sales data changes automatically
  useEffect(() => {
    if (!loadingModels && !loadingSales && Object.keys(salesData).length > 0) {
      const saveSales = async () => {
        try {
          const docRef = doc(db, "salesData", storageKey);
          await setDoc(docRef, salesData);
        } catch (error) {
          console.warn(`Error writing sales data for ${storageKey}:`, error);
        }
      };
      saveSales();
    }
  }, [salesData, storageKey, loadingSales, loadingModels]);

  const isLoading = loadingModels || loadingSlabs || loadingSales;

  // Calculate totals
  const totalUnits = carModels.reduce((sum, model) => {
    return sum + (salesData[model.id] || 0);
  }, 0);

  const grandTotal = carModels.reduce((sum, model) => {
    const units = salesData[model.id] || 0;
    const { total } = calculateIncentive(units, slabs);
    return sum + total;
  }, 0);

  // Get current month name
  const monthNames = {
    "01": "January", "02": "February", "03": "March", "04": "April",
    "05": "May", "06": "June", "07": "July", "08": "August",
    "09": "September", "10": "October", "11": "November", "12": "December"
  };
  const selectedMonthName = monthNames[selectedMonth] || "Current Month";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-toyota-dark text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Print-Only Header */}
        <div className="hidden print:block text-center border-b-2 border-toyota-dark pb-6 mb-8">
          <h1 className="text-3xl font-black tracking-widest text-toyota-dark">TOYOTA MOTOR CORPORATION</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest mt-1">Sales Officer Incentive Summary Report</h2>
          <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mt-4 px-4">
            <div>Officer Name: Sales Officer</div>
            <div>Reporting Period: {selectedMonthName} {selectedYear}</div>
            <div>Generated On: {new Date().toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        {/* Warning Banner if slabs configured is empty */}
        {slabs.length === 0 && (
          <div className="mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300 text-sm print:hidden">
            <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-bold">Attention:</span> No incentive slabs configured. Incentive calculations will evaluate to ₹0. Please ask your Admin to configure slab rates.
            </div>
          </div>
        )}

        {/* Header (Hidden when printing) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">Officer Incentive Portal</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Log vehicle sales units and monitor earnings with dynamic tiering.
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col justify-center items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-toyota-red border-t-transparent" />
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Fetching Sales Records...
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Sales Entry (Wider) */}
            <div className="flex-1 w-full space-y-6">
              {carModels.length === 0 ? (
                <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-12 text-center">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 text-toyota-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white">No Models Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                    No models found. Ask your Admin to configure car models.
                  </p>
                </div>
              ) : (
                <SalesEntry
                  carModels={carModels}
                  slabs={slabs}
                  salesData={salesData}
                  setSalesData={setSalesData}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              )}
            </div>

            {/* Right Column / Sticky Bottom: Tracker */}
            <IncentiveTracker
              totalUnits={totalUnits}
              grandTotal={grandTotal}
              slabs={slabs}
              selectedMonthName={selectedMonthName}
              selectedYear={selectedYear}
            />
          </div>
        )}

        {/* Print-Only Footer */}
        <div className="hidden print:block mt-12 border-t-2 border-gray-300 pt-6 px-4">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
            <div>Signature: __________________________</div>
            <div>Approved by Admin: __________________________</div>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-8">
            This is an automatically generated system statement from the Toyota Smart Incentive portal.
          </p>
        </div>

      </div>
    </div>
  );
}
