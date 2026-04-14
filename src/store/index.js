/*
  ═══════════════════════════════════════════════════════
  GLOBAL STATE (Zustand)
  
  This replaces ALL the scattered global variables from 
  the original code (currentUser, sel, db, etc.)
  ═══════════════════════════════════════════════════════
*/

import { create } from 'zustand';

// ── Auth Store ──
export const useAuthStore = create((set, get) => ({
  user: null,
  sessionToken: null,

  login: (user, token) => set({ user, sessionToken: token }),
  logout: () => set({ user: null, sessionToken: null }),
  isAdmin: () => get().user?.role === 'admin',
}));

// ── Sales Flow Store (the 5-step wizard) ──
export const useSalesStore = create((set, get) => ({
  step: 0,
  phone: '',
  dncClear: false,
  state: null,
  utilities: [],   // max 1 electric + 1 gas
  supplier: null,
  rate: null,
  checkedItems: new Set(),
  templateValues: {},

  setStep: (step) => set({ step }),
  setPhone: (phone) => set({ phone }),
  setDncClear: (v) => set({ dncClear: v }),
  setState: (state) => set({ state, utilities: [], supplier: null, rate: null }),
  
  toggleUtility: (util) => {
    const current = get().utilities;
    const exists = current.find(u => u.id === util.id);
    if (exists) {
      set({ utilities: current.filter(u => u.id !== util.id) });
    } else {
      // Max 1 per type
      const filtered = current.filter(u => u.type !== util.type);
      set({ utilities: [...filtered, util] });
    }
  },

  setSupplier: (supplier, rate) => set({ supplier, rate }),
  
  toggleCheckItem: (id) => {
    const items = new Set(get().checkedItems);
    items.has(id) ? items.delete(id) : items.add(id);
    set({ checkedItems: items });
  },

  setTemplateValue: (key, value) => {
    set({ templateValues: { ...get().templateValues, [key]: value } });
  },

  canGoToStep: (n) => {
    const s = get();
    if (n <= s.step) return true;
    if (n >= 1 && !s.dncClear) return false;
    if (n >= 2 && !s.state) return false;
    if (n >= 3 && !s.utilities.length) return false;
    if (n >= 4 && !s.supplier) return false;
    return true;
  },

  reset: () => set({
    step: 0, phone: '', dncClear: false,
    state: null, utilities: [], supplier: null, rate: null,
    checkedItems: new Set(), templateValues: {},
  }),
}));

// ── Data Store (states, utilities, suppliers, rates from admin) ──
export const useDataStore = create((set) => ({
  states: [],
  utilities: [],
  suppliers: [],
  rates: [],
  users: [],
  checklist: [],
  sales: [],
  loaded: false,

  setStates: (states) => set({ states }),
  setUtilities: (utilities) => set({ utilities }),
  setSuppliers: (suppliers) => set({ suppliers }),
  setRates: (rates) => set({ rates }),
  setUsers: (users) => set({ users }),
  setChecklist: (checklist) => set({ checklist }),
  setSales: (sales) => set({ sales }),
  setLoaded: (loaded) => set({ loaded }),
}));

// ── UI Store (toasts, view, etc.) ──
export const useUIStore = create((set) => ({
  view: 'sales',       // 'sales' | 'crm'
  toast: null,          // { message, type }
  sidebarOpen: false,

  setView: (view) => set({ view }),
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
