export const DEFAULT_CAR_MODELS = [
  { id: "toyota-fortuner", name: "Fortuner", suffix: "SUV", variant: "2.8L 4x4 Diesel" },
  { id: "toyota-innova", name: "Innova Crysta", suffix: "MPV", variant: "2.4L VX 7-Str" },
  { id: "toyota-hilux", name: "Hilux", suffix: "Pickup", variant: "2.8L High MT" },
  { id: "toyota-camry", name: "Camry", suffix: "Sedan", variant: "2.5L Hybrid" },
  { id: "toyota-glanza", name: "Glanza", suffix: "Hatchback", variant: "1.2L G MT" }
];

export const DEFAULT_SLAB_CONFIG = [
  { id: "slab-1", min: 1, max: 3, payout: 1000 },
  { id: "slab-2", min: 4, max: 7, payout: 2000 },
  { id: "slab-3", min: 8, max: null, payout: 3500 }
];

export const DEFAULT_SLAB_HISTORY = [
  {
    id: "hist-1",
    timestamp: "2026-05-15T10:30:00Z",
    action: "Configured Initial Slabs",
    details: "Slab 1 (1-3: ₹1,000), Slab 2 (4-7: ₹2,000), Slab 3 (8+: ₹3,500)"
  },
  {
    id: "hist-2",
    timestamp: "2026-05-20T14:45:00Z",
    action: "Updated Glanza Base Suffix",
    details: "Suffix set from Hatch to Hatchback"
  }
];

export const DEFAULT_MONTHLY_TRENDS = [
  { month: "March 2026", totalUnits: 12, totalPayout: 32000 },
  { month: "April 2026", totalUnits: 15, totalPayout: 41500 },
  { month: "May 2026", totalUnits: 18, totalPayout: 54000 }
];
