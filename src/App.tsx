/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  MapPin,
  Users,
  ReceiptText,
  Scale,
  ChevronLeft,
  Download,
  Trash2,
  Calendar,
  Camera,
  Search,
  Undo2,
  Redo2,
  Navigation as NavIcon,
  BarChart3,
  Moon,
  Sun,
  PieChart as PieIcon,
  TrendingUp,
  History,
  ArrowRightLeft,
  Upload,
  LayoutGrid,
  ChevronDown, 
  X, 
  Trash,
  List,
  Settings,
  MessageCircle,
  Info,
} from "lucide-react";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import { useFirebaseAuth } from './useFirebaseAuth';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, query, where, deleteField } from 'firebase/firestore';

const stripUndefined = (obj: any) => {
  if (Array.isArray(obj)) {
    obj.forEach(stripUndefined);
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) {
        delete obj[key];
      } else {
        stripUndefined(obj[key]);
      }
    });
  }
  return obj;
};

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  type Tour,
  type Member,
  type Expense,
  type MemberBalance,
  type Transaction,
  type AppSettings,
} from "./types";

export function getCurrencySymbol(currency: string = "USD") {
  switch (currency) {
    case "BDT": return "৳";
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    default: return currency;
  }
}

export function getPhonePrefix(region: string) {
  switch (region) {
    case "BD": return "+880";
    case "US": return "+1";
    case "GB": return "+44";
    case "IN": return "+91";
    default: return "+880";
  }
}
import {
  calculateBalances,
  simplifyDebts,
  generateCSV,
  generateMemberDetailsCSV,
  generateExpenseBreakdownCSV,
  generateDetailedBreakdownCSV,
  generateReceiptsCSV,
  generateDebtBreakdownCSV,
  formatCurrency,
  isExpenseValid,
} from "./lib/utils";

// --- Placeholder for Advanced Features ---
const GPS_TRACKING_PERMISSION = "geolocation";
const GALLERY_PERMISSION = "camera";

// --- Hook for Online Status ---
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

// --- Hook for Long Press ---
function useLongPress(callback: () => void, ms = 600) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const start = () => {
    setTimer(setTimeout(callback, ms));
  };

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}

// --- Sub-components to prevent hook conditional rules ---
function MemberCard({
  m,
  highlightId,
  activeTour,
  onEdit,
  onDelete,
  isAdmin,
  isMemberAdmin,
}: {
  key?: React.Key;
  m: Member;
  highlightId?: string | null;
  activeTour: Tour;
  onEdit: (m: Member) => void;
  onDelete: (id: string, e?: React.MouseEvent) => void;
  isAdmin: boolean;
  isMemberAdmin: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const hasExpenses = activeTour.expenses.some(
    (exp) => exp.payers[m.id] !== undefined || exp.beneficiaries[m.id] !== undefined,
  );

  const confirmDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowConfirm(false);
    onDelete(m.id, e);
  };

  const lp = useLongPress(() => confirmDelete(), 700);

  return (
    <>
      <div
        {...lp}
        id={`member-${m.id}`}
        className={`item-card rounded-2xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden ${highlightId === m.id ? "ring-2 ring-purple-500 bg-purple-500/10 scale-105" : ""}`}
      >
        <div className="flex-1 truncate relative z-10" onClick={() => isAdmin && onEdit(m)}>
          <div className="flex items-center gap-1.5">
            <p className="font-black text-xs truncate uppercase tracking-tighter">
              {m.name}
            </p>
            {isMemberAdmin && (
              <span className="ml-2 text-[8px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-600 px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
            {(m.address || m.occupation || m.nid) && (
              <div
                className="w-1 h-1 rounded-full bg-purple-500"
                title="Profile Complete"
              />
            )}
          </div>
          <p className="text-xs font-mono mt-0.5 text-[var(--text-muted)]">
            {m.phoneNumber}
          </p>
        </div>
        <div className="flex items-center gap-1.5 relative z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
          {isAdmin && (<button
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(e);
            }}
            className="p-2 rounded-xl transition-all border bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-red-500 border-transparent hover:border-red-500/20"
          >
            <Trash2 size={14} />
          </button>)}
        </div>
        <div className="absolute inset-0 bg-red-500/0 active:bg-red-500/5 transition-colors pointer-events-none" />
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-black text-[var(--text-main)] mb-1">Delete Member?</h3>
              <p className="text-sm text-[var(--text-muted)] font-bold">Are you sure you want to remove <span className="text-purple-500 uppercase">{m.name}</span> from this trip?</p>
            </div>
            
            {hasExpenses && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                <p className="text-red-500 text-xs font-bold leading-tight uppercase tracking-widest">
                  Warning: This member is part of existing transactions. Deleting them will invalidate those transactions.
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] transition-all"
                onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
                onClick={handleConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TourCard({
  tour,
  highlightId,
  onClick,
  onDelete,
  isAdmin,
}: {
  key?: React.Key;
  tour: Tour;
  highlightId: string | null;
  onClick: () => void;
  onDelete: (e?: React.MouseEvent) => void;
  isAdmin: boolean;
}) {
  const isHighlighted = highlightId === tour.id;

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const triggerDelete = (e?: React.MouseEvent) => {
    if (isConfirmingDelete) {
      onDelete(e);
    } else {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  const longPress = useLongPress(() => triggerDelete(), 700);

  return (
    <div
      onClick={isConfirmingDelete ? undefined : onClick}
      {...longPress}
      className={`item-card p-6 rounded-[32px] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group flex justify-between items-center relative overflow-hidden ${isHighlighted ? "ring-4 ring-purple-500 ring-offset-4 dark:ring-offset-slate-950 scale-105" : ""} ${isConfirmingDelete ? "bg-red-500/10 border-red-500" : ""}`}
      id={`tour-card-${tour.id}`}
    >
      <div className="relative z-10">
        <h3
          className={`text-xl font-black transition-colors uppercase tracking-tight ${isConfirmingDelete ? "text-red-500" : "group-hover:text-purple-500"}`}
        >
          {isConfirmingDelete ? (isAdmin ? "Confirm Delete?" : "Confirm Leave?") : tour.name}
        </h3>
        <div
          className={`flex gap-4 mt-1 text-xs font-bold ${isConfirmingDelete ? "text-red-400" : "text-[var(--text-muted)]"}`}
        >
          <span className="flex items-center gap-1">
            <Users size={12} /> {tour.members.length} members
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {tour.date || "TBD"}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          triggerDelete(e);
        }}
        className={`p-3 transition-colors opacity-100 z-10 rounded-full ${isConfirmingDelete ? "bg-red-500 text-white" : "text-[var(--text-muted)] hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"}`}
        id={`delete-tour-${tour.id}`}
      >
        {isAdmin ? <Trash2 size={18} /> : <span className="text-[10px] uppercase font-black tracking-widest bg-red-500/10 text-red-500 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-colors">Leave</span>}
      </button>
      <div className="absolute inset-0 bg-red-500/0 active:bg-red-500/10 transition-colors pointer-events-none" />
    </div>
  );
}


function WhatsAppGroupModal({
  activeTour,
  onUpdate,
  onClose
}: {
  activeTour: Tour;
  onUpdate: (t: Tour, ctx?: { tab?: string; highlightId?: string }) => void;
  onClose: () => void;
}) {
  const [link, setLink] = useState(activeTour.whatsappGroupLink || "");

  const handleSaveLink = () => {
    onUpdate({ ...activeTour, whatsappGroupLink: link });
    onClose();
  };

  return (
    <div className="modal-overlay z-[120]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-[40px] w-full max-w-md shadow-2xl relative max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-[#25D366] tracking-tight uppercase flex items-center gap-2">
            <MessageCircle size={24} /> WhatsApp Group
          </h2>
          <button onClick={onClose} className="p-2 bg-[var(--bg-main)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
          <div className="space-y-3">
            <p className="text-xs font-bold text-[var(--text-muted)] leading-relaxed">
              Save your group invite link below. Members can use it to join your WhatsApp trip group.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 w-full min-w-0 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 focus:outline-none focus:border-[#25D366] text-sm transition-colors font-mono"
                placeholder="https://chat.whatsapp.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <button 
                onClick={handleSaveLink}
                className="bg-[#25D366] text-white px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20bd5a] transition-colors shrink-0"
                title="Save and Close"
              >
                Save
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
             <div className="flex justify-between items-center">
               <h3 className="text-xs uppercase font-black tracking-widest text-[#25D366]">Members & Invites</h3>
             </div>
             
             <div className="space-y-2 border border-[var(--border-color)] p-2 rounded-[24px] bg-[var(--bg-main)] max-h-64 overflow-y-auto">
               {activeTour.members.map(m => {
                 const num = (m.whatsappNumber || m.phoneNumber || "").replace(/[^\d+]/g, '');
                 const message = encodeURIComponent(`Hi ${m.name},\n\nJoin our trip group for "${activeTour.name}"!\n\nTrip Join Code (App): ${activeTour.id}\nClick here to join WhatsApp: ${link}`);
                 const waUrl = `https://wa.me/${num}?text=${message}`;

                 return (
                 <label key={m.id} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-[var(--bg-surface)] rounded-xl transition-colors">
                   <div className="flex-1 min-w-0 pr-2">
                     <span className="text-sm font-black text-[var(--text-main)] truncate block">{m.name}</span>
                     {m.phoneNumber && <span className="text-[10px] font-mono text-[var(--text-muted)] truncate block">{m.phoneNumber}</span>}
                   </div>
                   {num ? (
                     <a 
                       href={waUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onClick={(e) => {
                         if(!link) { 
                           e.preventDefault(); 
                           alert("Please save a group link first.");
                         } else {
                           e.stopPropagation();
                         }
                       }}
                       className={`${link ? 'bg-[#25D366] text-white hover:bg-[#20bd5a]' : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'} px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors shrink-0`}
                     >
                       Invite
                     </a>
                   ) : (
                     <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-2 shrink-0">No phone</span>
                   )}
                 </label>
                 );
               })}
               {activeTour.members.length === 0 && (
                 <p className="text-xs text-[var(--text-muted)] font-bold py-4 text-center">No members added yet.</p>
               )}
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export default function App() {
  const { user, displayName, AuthModal } = useFirebaseAuth();
  // --- State ---
    const [joinTourId, setJoinTourId] = useState("");
    const [activeTourId, setActiveTourId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "members" | "expenses" | "balances" | "insights" | "media"
  >("expenses");
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("tourvault_settings");
    if (saved) return JSON.parse(saved);
    return {
      region: "BD",
      theme: "light",
      language: "en",
    };
  });
  
  useEffect(() => {
    localStorage.setItem("tourvault_settings", JSON.stringify(appSettings));
    if (appSettings.theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [appSettings]);

  const theme = appSettings.theme;
  const setTheme = (newTheme: "light" | "dark") => {
    setAppSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [trashTours, setTrashTours] = useState<Tour[]>([]);
  const [trashExpenses, setTrashExpenses] = useState<Expense[]>([]);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tours'), where('adminId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
       const allDbTours = snap.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          expenses: [],
          members: docSnap.data().members || []
       } as Tour));
       const userValidTours = allDbTours.filter(t => !t.deletedAt);
       const userTrashTours = allDbTours.filter(t => t.deletedAt);
       
       setTours(prev => {
          const joinedTours = prev.filter(t => t.adminId !== user.uid);
          const joinedMap = new Map(joinedTours.map(t => [t.id, t]));
          userValidTours.forEach(t => joinedMap.set(t.id, t));
          return Array.from(joinedMap.values());
       });
       setTrashTours(userTrashTours);
    });
    return () => unsub();
  }, [user]);
  const [history, setHistory] = useState<
    {
      tours: Tour[];
      tab?: string;
      tourId?: string | null;
      highlightId?: string;
    }[]
  >([]);
  const [future, setFuture] = useState<
    {
      tours: Tour[];
      tab?: string;
      tourId?: string | null;
      highlightId?: string;
    }[]
  >([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTourId) return;
    const unsubTour = onSnapshot(doc(db, 'tours', activeTourId), (docSnap) => {
        if (docSnap.exists()) {
            const currentData = docSnap.data();
            setTours(prev => prev.map(t => t.id === activeTourId ? { ...t, ...currentData } : t));
        } else {
            setActiveTourId(null);
            setTours(prev => prev.filter(t => t.id !== activeTourId));
        }
    });
    const unsubExpenses = onSnapshot(collection(db, 'tours', activeTourId, 'expenses'), (snap) => {
        const exps = snap.docs.map(d => d.data() as Expense);
        const validExps = exps.filter(e => !e.deletedAt);
        const deletedExps = exps.filter(e => e.deletedAt);
        setTours(prev => prev.map(t => t.id === activeTourId ? { ...t, expenses: validExps } : t));
        setTrashExpenses(deletedExps);
    });
    return () => { unsubTour(); unsubExpenses(); };
  }, [activeTourId]);

  useEffect(() => {
    if (highlightId) {
      const timer = setTimeout(() => {
        const el =
          document.getElementById(`expense-${highlightId}`) ||
          document.getElementById(`tour-card-${highlightId}`) ||
          document.getElementById(`member-${highlightId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300); // Wait for AnimatePresence & layout to finish
      return () => clearTimeout(timer);
    }
  }, [highlightId, activeTab, activeTourId]);

  const pushHistory = (context?: {
    tab?: string;
    tourId?: string | null;
    highlightId?: string;
  }) => {
    setHistory((prev) => [
      ...prev.slice(-19),
      {
        tours: JSON.parse(JSON.stringify(tours)),
        tab: activeTab,
        tourId: activeTourId,
        highlightId: context?.highlightId,
      },
    ]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [
      ...prev,
      {
        tours: JSON.parse(JSON.stringify(tours)),
        tab: activeTab,
        tourId: activeTourId,
        highlightId: previous.highlightId,
      },
    ]);

    setTours(previous.tours);
    if (previous.tourId !== undefined) setActiveTourId(previous.tourId);
    if (previous.tab) setActiveTab(previous.tab as any);
    if (previous.highlightId) {
      setHighlightId(previous.highlightId);
      setTimeout(() => setHighlightId(null), 2500);
    }
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[future.length - 1];
    setFuture((prev) => prev.slice(0, -1));
    setHistory((prev) => [
      ...prev,
      {
        tours: JSON.parse(JSON.stringify(tours)),
        tab: activeTab,
        tourId: activeTourId,
        highlightId: nextState.highlightId,
      },
    ]);

    setTours(nextState.tours);
    if (nextState.tourId !== undefined) setActiveTourId(nextState.tourId);
    if (nextState.tab) setActiveTab(nextState.tab as any);
    if (nextState.highlightId) {
      setHighlightId(nextState.highlightId);
      setTimeout(() => setHighlightId(null), 2500);
    }
  };
  const [showAddTour, setShowAddTour] = useState(false);
  const [showEditTour, setShowEditTour] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState<
    Expense | "new_expense" | "new_payment" | null
  >(null);

  const [commonEvents, setCommonEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem("tourvault_common_events");
    return saved
      ? JSON.parse(saved)
      : [
          "Lunch",
          "Dinner",
          "Breakfast",
          "Hotel",
          "Fuel",
          "Entry Fee",
          "Snacks",
          "Bus Fare",
          "Train Fare",
        ];
  });

  // --- Persistence & Theme ---
  
  
  useEffect(() => {
    localStorage.setItem("tourvault_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "tourvault_common_events",
      JSON.stringify(commonEvents),
    );
  }, [commonEvents]);

  // --- Computed ---
  const activeTour = tours.find(t => t.id === activeTourId);
  const isAdmin = activeTour ? activeTour.adminId === user?.uid : false;
  const balances = activeTour
    ? calculateBalances(activeTour.members, activeTour.expenses)
    : [];
  const settlements: Transaction[] = activeTour ? simplifyDebts(balances) : [];

  // --- Handlers ---
  const handleEditTourSave = (name: string, date: string, country: string, town: string, currency: string) => {
    if (activeTour) {
      updateActiveTour({ ...activeTour, name, date, country, town, currency });
      setShowEditTour(false);
    }
  };

  const handleAddTour = async (name: string, date: string, country: string, town: string, currency: string) => {
    if (!user) {
      alert("Authentication required. Please refresh and ensure you're signed in.");
      return;
    }
    
    let id = Array.from({length: 6}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*36)]).join('');
    let isUnique = false;
    while (!isUnique) {
      const docRef = doc(db, 'tours', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        id = Array.from({length: 6}, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random()*36)]).join('');
      } else {
        isUnique = true;
      }
    }

    const newTour: Tour = {
        id,
        name,
        date,
        country,
        town,
        currency,
        members: [{ id: user.uid, name: displayName || 'Admin', phoneNumber: '', address: '', occupation: '', nid: '', bkashNumber: '', whatsappNumber: '' }],
        expenses: [],
        adminId: user.uid
    };

    stripUndefined(newTour);

    try {
      await setDoc(doc(db, 'tours', id), newTour);
      setActiveTourId(id);
      setShowAddTour(false);
    } catch (error: any) {
      console.error("Error creating tour:", error);
      alert("Failed to create tour. See console for details.");
    }
  };

  const handleDeleteTour = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const tourToDelete = tours.find(t => t.id === id);
    if (!tourToDelete) return;

    if (tourToDelete.adminId === user?.uid) {
        await updateDoc(doc(db, 'tours', id), { deletedAt: Date.now() });
    } else {
        setTours(prev => prev.filter(t => t.id !== id));
    }
    if (activeTourId === id) setActiveTourId(null);
  };

  const handleRestoreTour = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'tours', id), { deletedAt: null });
  };

  const handlePermanentDeleteTour = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'tours', id));
  };

  const handleRestoreExpense = async (id: string) => {
    if (!user || !activeTourId) return;
    await updateDoc(doc(db, 'tours', activeTourId, 'expenses', id), { deletedAt: null });
  };

  const handlePermanentDeleteExpense = async (id: string) => {
    if (!user || !activeTourId) return;
    await deleteDoc(doc(db, 'tours', activeTourId, 'expenses', id));
  };

  const updateActiveTour = async (
    updated: Tour,
    context?: { tab?: string; highlightId?: string },
  ) => {
    if (!activeTourId || activeTourId !== updated.id) return;
    if (updated.adminId === user?.uid) {
       const tourDocRef = doc(db, 'tours', updated.id);
       const { expenses, ...tourData } = updated;
       
       stripUndefined(tourData);

       await updateDoc(tourDocRef, tourData);
       if (context?.tab) setActiveTab(context.tab as any);
       if (context?.highlightId) setHighlightId(context.highlightId);
    }
  };

  const handleExportCSV = () => {
    if (!activeTour) return;
    setShowExportModal(true);
  };

  const handleAddMember = (
    name: string,
    phone: string,
    address?: string,
    occupation?: string,
    nid?: string,
    bkashNumber?: string,
    whatsappNumber?: string,
  ) => {
    if (!activeTour) return;
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      phoneNumber: phone,
      address,
      occupation,
      nid,
      bkashNumber,
      whatsappNumber,
    };
    updateActiveTour(
      {
        ...activeTour,
        members: [...activeTour.members, newMember],
      },
      { tab: "members", highlightId: newMember.id },
    );
  };

  const handleSaveExpense = async (expense: Expense) => {
    if (!activeTour) return;
    const id = expense.id || doc(collection(db, 'tours', activeTour.id, 'expenses')).id;
    const newExp = {
         ...expense,
         id,
         creatorId: expense.creatorId || user?.uid,
         creatorName: expense.creatorName || displayName
    };

    stripUndefined(newExp);

    await setDoc(doc(db, 'tours', activeTour.id, 'expenses', id), newExp);
    setActiveTab("expenses");
    setHighlightId(newExp.id);
    setShowExpenseForm(null);
  };

  const handleDeleteExpense = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!activeTour) return;
    await updateDoc(doc(db, 'tours', activeTour.id, 'expenses', id), { deletedAt: Date.now() });
    setActiveTab("expenses");
  };

  const handleQuickSettle = (s: Transaction) => {
    if (!activeTour) return;
    const fromMember = activeTour.members.find((m) => m.id === s.from);
    const toMember = activeTour.members.find((m) => m.id === s.to);

    const paymentRecord: Expense = {
      id: crypto.randomUUID(),
      name: `Settle: ${fromMember?.name} → ${toMember?.name}`,
      totalAmount: s.amount,
      dateTime: new Date().toISOString(),
      payers: { [s.from]: s.amount },
      beneficiaries: { [s.to]: s.amount },
      splitMode: "amount",
      category: "payment",
      notes: `Quick settlement of debt.`,
    };

    setShowExpenseForm(paymentRecord);
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen selection:bg-purple-500/30">
      <AuthModal />
      <AnimatePresence mode="wait">
        {!activeTourId ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md mx-auto px-6 py-12"
          >
            <header className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-start text-[var(--text-main)] relative gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-6xl font-black tracking-tighter text-purple-500 mb-2 drop-shadow-sm">
                  TripVault
                </h1>
                <p className="text-[var(--text-muted)] text-sm font-black uppercase tracking-widest">
                  Adventure. Accounted.
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-2 md:mt-1">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-sky-500/10 text-sky-600 border-sky-500/20 hover:bg-sky-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  <Info size={12} /> GUIDE
                </button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${isOnline ? 'bg-green-500/5 text-green-600 border-green-500/20' : 'bg-amber-500/5 text-amber-600 border-amber-500/20'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                      {isOnline ? 'Cloud Ready' : 'Offline Mode'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTrash(true)}
                   title="Trash Vault"
                   className="relative p-3 text-[var(--text-muted)] hover:text-red-500 bg-[var(--bg-surface)] rounded-full border border-[var(--border-color)] hover:border-red-500 transition-all shadow-sm"
                >
                  <Trash size={18} />
                  {(trashTours.length > 0 || trashExpenses.length > 0) && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold">
                         {trashTours.length + trashExpenses.length}
                      </span>
                    </span>
                  )}
                </button>
                <button onClick={() => setShowSettings(true)}
                  className="p-3 text-[var(--text-muted)] hover:text-purple-500 bg-[var(--bg-surface)] rounded-full border border-[var(--border-color)] hover:border-purple-500 transition-all shadow-sm"
                >
                  <Settings size={20} />
                </button>
              </div>
            </header>

            <div className="space-y-4">
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="JOIN CLOUD TOUR (6-CHAR ID)" 
                  value={joinTourId} 
                  onChange={e => setJoinTourId(e.target.value.toUpperCase())}
                  className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 py-3 font-mono font-bold outline-none uppercase text-center tracking-widest placeholder:opacity-50"
                  maxLength={6}
                />
                <button 
                  onClick={async () => {
                    if (joinTourId.length === 6) {
                      const docSnap = await getDoc(doc(db, 'tours', joinTourId));
                      if (docSnap.exists()) {
                        const cloudTour = docSnap.data() as Tour;
                                                if (!tours.find(t => t.id === cloudTour.id)) {
                          setTours([...tours, cloudTour]);
                        }
                        setActiveTourId(joinTourId);
                      } else {
                        alert("Invalid Join Code! No trip found with this ID.");
                        setJoinTourId("");
                      }
                    }
                  }}
                  disabled={joinTourId.length !== 6}
                  className="px-6 bg-[var(--bg-main)] hover:bg-slate-200 dark:hover:bg-slate-800 border border-[var(--border-color)] rounded-2xl font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  JOIN
                </button>
              </div>

              {tours.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-[var(--border-color)] rounded-2xl">
                  <p className="text-[var(--text-muted)] mb-4 font-medium">
                    No trips created yet
                  </p>
                  <button
                    onClick={() => setShowAddTour(true)}
                    className="secondary-button"
                    id="create-first-tour-btn"
                  >
                    Start a New Adventure
                  </button>
                </div>
              ) : (
                tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    highlightId={highlightId}
                    onClick={() => setActiveTourId(tour.id)}
                    onDelete={(e) => handleDeleteTour(tour.id, e)}
                    isAdmin={tour.adminId === user?.uid}
                  />
                ))
              )}
            </div>

            {true && (
              <button
                onClick={() => setShowAddTour(true)}
                className="accent-button fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-40"
                id="fab-add-tour"
              >
                <Plus size={32} />
              </button>
            )}
          </motion.div>
        ) : !activeTour ? (
          <div className="min-h-screen flex flex-col items-center justify-center text-purple-500 font-black uppercase tracking-widest text-lg animate-pulse gap-4">
             <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
             Syncing...
          </div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col max-w-2xl mx-auto"
          >
            <div className="sticky top-0 z-30 bg-[var(--bg-main)] flex flex-col">
              {/* Header */}
              <header className="px-5 py-3 border-b border-[var(--border-color)] flex flex-col gap-2 relative">
                <div className="flex justify-between items-start w-full min-w-0">
                  <button
                    onClick={() => setActiveTourId(null)}
                    className="flex items-center gap-1 text-purple-500 hover:text-purple-400 text-xs font-black uppercase tracking-widest transition-colors w-max"
                    id="back-to-home"
                  >
                    <ChevronLeft size={12} /> Dashboard
                  </button>
                  <div className="flex gap-2 items-center flex-wrap justify-end pl-2">
                    <button
                      onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                      }
                      className="secondary-button !p-1.5 !rounded-lg"
                      id="theme-toggle"
                    >
                      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="accent-button !py-1.5 !px-2.5 !rounded-lg flex items-center"
                      title="Share as Sheet"
                      id="export-btn"
                    >
                      <Download size={14} className="mr-1 inline" />{" "}
                      <span className="text-[10px] font-black tracking-wider leading-none">
                        EXPORT
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <h1 className="text-3xl flex-1 font-black uppercase tracking-tighter leading-none truncate pr-4">
                    {activeTour?.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {true && (
                      <div 
                        onClick={() => {
                          if (activeTour?.id) {
                            navigator.clipboard.writeText(activeTour.id);
                            alert("Join Code copied to clipboard!");
                          }
                        }}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#25D366] bg-[#25D366]/10 px-2 py-1.5 rounded-md border border-[#25D366]/20 select-all cursor-pointer" title="Copy to share">
                         JOIN CODE: {activeTour?.id}
                      </div>
                    )}
                    <button
                      onClick={() => setShowTrash(true)}
                     title="Trash Vault"
                     className="relative p-1.5 text-[var(--text-muted)] hover:text-red-500 bg-[var(--bg-surface)] rounded-md border border-[var(--border-color)] hover:border-red-500 transition-all"
                  >
                    <Trash size={12} />
                    {trashExpenses.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[7px] text-white items-center justify-center font-bold">
                           {trashExpenses.length}
                        </span>
                      </span>
                    )}
                  </button>
                    {(activeTour?.town || activeTour?.country) && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-surface)] px-2 py-1 rounded-md border border-[var(--border-color)] truncate max-w-[200px]">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{activeTour.town}{activeTour.town && activeTour.country ? ', ' : ''}{activeTour.country}</span>
                      </div>
                    )}
                    {isAdmin ? (<button 
                      onClick={() => setShowEditTour(true)}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 hover:bg-purple-500 hover:text-white transition-colors px-2.5 py-1.5 rounded-md border border-purple-500/20 hover:border-purple-500 shrink-0"
                    >
                      <Settings size={10} />
                      <span>{activeTour?.currency || 'USD'}</span>
                      <ChevronDown size={10} />
                    </button>) : (<span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-2.5 py-1.5 rounded-md border border-purple-500/20 shrink-0">
                      <span>{activeTour?.currency || 'USD'}</span>
                    </span>)}
                  </div>
                </div>
              </header>

              {/* Tabs */}
              <nav className="flex px-2 sm:px-4 py-2 bg-[var(--bg-surface)] backdrop-blur-xl border-b border-[var(--border-color)] overflow-x-auto scrollbar-hide">
                {[
                  { id: "members", icon: Users, label: "Members" },
                  { id: "expenses", icon: History, label: "Expenses" },
                  { id: "balances", icon: Scale, label: "Balances" },
                  { id: "insights", icon: BarChart3, label: "Overview" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[70px] py-2 flex flex-col items-center gap-1 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-purple-600 dark:text-purple-400 bg-slate-50 dark:bg-slate-800"
                        : "text-[var(--text-muted)] hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    }`}
                    id={`tab-${tab.id}`}
                  >
                    <tab.icon
                      size={18}
                      className={
                        activeTab === tab.id
                          ? "opacity-100 animate-bounce-short"
                          : "opacity-70"
                      }
                    />
                    <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <main className="flex-1 p-6 pb-32">
              {activeTab === "members" && (
                <MemberView
                  activeTour={activeTour!}
                  onAdd={handleAddMember}
                  onUpdate={updateActiveTour}
                  highlightId={highlightId}
                  appSettings={appSettings}
                  isAdmin={isAdmin}
                />
              )}
              {activeTab === "expenses" && (
                <ExpenseView
                  activeTour={activeTour!}
                  highlightId={highlightId}
                  onAdd={() => setShowExpenseForm("new_expense")}
                  onEdit={(exp) => setShowExpenseForm(exp)}
                  onDelete={handleDeleteExpense}
                  isAdmin={isAdmin}
                  currentUserId={user?.uid}
                />
              )}
              {activeTab === "balances" && (
                <SettleView
                  activeTour={activeTour!}
                  balances={balances}
                  settlements={settlements}
                  onSettle={handleQuickSettle}
                  isAdmin={isAdmin}
                />
              )}
              {activeTab === "insights" && (
                <InsightsView activeTour={activeTour!} balances={balances} />
              )}
            </main>

            {/* Floating Action Buttons */}
            {activeTab === "expenses" && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 z-40 bg-[var(--bg-surface)] p-1.5 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[var(--border-color)]">
                <button
                  onClick={() => setShowExpenseForm("new_expense")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-[14px] flex items-center gap-1.5 transition-all active:scale-95 font-bold shadow-md shadow-purple-500/20 text-xs tracking-wide"
                  id="fab-add-expense"
                >
                  <Plus size={14} />
                  Add Expense
                </button>
                <button
                  onClick={() => setShowExpenseForm("new_payment")}
                  className="bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:bg-slate-800 text-[var(--text-muted)] dark:text-[var(--text-main)] px-4 py-2 rounded-[14px] flex items-center gap-1.5 transition-all active:scale-95 font-bold text-xs tracking-wide"
                  id="fab-add-payment"
                >
                  <ArrowRightLeft size={14} />
                  Settle / P2P
                </button>
              </div>
            )}

            {/* GPS and Gallery have been moved to the Tools tab */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showAddTour && (
          <AddTourModal
            onClose={() => setShowAddTour(false)}
            onSave={handleAddTour}
          />
        )}
        {showEditTour && activeTour && (
          <AddTourModal
            onClose={() => setShowEditTour(false)}
            onSave={handleEditTourSave}
            initialTour={activeTour}
          />
        )}
        
        
        {showTrash && (
           <TrashModal
              trashTours={trashTours}
              trashExpenses={trashExpenses}
              onRestoreTour={handleRestoreTour}
              onPermanentDeleteTour={handlePermanentDeleteTour}
              onRestoreExpense={handleRestoreExpense}
              onPermanentDeleteExpense={handlePermanentDeleteExpense}
              onClose={() => setShowTrash(false)}
           />
        )}
{showSettings && (
          <SettingsModal
            appSettings={appSettings}
            setAppSettings={setAppSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showInstructions && (
          <InstructionsModal onClose={() => setShowInstructions(false)} />
        )}
        {showExportModal && activeTour && (
          <ExportModal
            activeTour={activeTour}
            balances={balances}
            settlements={settlements}
            onClose={() => setShowExportModal(false)}
          />
        )}
        {showExpenseForm && (
          <ExpenseFormModal
            currency={activeTour?.currency || "USD"}
            members={activeTour?.members || []}
            expense={
              typeof showExpenseForm === "string" ? null : showExpenseForm
            }
            initialCategory={
              showExpenseForm === "new_payment" ? "payment" : "expense"
            }
            commonEvents={commonEvents}
            setCommonEvents={setCommonEvents}
            onClose={() => setShowExpenseForm(null)}
            onSave={handleSaveExpense}
            onDelete={handleDeleteExpense}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Calculator Component ---
function Calculator({
  value,
  onValueChange,
  onClose,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onClose: () => void;
}) {
  const [display, setDisplay] = useState(value || "0");

  const handleKey = (key: string) => {
    if (key === "C") setDisplay("0");
    else if (key === "=") {
      try {
        // Simple safety: only allow numbers and basic math operators
        const sanitized = display.replace(/[^-^0-9+*/.]/g, "");
        const result = new Function('return ' + sanitized)();
        setDisplay(Number(result).toFixed(2).replace(/\.00$/, ""));
      } catch {
        setDisplay("Error");
      }
    } else {
      setDisplay(display === "0" || display === "Error" ? key : display + key);
    }
  };

  const handleApply = () => {
    let final = display;
    if (
      display.includes("+") ||
      display.includes("-") ||
      display.includes("*") ||
      display.includes("/")
    ) {
      try {
        const sanitized = display.replace(/[^-^0-9+*/.]/g, "");
        final = Number(new Function('return ' + sanitized)()).toFixed(2).replace(/\.00$/, "");
      } catch {
        return;
      }
    }
    onValueChange(final);
    onClose();
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-2xl w-64 shadow-2xl absolute z-[110] top-20 right-4"
    >
      <div className="bg-[var(--bg-main)] p-4 rounded-2xl mb-4 text-right overflow-hidden">
        <p className="text-sky-500 font-mono text-2xl truncate">{display}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => handleKey("C")}
          className="col-span-4 bg-red-500/10 text-red-400 py-2 rounded-xl font-bold"
        >
          CLEAR
        </button>
        {buttons.map((b) => (
          <button
            key={b}
            onClick={() => handleKey(b)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all active:scale-90"
          >
            {b === "*" ? "×" : b === "/" ? "÷" : b}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-[var(--text-muted)] font-bold text-xs"
        >
          CLOSE
        </button>
        <button
          onClick={handleApply}
          className="flex-[2] py-3 bg-sky-500 text-white rounded-xl font-bold text-xs uppercase"
        >
          APPLY VALUE
        </button>
      </div>
    </motion.div>
  );
}

// --- Sub-components (Simplified for now, will keep in this file for cohesion) ---

function ExportModal({
  activeTour,
  balances,
  settlements,
  onClose,
}: {
  activeTour: Tour;
  balances: MemberBalance[];
  settlements: Transaction[];
  onClose: () => void;
}) {
  const downloadTripPDF = (tour: Tour, balances: MemberBalance[], settlements: Transaction[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const safeTourName = tour.name ? tour.name.replace(/[^\x00-\x7F]/g, "") : "Trip";
    
    doc.setFontSize(22);
    doc.text(`Trip Report: ${safeTourName}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Date: ${tour.date || 'TBD'}`, 14, 30);
    
    // 1. Balances Summary
    doc.setFontSize(16);
    doc.text("Member Balances", 14, 42);
    const balanceData = balances.map(b => [
      b.member.name, 
      formatCurrency(b.totalPaid, tour?.currency), 
      formatCurrency(b.totalShare, tour?.currency), 
      formatCurrency(b.netBalance, tour?.currency)
    ]);
    
    autoTable(doc, {
      startY: 48,
      head: [['Member', 'Total Paid', 'Total Consumed', 'Net Balance']],
      body: balanceData,
    });
    
    let finalY = (doc as any).lastAutoTable?.finalY || 60;
    
    // 2. Settlements
    if (settlements.length > 0) {
      finalY += 15;
      if (finalY > 250) { doc.addPage(); finalY = 20; }
      doc.setFontSize(16);
      doc.text("Settlement Plan (Debts)", 14, finalY);
      
      const settleData = settlements.map(s => {
        const fromName = balances.find(b => b.member.id === s.from)?.member.name || s.from;
        const toName = balances.find(b => b.member.id === s.to)?.member.name || s.to;
        return [fromName, toName, formatCurrency(s.amount, tour?.currency)];
      });
      
      autoTable(doc, {
        startY: finalY + 6,
        head: [['Debtor (Pays)', 'Creditor (Receives)', 'Amount']],
        body: settleData,
      });
      finalY = ((doc as any).lastAutoTable?.finalY || finalY) + 15;
    }
    
    // 3. Expenses List & Images
    if (tour.expenses.length > 0) {
      if (finalY > 250) { doc.addPage(); finalY = 20; }
      doc.setFontSize(16);
      doc.text("All Expenses & Receipts", 14, finalY);
      
      const expensesList = [...tour.expenses].sort((a,b) => new Date(a.dateTime || '').getTime() - new Date(b.dateTime || '').getTime());
      
      expensesList.forEach((exp, idx) => {
        if (finalY > 250) { doc.addPage(); finalY = 20; }
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const safeName = exp.name ? exp.name.replace(/→/g, '->').replace(/[^\x00-\x7F]/g, "") : "";
        doc.text(`${idx + 1}. ${safeName} (${exp.category === 'payment' ? 'Direct Payment' : 'Expense'})`, 14, finalY + 10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date & Time: ${new Date(exp.dateTime).toLocaleString()}`, 14, finalY + 16);
        doc.text(`Total Amount: ${formatCurrency(exp.totalAmount, tour?.currency)}`, 14, finalY + 22);
        
        let expY = finalY + 28;
        
        if(exp.notes) {
          doc.text(`Notes: ${exp.notes}`, 14, expY);
          expY += 6;
        }
        
        const vImg = exp.voucherImage;
        if (vImg && vImg.startsWith("data:image")) {
           doc.text("Receipt Image Attached (See below or next page)", 14, expY);
           expY += 6;
        }
        
        finalY = expY + 5;
        
        if (vImg && vImg.startsWith("data:image")) {
          // Check if there is enough space for the image
          if (finalY + 100 > 280) { doc.addPage(); finalY = 20; }
          try {
            doc.addImage(vImg, 'JPEG', 14, finalY, 120, 90);
            finalY += 100;
          } catch(e) {
            console.error(e);
          }
        } else {
            finalY += 5; // spacing for next item
        }
      });
    }
    
    doc.save(`${tour.name.replace(/[^a-z0-9]/gi, '_')}_Report.pdf`);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-8 shadow-2xl relative">
          <h3 className="text-xl font-black text-purple-500 tracking-tighter mb-6 uppercase">Export Options</h3>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={() => downloadTripPDF(activeTour, balances, settlements)}
              className="w-full text-left bg-sky-500/10 p-3 sm:p-4 rounded-xl border border-sky-500/20 hover:border-sky-500 hover:bg-sky-500/20 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm flex items-center gap-2 text-sky-500">
                 Complete Trip Report (PDF)
              </div>
              <div className="text-[9px] sm:text-[10px] text-sky-600/70 uppercase tracking-widest mt-1">Export full trip report with images and balances to PDF</div>
            </button>
            <button
              onClick={() => downloadFile(`${activeTour.name}_whole_summary.csv`, generateCSV(balances, settlements))}
              className="w-full text-left bg-[var(--bg-surface)] p-3 sm:p-4 rounded-xl border border-[var(--border-color)] hover:border-purple-500 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm">Whole Summary</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Basic member balances & debts</div>
            </button>
            <button
              onClick={() => downloadFile(`${activeTour.name}_detailed_breakdown.csv`, generateDetailedBreakdownCSV(activeTour, balances, settlements))}
              className="w-full text-left bg-[var(--bg-surface)] p-3 sm:p-4 rounded-xl border border-[var(--border-color)] hover:border-purple-500 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm">Detailed Breakdown</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Trip info, all expenses, receipts, notes, etc.</div>
            </button>
            <button
              onClick={() => downloadFile(`${activeTour.name}_expenses_only.csv`, generateExpenseBreakdownCSV(activeTour.expenses, activeTour.members))}
              className="w-full text-left bg-[var(--bg-surface)] p-3 sm:p-4 rounded-xl border border-[var(--border-color)] hover:border-purple-500 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm">Expenses & Events Only</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">All expenses with payers & consumers</div>
            </button>
            <button
              onClick={() => downloadFile(`${activeTour.name}_receipts_summary.csv`, generateReceiptsCSV(activeTour.expenses))}
              className="w-full text-left bg-[var(--bg-surface)] p-3 sm:p-4 rounded-xl border border-[var(--border-color)] hover:border-purple-500 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm">Receipts Summary</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">List of expenses with receipt status</div>
            </button>
            <button
              onClick={() => downloadFile(`${activeTour.name}_debts_only.csv`, generateDebtBreakdownCSV(settlements, balances))}
              className="w-full text-left bg-[var(--bg-surface)] p-3 sm:p-4 rounded-xl border border-[var(--border-color)] hover:border-purple-500 transition-colors"
            >
              <div className="font-bold text-xs sm:text-sm">Settlements & Debts</div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Optimized payment plan between members</div>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 sm:py-4 font-bold bg-[var(--bg-surface)] text-[var(--text-main)] rounded-full hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all border border-[var(--border-color)] uppercase tracking-widest text-xs shadow-sm"
          >
            CANCEL
          </button>
        </div>
      </motion.div>
    </div>
  );
}


function TrashModal({
  trashTours,
  trashExpenses,
  onRestoreTour,
  onPermanentDeleteTour,
  onRestoreExpense,
  onPermanentDeleteExpense,
  onClose,
}: {
  trashTours: Tour[];
  trashExpenses: Expense[];
  onRestoreTour: (id: string) => void;
  onPermanentDeleteTour: (id: string) => void;
  onRestoreExpense: (id: string) => void;
  onPermanentDeleteExpense: (id: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'tours' | 'expenses'>('tours');
  const items = tab === 'tours' ? trashTours : trashExpenses;

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-8 rounded-[40px] w-full max-w-lg shadow-2xl h-[80vh] flex flex-col pt-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-red-500">TRASH VAULT</h2>
          <button onClick={onClose} className="p-2 bg-[var(--bg-main)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
             <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-4 bg-[var(--bg-main)] p-1 rounded-2xl border border-[var(--border-color)]">
          <button 
             onClick={() => setTab('tours')} 
             className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'tours' ? 'bg-red-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
           >
            Trips ({trashTours.length})
          </button>
          <button 
             onClick={() => setTab('expenses')} 
             className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'expenses' ? 'bg-red-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)]'}`}
           >
            Entries ({trashExpenses.length})
          </button>
        </div>
        
        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-4">Items are permanently deleted after 30 days.</p>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-50">
                <Trash size={48} className="mb-4" />
                <p className="font-bold text-sm uppercase tracking-widest">Trash is empty</p>
             </div>
          ) : (
            items.map(item => {
              const deletedAt = 'deletedAt' in item ? item.deletedAt : Date.now();
              const daysLeft = deletedAt ? Math.max(0, 30 - Math.floor((Date.now() - deletedAt) / (1000 * 60 * 60 * 24))) : 0;
              const isExpense = 'totalAmount' in item;
              
              const title = item.name;
              
              return (
                <div key={item.id} className="bg-[var(--bg-main)] p-4 rounded-2xl flex items-center justify-between border border-[var(--border-color)] group">
                   <div>
                      <p className="font-bold text-[var(--text-main)] text-lg truncate max-w-[140px] sm:max-w-xs">{title || 'Unnamed'}</p>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">Expires in {daysLeft} days</p>
                   </div>
                   <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => isExpense ? onRestoreExpense(item.id) : onRestoreTour(item.id)} className="p-2 sm:px-3 bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-purple-500 hover:text-white rounded-xl transition-colors font-bold text-xs uppercase tracking-widest border border-[var(--border-color)] hover:border-transparent">
                       Restore
                     </button>
                     <button onClick={() => { if(confirm("Permanently delete?")) isExpense ? onPermanentDeleteExpense(item.id) : onPermanentDeleteTour(item.id) }} className="p-2 sm:px-3 bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-red-500 hover:text-white rounded-xl transition-colors font-bold text-xs uppercase tracking-widest border border-[var(--border-color)] hover:border-transparent">
                       Delete
                     </button>
                   </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InstructionsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[var(--bg-main)] w-full max-w-2xl rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] shadow-2xl overflow-y-auto"
      >
        <div className="flex justify-between items-center bg-[var(--bg-surface)] p-4 rounded-2xl sticky top-0 z-10 backdrop-blur-md border border-[var(--border-color)]">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-main)] mb-1">
              How to Guide
            </h2>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
              সহজ নির্দেশিকা
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-2 bg-[var(--bg-main)] hover:bg-red-50 hover:text-red-500 text-[var(--text-muted)] rounded-xl transition-all border border-[var(--border-color)]"
          >
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
        </div>

        <div className="space-y-6 text-sm px-2">

          {/* Dash & Trips */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">1</span>
              Creating Trips / ট্রিপ শুরু করা
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Create a new trip. If you are signed in, it saves to the cloud! If not, it saves to your device.
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> নতুন ট্রিপ তৈরি করুন। সাইন ইন করা থাকলে এটি ক্লাউডে সেভ হবে, অন্যথায় নিজস্ব ফোনে!
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">2</span>
              Adding Members / সদস্য যোগ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Add your friends' names! You cannot add an expense without friends.
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> বন্ধুদের নাম যোগ করুন! বন্ধু ছাড়া খরচ যোগ করা যাবে না।
              </p>
            </div>
          </div>

          {/* Join & Share */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">3</span>
              Invite Friends / প্রোজেক্ট শেয়ার
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Share the JOIN CODE so friends can join your trip and see everything live!
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> JOIN CODE কপি করে বন্ধুদের দিন, তারা তাদের ফোন থেকে লাইভ দেখতে পারবে।
              </p>
            </div>
          </div>

          {/* Expenses & Splits */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">4</span>
              Add Expenses / খরচ যোগ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Select who paid the money, and who the expense was for. Split it evenly or exactly!
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> কে টাকা দিয়েছে আর কাদের জন্য খরচ হয়েছে তা সিলেক্ট করে সমান বা নির্দিষ্ট ভাগে বিল ভাগ করুন।
              </p>
            </div>
          </div>

          {/* Settle Up */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">5</span>
              Settle UP / হিসাব মেলানো
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Check who owes whom. If someone pays you back, tap it and hit "Record Payment"!
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> কে কাকে টাকা দেবে তা Settle ট্যাবে দেখুন। কেউ টাকা দিলে 'Record Payment' এ চাপ দিন।
              </p>
            </div>
          </div>

          {/* PDF Export */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-[var(--text-main)] text-[var(--bg-main)] w-5 h-5 rounded text-xs flex items-center justify-center">6</span>
              Get PDF / পিডিএফ ডাউনলোড
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> Tap the download icon at the top at the end of the trip to save a PDF report.
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> ট্রিপ শেষে উপরের ডাউনলোড আইকনে চাপ দিয়ে পিডিএফ সেভ করুন!
              </p>
            </div>
          </div>

          {/* Trash */}
          <div className="space-y-3">
            <h3 className="font-black text-[var(--text-main)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="bg-red-500 text-white w-5 h-5 rounded text-xs flex items-center justify-center">7</span>
              Trash / মুছে ফেলা জিনিস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">English:</strong> If you accidentally delete a trip or expense, you can restore it from the Trash Vault!
              </p>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)] block mb-1">বাংলা:</strong> ভুলে কোনো ট্রিপ বা খরচ ডিলিট হলে, সেটি Trash Vault থেকে আবার ফিরিয়ে আনা যাবে!
              </p>
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-2 sticky bottom-0 bg-[var(--bg-main)] p-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-12 text-xs uppercase font-black tracking-widest bg-[var(--bg-surface)] text-[var(--text-main)] py-3 rounded-full hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all border border-[var(--border-color)] shadow-sm"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SettingsModal({
  appSettings,
  setAppSettings,
  onClose,
}: {
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[32px] p-6 shadow-2xl relative">
          <h3 className="text-xl font-black text-purple-500 tracking-tighter mb-6">GLOBAL SETTINGS</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                Region
              </label>
              <select
                className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors font-bold appearance-none"
                value={appSettings.region}
                onChange={(e) => setAppSettings(prev => ({ ...prev, region: e.target.value }))}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 20px center`, backgroundRepeat: `no-repeat`, backgroundSize: `16px 16px` }}
              >
                <option value="BD">Bangladesh (+880)</option>
                <option value="US">United States (+1)</option>
                <option value="GB">United Kingdom (+44)</option>
                <option value="IN">India (+91)</option>
              </select>
            </div>
            
            

            <div>
              <label className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                Theme
              </label>
              <select
                className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors font-bold appearance-none"
                value={appSettings.theme}
                onChange={(e) => setAppSettings(prev => ({ ...prev, theme: e.target.value }))}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 20px center`, backgroundRepeat: `no-repeat`, backgroundSize: `16px 16px` }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                Language
              </label>
              <select
                className="w-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors font-bold appearance-none"
                value={appSettings.language}
                onChange={(e) => setAppSettings(prev => ({ ...prev, language: e.target.value }))}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 20px center`, backgroundRepeat: `no-repeat`, backgroundSize: `16px 16px` }}
              >
                <option value="en">English</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => window.open('mailto:contact@TripVault.test')}
            className="w-full py-3 sm:py-4 bg-[var(--bg-surface)] hover:bg-slate-200 dark:hover:bg-slate-800 border-2 border-dashed border-[var(--border-color)] rounded-full font-bold text-[var(--text-main)] mb-3 sm:mb-4 transition-all uppercase tracking-widest text-xs"
          >
            CONTACT THE OWNER
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 sm:py-4 font-bold bg-purple-500 hover:bg-purple-400 text-white rounded-full shadow-lg transition-all text-xs sm:text-sm uppercase tracking-widest"
          >
            DONE
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AddTourModal({
  onClose,
  onSave,
  initialTour,
}: {
  onClose: () => void;
  onSave: (name: string, date: string, country: string, town: string, currency: string) => void;
  initialTour?: { name: string; date: string; country?: string; town?: string; currency?: string; };
}) {
  const [name, setName] = useState(initialTour?.name || "");
  const [date, setDate] = useState(initialTour?.date || "");
  const [country, setCountry] = useState(initialTour?.country || "");
  const [town, setTown] = useState(initialTour?.town || "");
  const [currency, setCurrency] = useState(initialTour?.currency || "USD");
  
  const countryCurrencyMap: Record<string, string> = {
    "Bangladesh": "BDT",
    "United States": "USD",
    "United Kingdom": "GBP",
    "India": "INR",
    "Germany": "EUR",
    "France": "EUR",
    "Italy": "EUR",
    "Spain": "EUR",
    "Australia": "AUD",
    "Canada": "CAD",
    "Singapore": "SGD",
    "Japan": "JPY",
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (countryCurrencyMap[c]) {
      setCurrency(countryCurrencyMap[c]);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-[32px] w-full max-w-md shadow-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">{initialTour ? "EDIT TRIP / PROJECT" : "NEW TRIP / PROJECT"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] sm:text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
              Trip Name
            </label>
            <input
              autoFocus
              id="new-trip-name"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-purple-500 text-[var(--text-main)] transition-colors font-medium text-sm sm:text-base"
              placeholder="e.g. Switzerland 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
              Date
            </label>
            <input
              id="new-trip-date"
              type="date"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-purple-500 text-[var(--text-main)] transition-colors text-sm sm:text-base"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] sm:text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                Country
              </label>
              <input
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-purple-500 text-[var(--text-main)] transition-colors text-sm sm:text-base"
                placeholder="Country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] sm:text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                Town / City
              </label>
              <input
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-purple-500 text-[var(--text-main)] transition-colors text-sm sm:text-base"
                placeholder="Town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] sm:text-xs uppercase font-bold text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
              Currency
            </label>
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-purple-500 text-[var(--text-main)] transition-colors appearance-none text-sm sm:text-base"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="SGD">SGD (S$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          
          

          <div className="flex gap-3 pt-4">
            <button
              id="cancel-add-trip"
              className="flex-1 py-3 sm:py-4 font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="save-new-trip"
              className="flex-1 py-3 sm:py-4 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-colors"
              onClick={() => name && onSave(name, date, country, town, currency)}
            >
              {initialTour ? "SAVE CHANGES" : "CREATE TRIP"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MemberView({
  activeTour,
  onAdd,
  onUpdate,
  highlightId,
  appSettings,
  isAdmin,
}: {
  activeTour: Tour;
  onAdd: (n: string, p: string, a?: string, o?: string, ni?: string, b?: string, w?: string) => void;
  onUpdate: (t: Tour, ctx?: { tab?: string; highlightId?: string }) => void;
  highlightId?: string | null;
  appSettings: AppSettings;
  isAdmin: boolean;
}) {
  const [name, setName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState(() => getPhonePrefix(appSettings.region));
  const [phoneBody, setPhoneBody] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nid, setNid] = useState("");
  const [bkash, setBkash] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const [phoneError, setPhoneError] = useState("");

  const handleRegisterOrUpdate = () => {
    const phone = phonePrefix + phoneBody;
    if (!name || !phoneBody) {
      if (!phoneBody) setPhoneError("Phone number is required");
      return;
    }

    // Basic Mobile Number Validation (allows optional + and digits, min 6 digits)
    const phoneRegex = /^\+?[0-9]{6,15}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");

    if (editingMemberId) {
      onUpdate(
        {
          ...activeTour,
          members: activeTour.members.map((m) =>
            m.id === editingMemberId
              ? {
                  ...m,
                  name,
                  phoneNumber: phone,
                  address,
                  occupation,
                  nid,
                  bkashNumber: bkash,
                  whatsappNumber: whatsapp,
                }
              : m,
          ),
        },
        { tab: "members" },
      );
      setEditingMemberId(null);
    } else {
      onAdd(name, phone, address, occupation, nid, bkash, whatsapp);
    }

    setName("");
    setPhoneBody("");
    setAddress("");
    setOccupation("");
    setNid("");
    setBkash("");
    setWhatsapp("");
    setShowDetails(false);
  };

  const startEdit = (m: Member) => {
    setEditingMemberId(m.id);
    setName(m.name);
    const p = m.phoneNumber || "";
    const prefixMatch = ["+880", "+1", "+44", "+91"].find(pr => p.startsWith(pr));
    setPhonePrefix(prefixMatch || getPhonePrefix(appSettings.region));
    setPhoneBody(prefixMatch ? p.slice(prefixMatch.length) : p);
    setAddress(m.address || "");
    setOccupation(m.occupation || "");
    setNid(m.nid || "");
    setBkash(m.bkashNumber || "");
    setWhatsapp(m.whatsappNumber || "");
    setShowDetails(true);
    setPhoneError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeMember = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdate(
      {
        ...activeTour,
        members: activeTour.members.filter((m) => m.id !== id),
      },
      { tab: "members", highlightId: id },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--bg-surface)] p-4 rounded-3xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">WhatsApp Group</h3>
            <p className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{activeTour.whatsappGroupLink ? "Link active" : "Not configured"}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowWhatsAppModal(true)}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTour.whatsappGroupLink ? 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[#25D366] hover:text-[#25D366]' : 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30'}`}
        >
          {activeTour.whatsappGroupLink ? "Manage" : "Setup"}
        </button>
      </div>

      {isAdmin && (<div className="item-card rounded-[32px] p-6 shadow-xl border-purple-500/20">
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-4">
          {editingMemberId ? "Edit Person Details" : "Add Person"}
        </h3>
        <div className="flex flex-col gap-3">
          <input
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 font-bold"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <select
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl pl-3 pr-8 py-2.5 outline-none focus:border-purple-500 font-mono text-sm shadow-sm appearance-none flex-shrink-0"
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 10px center`, backgroundRepeat: `no-repeat`, backgroundSize: `16px 16px` }}
              >
                <option value="+880">+880</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                className={`flex-1 w-full bg-[var(--bg-surface)] border ${phoneError ? 'border-red-500 bg-red-500/5' : 'border-[var(--border-color)]'} rounded-2xl px-4 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-sm transition-colors`}
                placeholder="Phone Number *"
                value={phoneBody}
                onChange={(e) => setPhoneBody(e.target.value)}
              />
            </div>
            {phoneError && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest pl-2 -mt-2">{phoneError}</p>}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 w-full min-w-0 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-3 sm:px-4 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-sm transition-colors"
              placeholder="bKash / Mobile"
              value={bkash}
              onChange={(e) => setBkash(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setBkash(phonePrefix + phoneBody)}
              className="bg-[var(--bg-main)] shrink-0 border border-[var(--border-color)] px-2.5 py-1 rounded-xl text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-[var(--text-muted)] hover:text-purple-500 transition-colors whitespace-nowrap self-center"
            >
              Use Phone
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 w-full min-w-0 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-3 sm:px-4 py-2.5 focus:outline-none focus:border-purple-500 font-mono text-sm transition-colors"
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setWhatsapp(phonePrefix + phoneBody)}
              className="bg-[var(--bg-main)] shrink-0 border border-[var(--border-color)] px-2.5 py-1 rounded-xl text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-[var(--text-muted)] hover:text-purple-500 transition-colors whitespace-nowrap self-center"
            >
              Use Phone
            </button>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-bold text-[var(--text-muted)] hover:text-purple-400 transition-colors self-start ml-2"
          >
            {showDetails
              ? "- HIDE MORE INFO"
              : "+ ADD MORE INFO (ADDRESS, NID...)"}
          </button>

                {showWhatsAppModal && (
        <WhatsAppGroupModal
          activeTour={activeTour}
          onUpdate={onUpdate}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}

      {showDetails && (
        <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-3 overflow-hidden"
            >
              <input
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
              <input
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 text-sm font-mono"
                placeholder="NID / ID Number"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
              />
            </motion.div>
          )}

          <div className="flex gap-2">
            {editingMemberId && (
              <button
                onClick={() => {
                  setEditingMemberId(null);
                  setName("");
                  setPhoneBody("");
                  setAddress("");
                  setOccupation("");
                  setNid("");
                  setShowDetails(false);
                }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)] rounded-2xl font-bold transition-all text-xs"
              >
                CANCEL
              </button>
            )}
            <button
              onClick={handleRegisterOrUpdate}
              className="flex-[2] py-3 bg-slate-800 dark:bg-slate-700 text-purple-400 rounded-2xl font-bold transition-all active:scale-95 text-xs"
            >
              {editingMemberId ? "SAVE CHANGES" : "REGISTER MEMBER"}
            </button>
          </div>
        </div>
      </div>)}

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4 mb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
            <Users size={12} className="text-purple-500" /> People (
            {activeTour.members.length})
            <span className="text-[10px] opacity-40 font-black tracking-tight normal-case pl-2 hidden sm:inline">
              (Hold to Delete)
            </span>
          </h3>
          <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-[var(--bg-surface)] text-purple-500 shadow-sm border border-[var(--border-color)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-[var(--bg-surface)] text-purple-500 shadow-sm border border-[var(--border-color)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
        <div
          className={
            viewMode === "list"
              ? "space-y-2"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
          }
        >
          {activeTour.members.map((m) => (
            <MemberCard
              key={m.id}
              m={m}
              highlightId={highlightId}
              activeTour={activeTour}
              onEdit={startEdit}
              onDelete={removeMember}
              isAdmin={isAdmin}
              isMemberAdmin={m.id === activeTour.adminId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpenseCard({
  exp,
  highlightId,
  activeTour,
  onEdit,
  onDelete,
  isAdmin,
  currentUserId,
}: {
  key?: React.Key;
  exp: Expense;
  highlightId: string | null;
  activeTour: Tour;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  currentUserId?: string;
}) {
  const isHighlighted = highlightId === exp.id;
  const isValid = isExpenseValid(exp, activeTour.members);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Sure about deleting this log?")) {
      onDelete(exp.id);
    }
  };

  return (
    <div
      id={`expense-${exp.id}`}
      className={`group relative bg-[var(--bg-surface)] border rounded-[24px] p-5 hover:border-purple-500/50 hover:shadow-xl transition-all cursor-pointer overflow-hidden ${isValid ? "border-[var(--border-color)]" : "border-red-500 border-2 bg-red-500/5"} ${isHighlighted && isValid ? "ring-2 ring-purple-500 scale-102 bg-purple-50/10" : ""}`}
      onClick={() => (isAdmin || exp.creatorId === currentUserId) && onEdit(exp)}
    >
      {!isValid && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl z-30 uppercase tracking-widest">
          Invalid/Deleted Member
        </div>
      )}
      {exp.creatorName && isValid && (
        <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-600 text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg z-20 uppercase tracking-widest border-b border-l border-purple-500/20">
          Entry by {exp.creatorName}
        </div>
      )}
      
      {/* Delete button on hover */}
      {isValid && (isAdmin || exp.creatorId === currentUserId) && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2.5 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all z-40 opacity-0 group-hover:opacity-100 shadow-sm"
          title="Delete Entry"
        >
          <Trash2 size={14} />
        </button>
      )}

      <div className={`flex flex-col relative z-20 ${!isValid ? 'opacity-60 grayscale' : ''}`}>
        <div className="w-full pr-6 md:pr-8 mb-2">
          <h4 className="font-black text-sm sm:text-base group-hover:text-purple-600 transition-colors tracking-tight leading-snug break-words">
            {exp.name}
          </h4>
        </div>
        
        <div className="mb-3">
          <p className="text-lg sm:text-xl font-black text-purple-600 tracking-tighter leading-none">
            {formatCurrency(exp.totalAmount, activeTour?.currency)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[10px] sm:text-xs font-bold text-[var(--text-muted)] opacity-90 pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar size={12} className="text-purple-500 shrink-0" />
            <span className="truncate">
              {new Date(
                (exp as any).dateTime || (exp as any).date,
              ).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] truncate max-w-[100px]">
              {activeTour.members
                .find((m) => exp.payers[m.id])
                ?.name.split(" ")[0] || "System"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseView({
  activeTour,
  onAdd,
  onEdit,
  onDelete,
  highlightId,
  isAdmin,
  currentUserId,
}: {
  activeTour: Tour;
  onAdd: () => void;
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
  highlightId: string | null;
  isAdmin: boolean;
  currentUserId?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"actual" | "p2p">("actual");
  const [filterPayerId, setFilterPayerId] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredExpenses = activeTour.expenses.filter((exp) => {
    const isModeMatch =
      filterMode === "actual"
        ? exp.category !== "payment"
        : exp.category === "payment";
    const isSearchMatch = exp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isPayerMatch =
      filterPayerId === "all" || exp.payers[filterPayerId] !== undefined;
    const isDateMatch = !filterDate || exp.dateTime.includes(filterDate);
    return isModeMatch && isSearchMatch && isPayerMatch && isDateMatch;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date((a as any).dateTime || (a as any).date).getTime();
    const dateB = new Date((b as any).dateTime || (b as any).date).getTime();
    return dateB - dateA;
  });

  const totalFiltered = sortedExpenses.reduce(
    (sum, e) => (isExpenseValid(e, activeTour.members) ? sum + e.totalAmount : sum),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)]">
          <button
            onClick={() => setFilterMode("actual")}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filterMode === "actual" ? "bg-purple-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-purple-500"}`}
          >
            Actual Costs
          </button>
          <button
            onClick={() => setFilterMode("p2p")}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filterMode === "p2p" ? "bg-purple-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-purple-500"}`}
          >
            P2P Payments
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group sm:w-1/3 shrink-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-purple-500 transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Find events..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl pl-10 pr-4 h-[44px] text-xs outline-none focus:border-purple-500 transition-all font-bold min-w-0 appearance-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-1 w-full min-w-0">
            <div className="relative flex-1 min-w-0">
              <input
                type="date"
                className="w-full h-[44px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-3 sm:px-4 text-xs outline-none focus:border-purple-500 transition-all font-mono appearance-none m-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer bg-transparent block cursor-pointer"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                onClick={(e) => {
                  try {
                    if ("showPicker" in e.currentTarget) {
                      e.currentTarget.showPicker();
                    }
                  } catch (err) {
                    // ignore
                  }
                }}
              />
            </div>
            <select
              className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-3 h-[44px] text-[11px] sm:text-xs outline-none focus:border-purple-500 transition-all font-bold uppercase truncate min-w-0 cursor-pointer"
              value={filterPayerId}
              onChange={(e) => setFilterPayerId(e.target.value)}
            >
              <option value="all">All Payers</option>
              {activeTour.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterDate || filterPayerId !== "all") && (
          <div className="flex justify-start animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
                setFilterPayerId("all");
              }}
              className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-red-500/50 text-[var(--text-muted)] hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm"
            >
              <X size={12} /> Clear Filters
            </button>
          </div>
        )}

        {/* Filter Summary & View Mode */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-3 sm:p-4 flex flex-row justify-between items-center gap-3">
          <div>
            <p className="text-[10px] sm:text-xs font-black uppercase text-purple-500 tracking-widest mb-0.5">
              {filterMode === "actual"
                ? "Filtered Actual Cost"
                : "Filtered Payments"}{" "}
              <span className="hidden sm:inline">({sortedExpenses.length})</span>
            </p>
            <p className="text-base sm:text-lg font-black text-purple-600 tracking-tighter truncate max-w-[150px] sm:max-w-none">
              {formatCurrency(totalFiltered, activeTour?.currency)}
            </p>
          </div>
          <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)] shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-[var(--bg-surface)] text-purple-500 shadow-sm border border-[var(--border-color)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-[var(--bg-surface)] text-purple-500 shadow-sm border border-[var(--border-color)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "list"
            ? "space-y-2"
            : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        }
      >
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-surface)] rounded-2xl border border-dashed border-[var(--border-color)]">
            <ReceiptText className="mx-auto mb-3 text-[var(--text-main)]" size={32} />
            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">
              No matching logs
            </p>
          </div>
        ) : (
          sortedExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id}
              exp={exp}
              highlightId={highlightId}
              activeTour={activeTour}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function InsightsView({
  activeTour,
  balances,
}: {
  activeTour: Tour;
  balances: MemberBalance[];
}) {
  const tourExpenses = activeTour.expenses.filter(
    (e) => e.category !== "payment" && isExpenseValid(e, activeTour.members),
  );
  const totalCost = tourExpenses.reduce(
    (acc: number, e: Expense) => acc + e.totalAmount,
    0,
  );
  const avgPerMember = totalCost / (activeTour.members.length || 1);

  // Category Breakdown
  const categoryMap: { [key: string]: number } = {};
  tourExpenses.forEach((e) => {
    const key = e.name.toLowerCase().split(" ")[0] || "other";
    categoryMap[key] = (categoryMap[key] || 0) + e.totalAmount;
  });

  const pieData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name: name.toUpperCase(),
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

  const timelineData = tourExpenses
    .map((e) => ({
      date: new Date((e as any).dateTime || (e as any).date).getTime(),
      amount: e.totalAmount,
      label: new Date(
        (e as any).dateTime || (e as any).date,
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="item-card p-6 bg-purple-600 text-white relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <TrendingUp className="mb-4 opacity-40" size={24} />
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] opacity-70">
            Accumulated Spend
          </p>
          <h2 title={formatCurrency(totalCost, activeTour?.currency)} className="text-2xl sm:text-3xl font-black tracking-tighter mt-1 truncate">
            {formatCurrency(totalCost, activeTour?.currency)}
          </h2>
        </div>
        <div className="item-card p-4 sm:p-6 border-purple-500/20 bg-white dark:bg-[var(--bg-surface)] group relative overflow-hidden">
          <Users className="mb-2 sm:mb-4 text-purple-500 opacity-80" size={24} />
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Member Liability Avg
          </p>
          <h2 title={formatCurrency(avgPerMember, activeTour?.currency)} className="text-2xl sm:text-3xl font-black tracking-tighter text-purple-600 mt-1 truncate">
            {formatCurrency(avgPerMember, activeTour?.currency)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="item-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <PieIcon size={16} className="text-purple-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                Major Categories
              </h3>
            </div>
            <span className="text-[10px] font-black bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
              Top 5
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  stroke="none"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    background: "#0f172a",
                    color: "#fff",
                    padding: "12px 16px",
                  }}
                  itemStyle={{
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                  }}
                  cursor={{ strokeWidth: 0 }}
                />
                <Legend
                  iconType="circle"
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    fontSize: "9px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="item-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-purple-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                Vibe Check (Spending)
              </h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <XAxis
                  dataKey="label"
                  fontSize={9}
                  axisLine={false}
                  tickLine={false}
                  fontWeight={900}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(139, 92, 246, 0.05)", radius: 12 }}
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    background: "#fff",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontSize: "10px",
                    fontWeight: "900",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#8b5cf6"
                  radius={[12, 12, 12, 12]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="item-card p-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6 px-1">
          Member Ledger Strength
        </h3>
        <div className="space-y-6">
          {balances
            .sort((a, b) => b.totalPaid - a.totalPaid)
            .map((b, i) => (
              <div key={b.member.id} className="group">
                <div className="flex justify-between text-xs font-black mb-2 px-1 uppercase tracking-tight">
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />{" "}
                    {b.member.name}
                  </span>
                  <span className="text-purple-600">
                    {formatCurrency(b.totalPaid, activeTour?.currency)}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(0, Math.min(100, (b.totalPaid / (totalCost || 1)) * 100))}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  />
                </div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1.5 px-1 uppercase tracking-widest">
                  {Math.max(0, (b.totalPaid / (totalCost || 1)) * 100).toFixed(1)}% of
                  total funds supplied
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function MemberBreakdownCard({
  b,
  activeTour,
}: {
  key?: React.Key;
  b: MemberBalance;
  activeTour: Tour;
}) {
  const [expanded, setExpanded] = useState(false);

  const memberExpenses = activeTour.expenses
    .filter((e) => e.payers[b.member.id] || e.beneficiaries[b.member.id])
    .sort(
      (a, bExp) =>
        new Date(bExp.dateTime || "").getTime() -
        new Date(a.dateTime || "").getTime(),
    );

  return (
    <div className="item-card overflow-hidden rounded-[20px] transition-all border border-[var(--border-color)]">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 flex flex-col justify-center group cursor-pointer hover:bg-[var(--bg-main)] gap-3"
      >
        <div className="flex items-center justify-between gap-3 w-full">
          <p className="font-black text-sm tracking-tight truncate uppercase text-[var(--text-main)]">
            {b.member.name}
          </p>
          <div
            className={`text-right font-black text-xs sm:text-sm rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 flex-shrink-0 ${b.netBalance >= 0 ? "bg-green-500/10 text-green-500 shadow-sm" : "bg-red-500/10 text-red-500 shadow-sm"}`}
          >
            {b.netBalance > 0 ? "+" : ""}
            {formatCurrency(b.netBalance, activeTour?.currency)}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-[10px] sm:text-[10px] font-bold uppercase text-[var(--text-muted)] mt-1 sm:mt-0">
          <span className="flex items-center gap-1 min-w-0">
            Paid:{" "}
            <span className="text-purple-500 truncate">
              {formatCurrency(b.totalPaid, activeTour?.currency)}
            </span>
          </span>
          <span className="flex items-center gap-1 min-w-0">
            Share:{" "}
            <span className="text-purple-500 truncate">
              {formatCurrency(b.totalShare, activeTour?.currency)}
            </span>
          </span>
        </div>
      </div>

      {expanded && (
        <div className="bg-[var(--bg-main)] border-t border-[var(--border-color)] px-4 py-3 space-y-3 max-h-64 overflow-y-auto">
          {memberExpenses.length === 0 && (
            <p className="text-xs text-[var(--text-muted)] font-bold uppercase">
              No records.
            </p>
          )}
          {memberExpenses.length > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">TRANSACTIONS</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const content = generateMemberDetailsCSV(b.member, activeTour.expenses);
                  const blob = new Blob([content], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${b.member.name}_costings.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-purple-500 hover:text-purple-600 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-md"
              >
                <Download size={12} />
                CSV
              </button>
            </div>
          )}
          {memberExpenses.map((exp) => {
            const paid = exp.payers[b.member.id] || 0;
            const consumed = exp.beneficiaries[b.member.id] || 0;
            const isInvalid = !isExpenseValid(exp, activeTour.members);
            return (
              <div
                key={exp.id}
                className={`flex justify-between items-center text-xs pb-2 border-b border-[var(--border-color)] last:border-0 last:pb-0 ${isInvalid ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex-1 truncate pr-4">
                  <p className="font-bold truncate">{exp.name} {isInvalid && <span className="text-red-500 ml-1">(Invalid)</span>}</p>
                  <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                    {new Date(exp.dateTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex gap-3 text-xs font-black font-mono">
                  {paid > 0 && (
                    <span className="text-purple-500 shrink-0">
                      +P: {formatCurrency(paid, activeTour?.currency)}
                    </span>
                  )}
                  {consumed > 0 && (
                    <span className="text-red-400 shrink-0">
                      -C: {formatCurrency(consumed, activeTour?.currency)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettleView({
  activeTour,
  balances,
  settlements,
  onSettle,
  isAdmin,
}: {
  activeTour: Tour;
  balances: MemberBalance[];
  settlements: Transaction[];
  onSettle: (s: Transaction) => void;
  isAdmin: boolean;
}) {
  const totalSpent = activeTour.expenses
    .filter((e) => e.category !== "payment" && isExpenseValid(e, activeTour.members))
    .reduce((acc, e) => acc + e.totalAmount, 0);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Total Overview */}
      <div className="bg-sky-500 rounded-[32px] p-8 text-white shadow-2xl shadow-sky-500/30 overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex justify-between items-start">
            <p className="text-sky-100 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <TrendingUp size={12} /> Total Expenditure
            </p>
            <div className="flex bg-white/20 p-1 rounded-xl backdrop-blur-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-white text-sky-500 shadow-sm" : "text-sky-100 hover:text-white"}`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-white text-sky-500 shadow-sm" : "text-sky-100 hover:text-white"}`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
          <h2 title={formatCurrency(totalSpent, activeTour?.currency)} className="text-4xl sm:text-5xl font-black truncate">{formatCurrency(totalSpent, activeTour?.currency)}</h2>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs font-bold text-sky-200 uppercase tracking-tight">
              Across {balances.length} Members
            </p>
            <PieIcon size={18} className="opacity-40" />
          </div>
        </div>
      </div>

      {/* Tables Side by Side or stacked */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 px-4">
            Member Breakdown
          </h3>
          <div
            className={
              viewMode === "list"
                ? "grid grid-cols-1 gap-3"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            }
          >
            {balances.map((b) => (
              <MemberBreakdownCard
                key={b.member.id}
                b={b}
                activeTour={activeTour}
              />
            ))}
          </div>
        </div>

        {/* Settlements */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-500">
              Payoff Strategy
            </h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">
              Debt Simplified
            </span>
          </div>
          <div
            className={
              viewMode === "list"
                ? "space-y-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            }
          >
            {settlements.length === 0 ? (
              <div className="p-10 text-center text-[var(--text-muted)] bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)] rounded-[32px] font-bold">
                <Scale className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-sm">All settled! No debts found.</p>
              </div>
            ) : (
              settlements.map((s, idx) => {
                const fromMember = balances.find((b) => b.member.id === s.from)?.member;
                const toMember = balances.find((b) => b.member.id === s.to)?.member;
                const fromName = fromMember?.name;
                const toName = toMember?.name;

                let whatsappUrl = "";
                const targetNumber = fromMember?.whatsappNumber || fromMember?.phoneNumber;
                if (targetNumber) {
                  const num = targetNumber.replace(/[^\d+]/g, '');
                  const bkashInfo = toMember?.bkashNumber ? `\nPlease send it to ${toName}'s bKash/Mobile account: ${toMember.bkashNumber}.` : '';
                  const message = encodeURIComponent(`Hi ${fromName},\nThis is a friendly reminder to settle your tour debt for "${activeTour.name}".\n\nYou owe ${formatCurrency(s.amount, activeTour?.currency)} to ${toName}.${bkashInfo}\n\nTime: ${new Date().toLocaleString()}`);
                  whatsappUrl = `https://wa.me/${num}?text=${message}`;
                }

                return (
                  <div
                    key={idx}
                    className={`item-card p-4 sm:p-5 flex ${viewMode === 'list' ? 'flex-col sm:flex-row items-start sm:items-center justify-between gap-4' : 'flex-col gap-4'} group rounded-[24px] border border-[var(--border-color)]`}
                  >
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex-1 min-w-0">
                        <p className="text-red-500 font-extrabold text-sm sm:text-base tracking-tight truncate uppercase">
                          {fromName}
                        </p>
                        <p className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-0.5">
                          Debtor
                        </p>
                      </div>
                      <div className="text-[var(--text-muted)] opacity-50 shrink-0">
                        <ChevronLeft size={16} className="rotate-180" />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-green-500 font-extrabold text-sm sm:text-base tracking-tight truncate uppercase">
                          {toName}
                        </p>
                        <p className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest mt-0.5">
                          Receiver
                        </p>
                      </div>
                    </div>
                    <div className={`flex ${viewMode === 'list' ? 'items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0' : 'items-center justify-between gap-3 w-full'}`}>
                      <p className={`font-black text-purple-600 tracking-tighter leading-none shrink-0 truncate ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
                        {formatCurrency(s.amount, activeTour?.currency)}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white border border-green-500/20 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                            title="Notify on WhatsApp"
                          >
                            <span>Notify</span>
                          </a>
                        )}
                        <button
                          onClick={() => onSettle(s)}
                          className="flex justify-center items-center bg-purple-500 hover:bg-purple-400 text-white border border-purple-500 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-[0_4px_12px_rgba(168,85,247,0.25)] hover:shadow-[0_6px_16px_rgba(168,85,247,0.4)] active:scale-95 transition-all whitespace-nowrap"
                          title="Settle Debt"
                        >
                          <span>{viewMode === 'list' ? 'Settle Now' : 'Settle'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPLEX MODAL: Expense Form ---
function ExpenseFormModal({
  members,
  expense,
  initialCategory,
  commonEvents,
  setCommonEvents,
  onClose,
  onSave,
  onDelete,
  currency,
}: {
  currency: string;
  members: Member[];
  expense: Expense | null;
  initialCategory?: "expense" | "payment";
  commonEvents: string[];
  setCommonEvents: (v: string[] | ((prev: string[]) => string[])) => void;
  onClose: () => void;
  onSave: (e: Expense) => void;
  onDelete?: (id: string) => void;
}) {
  const [name, setName] = useState(expense?.name || "");
  const [amount, setAmount] = useState(expense?.totalAmount.toString() || "");
  const [dateTime, setDateTime] = useState(
    expense?.dateTime ||
      new Date().toLocaleString("sv-SE").replace(" ", "T").slice(0, 16),
  );
  const [notes, setNotes] = useState(expense?.notes || "");
  const initialCat = expense?.category || initialCategory || "expense";
  const [splitMode, setSplitMode] = useState<"equal" | "amount" | "percent">(
    expense?.splitMode || (initialCat === "payment" ? "amount" : "equal"),
  );
  const category = initialCat; // no longer state, immutable during modal lifecycle
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showEventMgmt, setShowEventMgmt] = useState(false);
  const [newEventName, setNewEventName] = useState("");

  const [payers, setPayers] = useState<{ [id: string]: number }>(
    expense?.payers || {},
  );
  const [beneficiaries, setBeneficiaries] = useState<{ [id: string]: number }>(
    expense?.beneficiaries || {},
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'payers' | 'beneficiaries' | null>(null);
  const [validationError, setValidationError] = useState("");
  
  const autoName = useMemo(() => {
    if (category !== "payment") return "Untitled Expense";
    const pId = Object.keys(payers)[0];
    const bId = Object.keys(beneficiaries)[0];
    const pName = members.find((m) => m.id === pId)?.name.split(" ")[0] || "Someone";
    const bName = members.find((m) => m.id === bId)?.name.split(" ")[0] || "Someone";
    return `${pName} paid ${bName}`;
  }, [category, payers, beneficiaries, members]);

  // --- Helpers ---
  const totalAmount = parseFloat(amount) || 0;
  const totalPaid = (Object.values(payers) as number[]).reduce(
    (a, b) => a + (b || 0),
    0,
  );
  const paidDeficit = Number((totalAmount - totalPaid).toFixed(2));

  const totalSplitSum = (Object.values(beneficiaries) as number[]).reduce(
    (a, b) => a + (b || 0),
    0,
  );
  const splitDeficit =
    splitMode === "percent"
      ? Number((100 - totalSplitSum).toFixed(2))
      : Number((totalAmount - totalSplitSum).toFixed(2));

  const handleValidateBeforeConfirm = () => {
    if (totalAmount <= 0 || isNaN(totalAmount)) {
      setValidationError("Amount must be greater than zero.");
      return;
    }
    if (Object.keys(payers).length === 0) {
      setValidationError("Please select at least one payer.");
      return;
    }
    if (Object.keys(beneficiaries).length === 0) {
      setValidationError("Please select at least one beneficiary.");
      return;
    }
    if (Math.abs(paidDeficit) > 0.05) {
      setValidationError(`Paid amount doesn't match total! ${paidDeficit > 0 ? `Underpaid by ${paidDeficit.toFixed(2)}` : `Overpaid by ${Math.abs(paidDeficit).toFixed(2)}`}`);
      return;
    }
    if (Math.abs(splitDeficit) > 0.05) {
      if (splitMode === "percent") {
        setValidationError(`Percentages must equal 100%. Currently at ${totalSplitSum.toFixed(2)}%`);
      } else {
        setValidationError(`Split amounts don't match total! Difference of ${Math.abs(splitDeficit).toFixed(2)}`);
      }
      return;
    }
    
    setValidationError("");
    setShowConfirmation(true);
  };

  const distributeEquallyPaid = () => {
    const activePayers = Object.keys(payers);
    const targets =
      activePayers.length > 0 ? activePayers : members.map((m) => m.id);
    const share = Number((totalAmount / targets.length).toFixed(2));
    const newPayers: { [id: string]: number } = {};
    targets.forEach((id) => {
      newPayers[id] = share;
    });
    setPayers(newPayers);
  };

  const selectAllPayers = () => {
    const isAllChecked = Object.keys(payers).length === members.length;
    if (isAllChecked) {
      setPayers({});
    } else {
      const next: { [id: string]: number } = {};
      members.forEach((m) => {
        next[m.id] = totalAmount / members.length;
      });
      setPayers(next);
    }
  };

  const selectAllBeneficiaries = () => {
    const allSelected = Object.keys(beneficiaries).length === members.length;
    if (allSelected) {
      setBeneficiaries({});
    } else {
      const newBens: { [id: string]: number } = {};
      members.forEach((m) => {
        newBens[m.id] = 0;
      });
      setBeneficiaries(newBens);
    }
  };

  const toggleBeneficiary = (id: string) => {
    const newBens = { ...beneficiaries };
    if (newBens[id] !== undefined) delete newBens[id];
    else newBens[id] = 0;
    setBeneficiaries(newBens);
  };

  // --- Splitting Logic ---
  useEffect(() => {
    if (splitMode === "equal") {
      setBeneficiaries((prev) => {
        const selectedBens = Object.keys(prev);
        if (selectedBens.length === 0) return prev;
        const share = Number((totalAmount / selectedBens.length).toFixed(2));
        let changed = false;
        const next = { ...prev };
        selectedBens.forEach((id) => {
          if (next[id] !== share) {
            next[id] = share;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [totalAmount, splitMode, Object.keys(beneficiaries).length]);

  useEffect(() => {
    if (category === "payment") {
      const pId = Object.keys(payers)[0];
      const bId = Object.keys(beneficiaries)[0];
      if (pId && payers[pId] !== totalAmount) {
        setPayers({ [pId]: totalAmount });
      }
      if (bId && beneficiaries[bId] !== totalAmount) {
        setBeneficiaries({ [bId]: totalAmount });
      }
    }
  }, [totalAmount, category, Object.keys(payers)[0], Object.keys(beneficiaries)[0]]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          setImagePreview(canvas.toDataURL("image/jpeg", 0.6)); // Compress drastically
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let finalPayers = { ...payers };
    let finalBeneficiaries = { ...beneficiaries };
    
    if (category === "payment") {
      const pId = Object.keys(finalPayers)[0];
      const bId = Object.keys(finalBeneficiaries)[0];
      if (pId) finalPayers[pId] = totalAmount;
      if (bId) finalBeneficiaries[bId] = totalAmount;
    } else if (splitMode === "percent") {
      Object.keys(finalBeneficiaries).forEach((id) => {
        const pct = beneficiaries[id] || 0;
        finalBeneficiaries[id] = Number(((pct / 100) * totalAmount).toFixed(2));
      });
    }

    onSave({
      id: expense?.id || crypto.randomUUID(),
      name: name || autoName,
      totalAmount,
      dateTime,
      payers: finalPayers,
      beneficiaries: finalBeneficiaries,
      notes,
      splitMode,
      category,
      voucherImage: imagePreview || expense?.voucherImage,
      creatorId: expense?.creatorId,
      creatorName: expense?.creatorName,
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const expName = name || autoName;
    const safeName = expName ? expName.replace(/→/g, '->').replace(/[^\x00-\x7F]/g, "") : "";
    
    doc.setFontSize(20);
    doc.text(`Expense / Event: ${safeName}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Date & Time: ${new Date(dateTime).toLocaleString()}`, 14, 32);
    doc.text(`Category: ${category === "payment" ? "Direct Payment" : "Expense Entry"}`, 14, 40);
    doc.text(`Total Amount: ${formatCurrency(totalAmount, currency)}`, 14, 48);
    
    const payersData = Object.entries(payers).map(([id, amount]) => [
      members.find(m => m.id === id)?.name || id,
      formatCurrency(amount as number, currency)
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: [['Paid By', 'Amount']],
      body: payersData.length ? payersData : [['None', '0']],
    });
    
    let finalY = (doc as any).lastAutoTable?.finalY || 65;
    
    const benData = Object.entries(beneficiaries).map(([id, amount]) => [
      members.find(m => m.id === id)?.name || id,
      formatCurrency(amount as number, currency)
    ]);
    
    autoTable(doc, {
      startY: finalY + 10,
      head: [[category === "payment" ? 'Money To' : 'Split Among', 'Amount']],
      body: benData.length ? benData : [['None', '0']],
    });
    
    finalY = (doc as any).lastAutoTable?.finalY || (finalY + 20);
    
    if (notes) {
      finalY += 10;
      doc.text(`Notes:`, 14, finalY);
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(notes, pageWidth - 28);
      doc.text(splitNotes, 14, finalY + 7);
      finalY += 7 + (splitNotes.length * 5);
    }
    
    const voucher = imagePreview || expense?.voucherImage;
    if (voucher && voucher.startsWith("data:image")) {
       try {
           doc.addPage();
           doc.setFontSize(16);
           doc.text("Receipt / Voucher Image", 14, 20);
           doc.addImage(voucher, 'JPEG', 14, 30, 180, 0);
       } catch(e) {
           console.error("Failed to add image to PDF", e);
       }
    }
    
    doc.save(`${expName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const isAllSelected = Object.keys(beneficiaries).length === members.length;

  if (showConfirmation) {
    return (
      <div className="modal-overlay z-[100] px-4 sm:px-6 overflow-y-auto !justify-start pt-16 sm:pt-24 pb-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-10 rounded-[40px] w-full max-w-md shadow-2xl relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <ReceiptText className="text-purple-500" size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--text-main)]">
              Review Entry
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mt-2">
              Check details before saving
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <div className="item-card p-6 border-purple-500/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[10px] font-black uppercase text-purple-500 tracking-widest mb-1">
                    Purpose
                  </p>
                  <h4 className="font-black text-xl tracking-tight leading-none text-[var(--text-main)] uppercase">
                    {name || "Trip Expense"}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-purple-500 tracking-widest mb-1">
                    Amount
                  </p>
                  <p className="font-mono text-xl font-black text-purple-500 leading-none">
                    {formatCurrency(totalAmount, currency)}
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex justify-between items-center text-xs font-bold text-[var(--text-muted)] uppercase">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(dateTime).toLocaleDateString()}
                </span>
                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                  {splitMode} SPLIT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="item-card p-5 bg-[var(--bg-main)]">
                <p className="text-[10px] font-black uppercase text-purple-500 mb-3 tracking-widest">
                  Who Paid
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                  {Object.entries(payers).map(([id, amt]) => (
                    <div key={id} className="flex flex-col">
                      <span className="text-xs font-black text-[var(--text-main)] truncate">
                        {members.find((m) => m.id === id)?.name}
                      </span>
                      <span className="font-mono text-xs font-black text-purple-500">
                        {formatCurrency(amt as number, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="item-card p-5 bg-[var(--bg-main)]">
                <p className="text-[10px] font-black uppercase text-purple-500 mb-3 tracking-widest font-mono">
                  Who was this for?
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                  {Object.entries(beneficiaries).map(([id, share]) => (
                    <div key={id} className="flex flex-col">
                      <span className="text-xs font-black text-[var(--text-main)] truncate">
                        {members.find((m) => m.id === id)?.name}
                      </span>
                      <span className="font-mono text-xs font-black text-[var(--text-muted)]">
                        {formatCurrency(share as number, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {notes && (
              <div className="item-card p-4 bg-yellow-50 dark:bg-yellow-500/5 border-yellow-200 dark:border-yellow-500/20">
                <p className="text-[10px] font-black uppercase text-yellow-600 mb-1">
                  Notes
                </p>
                <p className="text-[11px] font-medium italic text-yellow-800 dark:text-yellow-200/70">
                  {notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="secondary-button py-5 flex-1 text-xs sm:text-sm font-black uppercase tracking-widest"
            >
              Modify Details
            </button>
            <button
              onClick={handleSave}
              className="accent-button py-5 flex-1 text-xs sm:text-sm shadow-purple-500/40 font-black uppercase tracking-widest"
            >
              Save Transaction
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="modal-overlay overflow-y-auto flex-col !justify-start p-4 pt-16 sm:pt-24 pb-24">
      {showCalculator && (
        <Calculator
          value={amount}
          onValueChange={setAmount}
          onClose={() => setShowCalculator(false)}
        />
      )}

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[40px] w-full max-w-lg p-6 md:p-8 relative shrink-0"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {category === "payment" ? "Direct Payment" : "Expense Entry"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-muted)] hover:text-white"
          >
            <Plus className="rotate-45" />
          </button>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="bg-purple-500 rounded-[32px] p-6 lg:p-8 text-white shadow-2xl shadow-purple-500/30 overflow-hidden relative mb-4">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-purple-100 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Scale size={12} /> Balance Sheet
                </p>
                <h2 title={formatCurrency(totalAmount, currency)} className="text-3xl sm:text-4xl font-black truncate max-w-full">
                  {formatCurrency(totalAmount, currency)}
                </h2>

                {Math.abs(paidDeficit) > 0.01 && (
                  <div className="mt-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl inline-flex items-center gap-2">
                    <span className="text-xs font-black uppercase">
                      Unpaid:
                    </span>
                    <span className="font-mono text-xs font-black">
                      {formatCurrency(paidDeficit, currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {category === "expense" && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase font-black text-[var(--text-muted)] tracking-widest pl-1">
                    What was this for?
                  </label>
                  <button
                    onClick={() => setShowEventMgmt(!showEventMgmt)}
                    className="text-xs text-purple-500 font-bold hover:underline"
                  >
                    Customize Quick List
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3 px-1">
                  {commonEvents.map((ev) => (
                    <button
                      key={ev}
                      onClick={() => setName(ev)}
                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase transition-all duration-300 ${name === ev ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" : "bg-white dark:bg-[var(--bg-surface)] border border-slate-200 dark:border-[var(--border-color)] text-[var(--text-muted)] hover:border-purple-300"}`}
                    >
                      {ev}
                    </button>
                  ))}
                </div>

                {showEventMgmt && (
                  <div className="bg-[var(--bg-main)]/50 p-4 rounded-2xl border border-[var(--border-color)] mb-4 animate-in slide-in-from-top-1 px-4">
                    <div className="flex gap-2 mb-3">
                      <input
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs outline-none focus:border-purple-500 text-[var(--text-main)]"
                        placeholder="New Event Type..."
                      />
                      <button
                        onClick={() => {
                          if (newEventName) {
                            setCommonEvents([...commonEvents, newEventName]);
                            setNewEventName("");
                          }
                        }}
                        className="bg-sky-500 text-white px-4 rounded-xl text-xs font-bold"
                      >
                        ADD
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {commonEvents.map((ev) => (
                        <div
                          key={ev}
                          className="flex items-center gap-1 bg-[var(--bg-surface)] px-2 py-1 rounded-lg text-xs text-[var(--text-muted)]"
                        >
                          {ev}
                          <button
                            onClick={() =>
                              setCommonEvents(
                                commonEvents.filter((x) => x !== ev),
                              )
                            }
                            className="text-red-500 hover:scale-110"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-xs uppercase font-black text-[var(--text-muted)] tracking-widest pl-1 mb-1 block">
                {category === 'expense' ? 'Purpose' : 'Payment Note'}
              </label>
              <input
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:border-purple-500 text-[var(--text-main)] outline-none font-bold mb-4"
                placeholder={category === 'expense' ? "Give it a name..." : `e.g. ${autoName}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!name && category === 'payment' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/5 rounded-xl border border-purple-500/10 mb-4 -mt-2 animate-in fade-in slide-in-from-top-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                   <p className="text-[10px] font-black uppercase text-purple-600 tracking-tight">
                     Auto-Note: <span className="opacity-70">{autoName}</span>
                   </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 pr-1">
                <label className="text-xs uppercase font-black text-[var(--text-muted)] tracking-widest pl-1">
                  Amount (BDT)
                </label>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="flex items-center gap-1 text-xs bg-[var(--bg-main)] px-2 py-1 border border-[var(--border-color)] rounded-lg text-purple-500 font-bold hover:bg-slate-700"
                >
                  <Scale size={10} /> Calculator
                </button>
              </div>
              <input
                type="number"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-6 py-5 focus:border-purple-500 text-[var(--text-main)] outline-none font-black text-purple-500 text-3xl"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </section>

          {category === 'payment' ? (
            <section className="relative z-20 space-y-4 rounded-[24px] border border-[var(--border-color)] p-4 bg-[var(--bg-main)]">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xs uppercase font-black text-purple-500 tracking-widest">Money From (Payer)</h3>
              </div>
              <select 
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-3 rounded-2xl text-xs font-black hover:border-purple-500 transition-colors shadow-sm outline-none appearance-none"
                value={Object.keys(payers)[0] || ""}
                onChange={(e) => {
                  const pId = e.target.value;
                  if (pId) {
                    setPayers({ [pId]: Number(amount) || 0 });
                    if (beneficiaries[pId] !== undefined) setBeneficiaries({});
                  }
                }}
              >
                <option value="" disabled>Select Payer...</option>
                {members.map(m => <option key={m.id} value={m.id} disabled={beneficiaries[m.id] !== undefined}>{m.name}</option>)}
              </select>

              <div className="flex items-center gap-3 mb-1 mt-4">
                <h3 className="text-xs uppercase font-black text-purple-500 tracking-widest">Money To (Receiver)</h3>
              </div>
              <select 
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-3 rounded-2xl text-xs font-black hover:border-purple-500 transition-colors shadow-sm outline-none appearance-none"
                value={Object.keys(beneficiaries)[0] || ""}
                onChange={(e) => {
                  const bId = e.target.value;
                  if (bId) {
                    setBeneficiaries({ [bId]: Number(amount) || 0 });
                    if (payers[bId] !== undefined) setPayers({});
                  }
                }}
              >
                <option value="" disabled>Select Receiver...</option>
                {members.map(m => <option key={m.id} value={m.id} disabled={payers[m.id] !== undefined}>{m.name}</option>)}
              </select>
            </section>
          ) : (
            <>
              <section className="relative z-20">
                {openDropdown && <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />}
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs uppercase font-black text-purple-500 tracking-widest">Paid By</h3>
                    <span className={`text-xs px-2.5 py-1 rounded font-black font-mono ${Math.abs(paidDeficit) > 0.05 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {Math.abs(paidDeficit) > 0.05 ? `-${paidDeficit.toFixed(2)}` : 'Balanced'}
                    </span>
                  </div>
                  <button onClick={distributeEquallyPaid} className="secondary-button text-[10px] py-1 px-2.5">Auto-Fill</button>
                </div>

                <div className="relative z-20">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'payers' ? null : 'payers')}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-3 rounded-2xl flex justify-between items-center text-xs font-black hover:border-purple-500 transition-colors shadow-sm"
                  >
                    <span>{Object.keys(payers).length} Selected Payers</span>
                    <span className="text-[10px]">{openDropdown === 'payers' ? '▲' : '▼'}</span>
                  </button>
                  {openDropdown === 'payers' && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-main)] border border-[var(--border-color)] shadow-2xl rounded-2xl p-2 z-30 max-h-48 overflow-y-auto">
                      <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-surface)] rounded-xl group uppercase tracking-widest text-[10px] text-purple-500">
                        <input type="checkbox" checked={Object.keys(payers).length === members.length} onChange={selectAllPayers} className="w-4 h-4 accent-purple-500" />
                        Select All
                      </label>
                      {members.map(m => {
                        const paying = payers[m.id] !== undefined;
                        return (
                          <label key={m.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-surface)] rounded-xl transition-colors">
                            <input type="checkbox" checked={paying} onChange={(e) => {
                               const next = {...payers};
                               if (paying) delete next[m.id];
                               else next[m.id] = 0;
                               setPayers(next);
                            }} className="w-4 h-4 accent-purple-500" />
                            <span className={`text-xs font-black ${paying ? 'text-purple-500' : 'text-[var(--text-main)]'}`}>{m.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {Object.keys(payers).length > 0 && (
                  <div className="mt-3 space-y-2 relative z-10 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
                    {members.filter(m => payers[m.id] !== undefined).map(m => (
                      <div key={m.id} className="flex items-center gap-3 bg-[var(--bg-surface)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm focus-within:border-purple-500/50 transition-colors">
                        <span className="text-xs font-black truncate flex-1 px-2 text-purple-500">{m.name.split(' ')[0]}</span>
                        <div className="relative w-1/2">
                          <input 
                            type="number" 
                            className="w-full bg-[var(--bg-main)] border border-transparent pl-7 pr-3 py-2.5 rounded-xl font-mono text-xs focus:border-purple-500/50 outline-none text-purple-500 font-black transition-colors" 
                            placeholder="0" 
                            value={payers[m.id] || ''} 
                            onChange={e => setPayers({...payers, [m.id]: parseFloat(e.target.value) || 0})} 
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-purple-300 font-black tracking-tighter">৳</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="relative z-10">
                {openDropdown === 'beneficiaries' && <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />}
                
                <div className="flex justify-between items-center mb-3 mt-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xs uppercase font-black text-purple-500 tracking-widest">Split Among</h3>
                    <span className={`text-xs px-2.5 py-1 rounded font-black font-mono ${Math.abs(splitDeficit) > 0.05 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {Math.abs(splitDeficit) > 0.05 ? `-${splitDeficit.toFixed(2)}${splitMode === 'percent' ? '%' : ''}` : 'Balanced'}
                    </span>
                  </div>
                  <select className="bg-[var(--bg-surface)] text-[10px] font-black uppercase py-1.5 px-3 rounded-full border border-[var(--border-color)] focus:border-purple-500 outline-none transition-all shadow-sm" value={splitMode} onChange={e => setSplitMode(e.target.value as any)}>
                    <option value="equal">Equal</option>
                    <option value="amount">Exact</option>
                    <option value="percent">% Percent</option>
                  </select>
                </div>

                <div className="relative z-20">
                  <button 
                    onClick={() => setOpenDropdown(openDropdown === 'beneficiaries' ? null : 'beneficiaries')}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-3 rounded-2xl flex justify-between items-center text-xs font-black hover:border-purple-500 transition-colors shadow-sm"
                  >
                    <span>{Object.keys(beneficiaries).length} Selected Beneficiaries</span>
                    <span className="text-[10px]">{openDropdown === 'beneficiaries' ? '▲' : '▼'}</span>
                  </button>
                  {openDropdown === 'beneficiaries' && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-main)] border border-[var(--border-color)] shadow-2xl rounded-2xl p-2 z-30 max-h-48 overflow-y-auto">
                      <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-surface)] rounded-xl group uppercase tracking-widest text-[10px] text-purple-500">
                        <input type="checkbox" checked={isAllSelected} onChange={selectAllBeneficiaries} className="w-4 h-4 accent-purple-500" />
                        Select All
                      </label>
                      {members.map(m => {
                        const isBen = beneficiaries[m.id] !== undefined;
                        return (
                          <label key={m.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--bg-surface)] rounded-xl transition-colors">
                            <input type="checkbox" checked={isBen} onChange={(e) => { 
                             toggleBeneficiary(m.id); 
                            }} className="w-4 h-4 accent-purple-500" />
                            <span className={`text-xs font-black ${isBen ? 'text-purple-500' : 'text-[var(--text-main)]'}`}>{m.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {Object.keys(beneficiaries).length > 0 && (
                  <div className="mt-3 space-y-2 relative z-10 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                    {members.filter(m => beneficiaries[m.id] !== undefined).map(m => (
                      <div key={m.id} className="flex items-center gap-3 bg-[var(--bg-surface)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm focus-within:border-purple-500/50 transition-colors">
                        <span className={`text-xs font-black truncate flex-1 px-2 ${splitMode === 'equal' ? 'text-[var(--text-main)]' : 'text-purple-500'}`}>{m.name.split(' ')[0]}</span>
                        <div className="relative w-1/2 flex justify-end">
                          {splitMode === 'equal' ? (
                             <p className="text-xs font-mono font-black text-[var(--text-muted)] bg-[var(--bg-main)] border border-transparent px-4 py-2.5 rounded-xl text-right w-full">{formatCurrency(beneficiaries[m.id] || 0, currency)}</p>
                          ) : (
                            <div className="relative w-full">
                              <input 
                                type="number" 
                                className="w-full bg-[var(--bg-main)] border border-transparent pl-7 pr-3 py-2.5 rounded-xl font-mono text-xs focus:border-purple-500/50 outline-none text-purple-500 font-black transition-colors" 
                                value={beneficiaries[m.id] || ''} 
                                onChange={e => setBeneficiaries({...beneficiaries, [m.id]: parseFloat(e.target.value) || 0})} 
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-purple-300 tracking-tighter">{splitMode === 'percent' ? '%' : '৳'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-black text-[var(--text-muted)] tracking-[0.2em] pl-1 mb-2 block">
                  Entry Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl px-4 py-4 focus:border-purple-500 outline-none text-[var(--text-main)] font-mono text-xs min-w-0"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase font-black text-[var(--text-muted)] tracking-[0.2em] pl-1 mb-2 block">
                  Receipt Hub
                </label>
                <div className="relative h-[60px] border-2 border-dashed border-[var(--border-color)] rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer overflow-hidden group">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                      alt="Preview"
                    />
                  ) : (
                    <Camera
                      size={20}
                      className="group-hover:text-purple-500 transition-colors"
                    />
                  )}
                  {!imagePreview && (
                    <span className="ml-2 text-xs font-black uppercase tracking-widest">
                      Add Receipt
                    </span>
                  )}
                </div>
              </div>
            </div>

            <textarea
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] px-6 py-5 outline-none text-sm min-h-[120px] leading-relaxed resize-none focus:border-purple-500 transition-all"
              placeholder="Add memo or extra trip details here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex gap-2">
              {expense?.id && (
                <button
                   type="button"
                   onClick={handleDownloadPDF}
                   title="Download PDF"
                   className="flex-[0.5] flex items-center justify-center py-5 bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                   <Download size={16} />
                </button>
              )}
              {expense?.id &&
                onDelete &&
                (showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(expense.id);
                      onClose();
                    }}
                    className="flex-1 py-5 bg-red-600 border border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Confirm?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteConfirm(true);
                      setTimeout(() => setShowDeleteConfirm(false), 3000);
                    }}
                    className="flex-1 py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Delete
                  </button>
                ))}
              <div className="flex-[2] flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleValidateBeforeConfirm();
                  }}
                  className="w-full py-4 bg-purple-500 hover:bg-purple-600 rounded-full font-bold text-sm tracking-widest shadow-2xl shadow-purple-500/20 disabled:opacity-30 disabled:grayscale active:scale-95 transition-all text-white uppercase mt-4"
                >
                  Save
                </button>
                {validationError && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 px-2 text-center">{validationError}</p>
                )}
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
