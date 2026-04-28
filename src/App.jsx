// ============================================================
//  SUN GROUP — Integrated Clean Energy Dashboard
//  Version : 2.0.0
//  Stack   : React 18 + Recharts + Lucide Icons
//  Author  : SUN Group Marketing & ESG Team
// ============================================================
//
//  STRUKTUR FILE (gunakan Ctrl+G untuk loncat ke baris):
//
//  [A] IMPORTS ................................ baris   20
//  [B] DESIGN TOKENS (warna, ukuran, font) ... baris   35
//  [C] BRAND CONFIG (logo, nama, tagline) .... baris   55
//  [D] RESPONSIVE HOOK ........................ baris   75
//  [E] DATA LAYER ............................. baris   90
//      E1. Solar PV Data ...................... baris   95
//      E2. EV Fleet Data ...................... baris  110
//      E3. BESS Data .......................... baris  125
//      E4. ESG Data ........................... baris  133
//      E5. Savings & Billing Data ............. baris  142
//  [F] UI PRIMITIVES .......................... baris  160
//      F1. Card ............................... baris  163
//      F2. KPI Card ........................... baris  170
//      F3. Badge .............................. baris  185
//      F4. Section Title ...................... baris  205
//      F5. Logo ............................... baris  212
//  [G] ENERGY FLOW DIAGRAM ................... baris  225
//  [H] PAGES .................................. baris  290
//      H1. Overview Page ...................... baris  295
//      H2. Solar PV Page ...................... baris  385
//      H3. EV Fleet Page ...................... baris  460
//      H4. BESS Page .......................... baris  550
//      H5. ESG Report Page .................... baris  630
//      H6. Billing Page ....................... baris  710
//  [I] NAVIGATION CONFIG ...................... baris  770
//  [J] LOGIN PAGE ............................. baris  790
//  [K] DASHBOARD SHELL ........................ baris  900
//  [L] ROOT APP ............................... baris  980
//
// ============================================================


// ─────────────────────────────────────────────────────────────
// [A] IMPORTS
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Sun, Battery, Truck, Leaf, CreditCard, LayoutDashboard,
  Zap, Activity, TrendingDown, Clock, Users,
  Eye, EyeOff, LogOut, Shield, ChevronRight,
} from "lucide-react";


// ─────────────────────────────────────────────────────────────
// [B] DESIGN TOKENS
//     Edit bagian ini untuk mengubah tampilan secara global
// ─────────────────────────────────────────────────────────────

const COLORS = {
  // ── Brand ──────────────────────────────────
  primary   : "#00A651",   // Hijau utama SUN Group
  navy      : "#0D1B2A",   // Background sidebar & login panel
  navyDark  : "#162435",   // Card dark di sidebar

  // ── Sistem ─────────────────────────────────
  solar     : "#00A651",   // Warna Solar PV (sama dengan primary)
  ev        : "#0EA5E9",   // Warna EV Fleet
  bess      : "#8B5CF6",   // Warna BESS
  grid      : "#F59E0B",   // Warna PLN Grid
  building  : "#3B82F6",   // Warna Building load

  // ── UI Netral ──────────────────────────────
  textPrimary   : "#1A2332",
  textSecondary : "#6B7A8D",
  textMuted     : "#9BA8B5",
  textDisabled  : "#C5CDD6",
  border        : "#E5EAF0",
  bgPage        : "#F4F6F9",
  bgCard        : "#FFFFFF",
  bgSidebar     : "#4A7A9B",  // Teks navigasi tidak aktif

  // ── Status Badge ───────────────────────────
  statusNormal      : { bg:"#DCFCE7", text:"#15803D", dot:"#22C55E" },
  statusCharging    : { bg:"#DBEAFE", text:"#1D4ED8", dot:"#3B82F6" },
  statusMaintenance : { bg:"#FEF3C7", text:"#B45309", dot:"#F59E0B" },
  statusOffline     : { bg:"#F3F4F6", text:"#6B7280", dot:"#9CA3AF" },
  statusDischarging : { bg:"#F0EEFF", text:"#7C3AED", dot:"#8B5CF6" },
  statusDue         : { bg:"#FEF3C7", text:"#B45309", dot:"#F59E0B" },
  statusPaid        : { bg:"#DCFCE7", text:"#15803D", dot:"#22C55E" },
};

const FONT = {
  family : "'Plus Jakarta Sans', 'DM Sans', 'Segoe UI', system-ui, sans-serif",
  // Size scale
  xs  : 9,
  sm  : 10,
  base: 11,
  md  : 12,
  lg  : 13,
  xl  : 15,
  xxl : 18,
  h1  : 24,
  h2  : 30,
};

const RADIUS = {
  sm : 6,
  md : 8,
  lg : 10,
  xl : 12,
  pill: 99,
};

const SPACING = {
  xs : 4,
  sm : 8,
  md : 12,
  lg : 16,
  xl : 20,
  xxl: 24,
  xxxl: 40,
};


// ─────────────────────────────────────────────────────────────
// [C] BRAND CONFIG
//     Edit bagian ini untuk mengganti logo, nama, tagline
// ─────────────────────────────────────────────────────────────

const BRAND = {
  name    : "SUN GROUP",             // ← Ganti nama perusahaan
  tagline : "Data Platform",         // ← Ganti tagline
  siteName: "PT Berau Coal",         // ← Ganti nama site aktif
  tierName: "Sapphire Customer",     // ← Ganti tier/kategori client

  // Logo: taruh file gambar di folder /public/ lalu set path-nya di sini
  // Contoh: logoPath: "/logo-sun.svg"
  // Jika null → akan tampil icon Sun (default)
  logoPath: "/Logo_sun-01.svg",      // ← Ganti path logo di sini

  // Ukuran logo (px)
  logoSize: 28,

  // Tahun copyright di footer
  year: 2026,
};


// ─────────────────────────────────────────────────────────────
// [D] RESPONSIVE HOOK
//     Deteksi lebar layar untuk layout adaptif
// ─────────────────────────────────────────────────────────────

const useBreakpoint = () => {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile : w < 640,    // HP
    isTablet : w < 1024,   // Tablet
    isDesktop: w >= 1024,  // Laptop/Desktop
    width    : w,
  };
};


// ─────────────────────────────────────────────────────────────
// [E] DATA LAYER — Mock Data
//     Ganti nilai di sini dengan data real dari API
// ─────────────────────────────────────────────────────────────

// [E1] Solar PV — Produksi harian (kW per jam)
const DATA_SOLAR_HOURLY = [
  { h:"00:00", grid:6800, solar:0  }, { h:"02:00", grid:6600, solar:0  },
  { h:"04:00", grid:6400, solar:0  }, { h:"06:00", grid:6200, solar:5  },
  { h:"07:00", grid:6100, solar:15 }, { h:"08:00", grid:5900, solar:28 },
  { h:"09:00", grid:5700, solar:38 }, { h:"10:00", grid:5500, solar:45 },
  { h:"11:00", grid:5400, solar:49 }, { h:"12:00", grid:5350, solar:49 },
  { h:"13:00", grid:5380, solar:47 }, { h:"14:00", grid:5420, solar:44 },
  { h:"15:00", grid:5600, solar:40 }, { h:"16:00", grid:5900, solar:30 },
  { h:"17:00", grid:6200, solar:15 }, { h:"18:00", grid:6500, solar:3  },
  { h:"20:00", grid:6800, solar:0  }, { h:"22:00", grid:6872, solar:0  },
];

// [E1b] Solar PV — Produksi bulanan (MWh)
const DATA_SOLAR_MONTHLY = [
  { m:"Jan", v:72 }, { m:"Feb", v:78 }, { m:"Mar", v:80 },
  { m:"Apr", v:82 }, { m:"May", v:85 }, { m:"Jun", v:88 },
  { m:"Jul", v:86 }, { m:"Aug", v:84 }, { m:"Sep", v:80 },
  { m:"Oct", v:76 }, { m:"Nov", v:74 }, { m:"Dec", v:72 },
];

// [E2] EV Fleet — Perbandingan biaya (Rp juta)
const DATA_EV_COST = [
  { d:"29 Mar", b:95, a:30 }, { d:"1 Apr",  b:92, a:28 },
  { d:"4 Apr",  b:88, a:27 }, { d:"7 Apr",  b:90, a:29 },
  { d:"10 Apr", b:85, a:26 }, { d:"13 Apr", b:87, a:28 },
  { d:"16 Apr", b:92, a:30 }, { d:"19 Apr", b:89, a:27 },
  { d:"22 Apr", b:88, a:26 }, { d:"25 Apr", b:91, a:29 },
  { d:"27 Apr", b:90, a:28 },
];

// [E2b] EV Fleet — Data kendaraan top savers
const DATA_EV_TOP_SAVERS = [
  { id:"BYD M6 ADU 014",    baseline:114.4, actual:34.3, savings:80.1, pct:73 },
  { id:"JAC T9 NYZ 007",    baseline:117.4, actual:35.2, savings:82.2, pct:71 },
  { id:"Sany SYZ IKL 003",  baseline:113.6, actual:34.1, savings:79.5, pct:72 },
  { id:"Chery J6T NYZ 010", baseline:111.1, actual:33.3, savings:77.8, pct:71 },
  { id:"Sany 965 NYZ 016",  baseline:103.9, actual:31.2, savings:72.7, pct:73 },
];

// [E3] BESS — State of Charge harian (%)
const DATA_BESS_SOC = [
  { t:"00:00", soc:85 }, { t:"02:00", soc:78 }, { t:"04:00", soc:70 },
  { t:"06:00", soc:62 }, { t:"08:00", soc:68 }, { t:"10:00", soc:75 },
  { t:"12:00", soc:82 }, { t:"14:00", soc:90 }, { t:"16:00", soc:88 },
  { t:"18:00", soc:80 }, { t:"20:00", soc:73 }, { t:"22:00", soc:68 },
  { t:"23:00", soc:65 },
];

// [E4] ESG — Tren bulanan CO2 dan fuel
const DATA_ESG_MONTHLY = [
  { m:"Oct", co2:52, fuel:78 }, { m:"Nov", co2:55, fuel:82 },
  { m:"Dec", co2:58, fuel:86 }, { m:"Jan", co2:60, fuel:89 },
  { m:"Feb", co2:57, fuel:84 }, { m:"Mar", co2:62, fuel:92 },
  { m:"Apr", co2:65, fuel:95 },
];

// [E5a] Overview — Breakdown savings per sistem
const DATA_SAVINGS_BREAKDOWN = [
  { name:"Solar PV vs PLN",  value:287, color:COLORS.solar },
  { name:"EV vs Diesel",     value:196, color:COLORS.ev    },
  { name:"BESS Peak Shaving",value:114, color:COLORS.bess  },
];

// [E5b] Billing — Riwayat pembayaran
const DATA_BILLING_HISTORY = [
  { period:"Apr 2026", service:"EV Fleet + Solar PV",  amount:"Rp 294.8M", status:"Due",  saving:"Rp 196.4M" },
  { period:"Mar 2026", service:"EV Fleet + Solar PV",  amount:"Rp 287.3M", status:"Paid", saving:"Rp 189.1M" },
  { period:"Feb 2026", service:"EV Fleet + Solar PV",  amount:"Rp 301.2M", status:"Paid", saving:"Rp 205.6M" },
  { period:"Jan 2026", service:"EV + Solar + BESS",    amount:"Rp 312.5M", status:"Paid", saving:"Rp 218.3M" },
  { period:"Dec 2025", service:"EV + Solar + BESS",    amount:"Rp 298.7M", status:"Paid", saving:"Rp 197.8M" },
  { period:"Nov 2025", service:"EV Fleet + Solar PV",  amount:"Rp 276.4M", status:"Paid", saving:"Rp 178.2M" },
];


// ─────────────────────────────────────────────────────────────
// [F] UI PRIMITIVES
//     Komponen dasar yang digunakan di seluruh halaman
// ─────────────────────────────────────────────────────────────

// [F1] Card — Container putih dengan border
const Card = ({ children, style = {} }) => (
  <div style={{
    background    : COLORS.bgCard,
    borderRadius  : RADIUS.xl,
    border        : `1px solid ${COLORS.border}`,
    padding       : `${SPACING.lg}px ${SPACING.lg + 2}px`,
    ...style,
  }}>
    {children}
  </div>
);

// [F2] KPI Card — Kartu metrik angka besar
const KPI = ({ label, value, unit, sub, color = COLORS.primary, Icon }) => (
  <Card>
    <div style={{ display:"flex", alignItems:"flex-start", gap:SPACING.sm + 2 }}>
      {/* Icon area */}
      <div style={{
        background   : color + "18",
        borderRadius : RADIUS.md,
        padding      : SPACING.sm,
        flexShrink   : 0,
      }}>
        <Icon size={16} color={color} />
      </div>
      {/* Text area */}
      <div style={{ minWidth:0, flex:1 }}>
        <p style={{ fontSize:FONT.base, color:COLORS.textMuted, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {label}
        </p>
        <p style={{ fontSize:FONT.xxl, fontWeight:700, color:COLORS.textPrimary, lineHeight:1 }}>
          {value}
          <span style={{ fontSize:FONT.md, fontWeight:400, color:COLORS.textMuted, marginLeft:3 }}>
            {unit}
          </span>
        </p>
        {sub && (
          <p style={{ fontSize:FONT.base, color:COLORS.textSecondary, marginTop:4 }}>{sub}</p>
        )}
      </div>
    </div>
  </Card>
);

// [F3] Badge — Status label berwarna
const Badge = ({ status }) => {
  const MAP = {
    "Normal"       : COLORS.statusNormal,
    "Charging"     : COLORS.statusCharging,
    "In Maintenance": COLORS.statusMaintenance,
    "Offline"      : COLORS.statusOffline,
    "Discharging"  : COLORS.statusDischarging,
    "Due"          : COLORS.statusDue,
    "Paid"         : COLORS.statusPaid,
  };
  const cfg = MAP[status] || COLORS.statusOffline;
  return (
    <span style={{
      display      : "inline-flex",
      alignItems   : "center",
      gap          : 4,
      padding      : "2px 8px",
      borderRadius : RADIUS.pill,
      background   : cfg.bg,
      color        : cfg.text,
      fontSize     : FONT.base,
      fontWeight   : 500,
      whiteSpace   : "nowrap",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
      {status}
    </span>
  );
};

// [F4] Section Title — Judul + subtitle per section
const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:SPACING.sm + 4 }}>
    <p style={{ fontSize:FONT.lg, fontWeight:600, color:COLORS.textPrimary, marginBottom:2 }}>
      {title}
    </p>
    {sub && (
      <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{sub}</p>
    )}
  </div>
);

// [F5] Logo — Brand logo dengan fallback ke icon Sun
const Logo = ({ size = BRAND.logoSize, lightText = true }) => {
  const textColor = lightText ? "#FFFFFF" : COLORS.textPrimary;
  const subColor  = lightText ? "#6B8FA8" : COLORS.textMuted;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:SPACING.sm + 2 }}>
      {/* Logo image atau fallback icon */}
      {BRAND.logoPath ? (
        <img
          src={BRAND.logoPath}
          alt={BRAND.name}
          style={{ width:size, height:size, objectFit:"contain", flexShrink:0 }}
        />
      ) : (
        <div style={{
          width        : size,
          height       : size,
          borderRadius : "50%",
          background   : COLORS.primary,
          display      : "flex",
          alignItems   : "center",
          justifyContent: "center",
          flexShrink   : 0,
        }}>
          <Sun size={size * 0.5} color="#fff" />
        </div>
      )}
      {/* Brand text */}
      <div>
        <p style={{ color:textColor, fontSize:size * 0.48, fontWeight:700, lineHeight:1 }}>
          {BRAND.name}
        </p>
        <p style={{ color:subColor, fontSize:size * 0.33, marginTop:2 }}>
          {BRAND.tagline}
        </p>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// [G] ENERGY FLOW DIAGRAM
//     Visualisasi alur energi Solar → BESS → Building → EV
// ─────────────────────────────────────────────────────────────

// Data node yang ditampilkan di diagram
// Edit label, nilai, warna di sini
const FLOW_NODES = {
  solar    : { label:"☀ Solar PV",  val:"49.09 kW",       sub:"794 kWp",            color:COLORS.solar,    bg:"#E8F5EE" },
  bess     : { label:"🔋 BESS",     val:"65% SoC",         sub:"500 kWh · 85 kW out",color:COLORS.bess,     bg:"#F0EEFF" },
  grid     : { label:"⚡ PLN Grid", val:"6,872 kW",        sub:"",                   color:COLORS.grid,     bg:"#FEF3C7" },
  building : { label:"🏭 Building", val:"6,921 kW",        sub:"0.71% from Solar ✓",color:COLORS.building, bg:"#EFF6FF" },
  ev       : { label:"🚌 EV Fleet", val:"50 units",        sub:"12 charging now",    color:COLORS.ev,       bg:"#E0F2FE" },
};

// Mobile: tampilan kartu vertikal
const EnergyFlowMobile = () => (
  <div style={{ display:"flex", flexDirection:"column", gap:SPACING.sm }}>
    {Object.values(FLOW_NODES).map((node, i) => (
      <div key={node.label}>
        <div style={{
          display      : "flex",
          alignItems   : "center",
          gap          : SPACING.sm + 2,
          padding      : `${SPACING.sm + 2}px ${SPACING.md}px`,
          borderRadius : RADIUS.lg,
          background   : node.bg,
          border       : `1px solid ${node.color}25`,
        }}>
          <span style={{ fontSize:20 }}>{node.label.split(" ")[0]}</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:FONT.md, fontWeight:600, color:node.color }}>
              {node.label.replace(/^[^ ]+ /, "")}
            </p>
            <p style={{ fontSize:FONT.base, color:COLORS.textSecondary }}>{node.val}</p>
            {node.sub && (
              <p style={{ fontSize:FONT.sm, color:COLORS.textMuted }}>{node.sub}</p>
            )}
          </div>
          {i < 4 && (
            <span style={{ fontSize:16, color:node.color }}>↓</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Desktop: SVG diagram horizontal
const EnergyFlowDesktop = () => {
  const arrowIds = [
    ["arrow-solar", COLORS.solar],
    ["arrow-bess",  COLORS.bess ],
    ["arrow-grid",  COLORS.grid ],
    ["arrow-ev",    COLORS.ev   ],
  ];
  return (
    <svg viewBox="0 0 700 180" width="100%" style={{ overflow:"visible", display:"block" }}>
      <defs>
        {arrowIds.map(([id, fill]) => (
          <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={fill} />
          </marker>
        ))}
      </defs>

      {/* ── Solar PV Node ── */}
      <rect x="10" y="55" width="110" height="75" rx="10" fill={FLOW_NODES.solar.bg} stroke={COLORS.solar} strokeWidth="1.5"/>
      <text x="65" y="82"  textAnchor="middle" fill={COLORS.solar}       fontSize="11" fontWeight="600">☀ Solar PV</text>
      <text x="65" y="100" textAnchor="middle" fill={COLORS.textPrimary} fontSize="15" fontWeight="700">49.09 kW</text>
      <text x="65" y="118" textAnchor="middle" fill={COLORS.textSecondary} fontSize="10">794 kWp installed</text>

      {/* Solar → BESS */}
      <path d="M120 92 L175 92" stroke={COLORS.solar} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-solar)"/>
      <text x="147" y="86" textAnchor="middle" fill={COLORS.solar} fontSize="9">charge</text>

      {/* ── BESS Node ── */}
      <rect x="175" y="45" width="120" height="95" rx="10" fill={FLOW_NODES.bess.bg} stroke={COLORS.bess} strokeWidth="1.5"/>
      <text x="235" y="73"  textAnchor="middle" fill={COLORS.bess}         fontSize="11" fontWeight="600">🔋 BESS</text>
      <text x="235" y="95"  textAnchor="middle" fill={COLORS.textPrimary}  fontSize="15" fontWeight="700">65% SoC</text>
      <text x="235" y="113" textAnchor="middle" fill={COLORS.textSecondary}fontSize="10">500 kWh capacity</text>
      <text x="235" y="129" textAnchor="middle" fill={COLORS.bess}         fontSize="9">Discharging: 85 kW</text>

      {/* ── Grid Node (small) ── */}
      <rect x="175" y="155" width="120" height="20" rx="6" fill={FLOW_NODES.grid.bg} stroke={COLORS.grid} strokeWidth="1"/>
      <text x="235" y="169" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="600">⚡ PLN Grid — 6,872 kW</text>

      {/* BESS → Building */}
      <path d="M295 92 L365 92" stroke={COLORS.bess} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-bess)"/>
      <text x="330" y="86" textAnchor="middle" fill={COLORS.bess} fontSize="9">discharge</text>

      {/* Grid → Building */}
      <path d="M295 165 C340 165 360 120 365 108" stroke={COLORS.grid} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-grid)"/>

      {/* ── Building Node ── */}
      <rect x="365" y="42" width="130" height="95" rx="10" fill={FLOW_NODES.building.bg} stroke={COLORS.building} strokeWidth="1.5"/>
      <text x="430" y="70"  textAnchor="middle" fill={COLORS.building}     fontSize="11" fontWeight="600">🏭 Building</text>
      <text x="430" y="90"  textAnchor="middle" fill={COLORS.textPrimary}  fontSize="15" fontWeight="700">6,921 kW</text>
      <text x="430" y="108" textAnchor="middle" fill={COLORS.textSecondary}fontSize="10">total load</text>
      <text x="430" y="124" textAnchor="middle" fill={COLORS.solar}        fontSize="9">0.71% from Solar ✓</text>

      {/* Building → EV */}
      <path d="M495 89 L555 89" stroke={COLORS.ev} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-ev)"/>
      <text x="525" y="83" textAnchor="middle" fill={COLORS.ev} fontSize="9">EV charge</text>

      {/* ── EV Fleet Node ── */}
      <rect x="555" y="55" width="130" height="70" rx="10" fill={FLOW_NODES.ev.bg} stroke={COLORS.ev} strokeWidth="1.5"/>
      <text x="620" y="80"  textAnchor="middle" fill="#0369A1"             fontSize="11" fontWeight="600">🚌 EV Fleet</text>
      <text x="620" y="100" textAnchor="middle" fill={COLORS.textPrimary}  fontSize="15" fontWeight="700">50 units</text>
      <text x="620" y="116" textAnchor="middle" fill={COLORS.textSecondary}fontSize="10">12 charging now</text>
    </svg>
  );
};

// Wrapper komponen Energy Flow
const EnergyFlow = ({ isMobile }) => (
  <Card>
    <SectionTitle
      title="Energy Flow — Real-time"
      sub="Aliran energi bersih di seluruh ekosistem"
    />
    {isMobile ? <EnergyFlowMobile /> : <EnergyFlowDesktop />}
    {/* Legend */}
    <div style={{ display:"flex", flexWrap:"wrap", gap:SPACING.lg, marginTop:SPACING.sm + 4 }}>
      {[
        { color:COLORS.solar,    label:"Solar generation" },
        { color:COLORS.bess,     label:"BESS discharge"   },
        { color:COLORS.grid,     label:"Grid supply"      },
        { color:COLORS.ev,       label:"EV charging"      },
      ].map(({ color, label }) => (
        <span key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:FONT.base, color:COLORS.textMuted }}>
          <span style={{ display:"inline-block", width:16, borderTop:`2px dashed ${color}` }} />
          {label}
        </span>
      ))}
    </div>
  </Card>
);


// ─────────────────────────────────────────────────────────────
// [H] PAGES
// ─────────────────────────────────────────────────────────────


// ── [H1] OVERVIEW PAGE ──────────────────────────────────────

const OverviewPage = ({ setPage, isMobile }) => {
  // KPI cards data — edit nilai di sini
  const KPIs = [
    { label:"Total Financial Savings", value:"Rp 892.4M", unit:"",       sub:"↑ Solar + EV + BESS combined", color:COLORS.primary,  Icon:TrendingDown },
    { label:"CO2e Avoided",            value:"675.38",    unit:"tCO2e",  sub:"Scope 1 + Scope 2",            color:COLORS.bess,     Icon:Leaf         },
    { label:"Energy Generated",        value:"1.37",      unit:"GWh",    sub:"Solar PV cumulative",          color:COLORS.ev,       Icon:Zap          },
    { label:"System Health",           value:"98%",       unit:"",       sub:"All systems operational",      color:COLORS.grid,     Icon:Activity     },
  ];

  // System status buttons — edit label, status, halaman tujuan
  const SYSTEMS = [
    { label:"Solar PV", status:"Normal",      val:"794 kWp",              page:"solar", Icon:Sun,     color:COLORS.solar },
    { label:"EV Fleet", status:"Charging",    val:"50 units · 12 aktif",  page:"ev",    Icon:Truck,   color:COLORS.ev    },
    { label:"BESS",     status:"Discharging", val:"500 kWh · 65% SoC",   page:"bess",  Icon:Battery, color:COLORS.bess  },
  ];

  // Insight cards — edit pesan & tipe (success / warning / info)
  const INSIGHTS = [
    {
      type : "success",
      title: "Strong cost performance",
      desc : "EV fleet beroperasi 72% di bawah baseline diesel, melampaui target 70% kuartal ini.",
    },
    {
      type : "warning",
      title: "Charging optimization opportunity",
      desc : "Peak charging cost terdeteksi jam 2–4 PM. Pertimbangkan shift ke jam off-peak.",
    },
    {
      type : "info",
      title: "ESG milestone approaching",
      desc : "On track melampaui 1.000 tCO2e sebelum akhir Q2 2026 — narasi kuat untuk award submissions.",
    },
  ];

  const insightStyle = {
    success: { bg:"#F0FDF4", border:"#86EFAC", icon:"✓", color:"#15803D" },
    warning: { bg:"#FFFBEB", border:"#FDE68A", icon:"!",  color:"#B45309" },
    info   : { bg:"#EFF6FF", border:"#BFDBFE", icon:"i",  color:"#1D4ED8" },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>

      {/* KPI Row */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* Energy Flow */}
      <EnergyFlow isMobile={isMobile} />

      {/* Savings Chart + System Status */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:SPACING.md }}>

        {/* Savings Breakdown Chart */}
        <Card>
          <SectionTitle
            title="Savings Breakdown — 30 Hari Terakhir"
            sub="3 dimensi: Solar PV, EV Fleet, BESS peak shaving"
          />
          <ResponsiveContainer width="100%" height={isMobile ? 160 : 150}>
            <BarChart data={DATA_SAVINGS_BREAKDOWN} layout="vertical" margin={{ left:0, right:20 }}>
              <XAxis type="number" tick={{ fontSize:FONT.sm, fill:COLORS.textMuted }} tickFormatter={v => `Rp ${v}M`} />
              <YAxis type="category" dataKey="name" width={isMobile ? 110 : 145} tick={{ fontSize:FONT.base, fill:COLORS.textPrimary }} />
              <Tooltip formatter={v => [`Rp ${v}M`, "Savings"]} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {DATA_SAVINGS_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* System Status */}
        <Card>
          <SectionTitle title="System Status" />
          <div style={{ display:"flex", flexDirection:"column", gap:SPACING.sm }}>
            {SYSTEMS.map(({ label, status, val, page, Icon: Ic, color }) => (
              <button
                key={page}
                onClick={() => setPage(page)}
                style={{
                  display     : "flex",
                  alignItems  : "center",
                  gap         : SPACING.sm + 2,
                  padding     : `${SPACING.sm + 2}px ${SPACING.md}px`,
                  borderRadius: RADIUS.lg,
                  textAlign   : "left",
                  border      : `1px solid ${color}30`,
                  background  : color + "0D",
                  cursor      : "pointer",
                  width       : "100%",
                }}
              >
                <Ic size={14} color={color} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:FONT.md, fontWeight:600, color:COLORS.textPrimary }}>{label}</p>
                  <p style={{ fontSize:FONT.sm, color:COLORS.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</p>
                </div>
                <Badge status={status} />
              </button>
            ))}
          </div>
          <p style={{ fontSize:FONT.xs, color:COLORS.textDisabled, marginTop:SPACING.sm + 4 }}>
            Updated: 27 Apr 2026, 17:10 WIB
          </p>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <SectionTitle title="Key Insights" />
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:SPACING.sm + 2 }}>
          {INSIGHTS.map(({ type, title, desc }) => {
            const s = insightStyle[type];
            return (
              <div key={title} style={{ padding:`${SPACING.md}px`, borderRadius:RADIUS.lg, background:s.bg, border:`1px solid ${s.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:SPACING.xs + 2, marginBottom:SPACING.xs + 2 }}>
                  <span style={{
                    width:16, height:16, borderRadius:"50%", background:s.color, color:"#fff",
                    fontSize:FONT.xs, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}>{s.icon}</span>
                  <p style={{ fontSize:FONT.md, fontWeight:600, color:s.color }}>{title}</p>
                </div>
                <p style={{ fontSize:FONT.base, color:"#4B5563", lineHeight:1.5 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};


// ── [H2] SOLAR PV PAGE ──────────────────────────────────────

const SolarPage = ({ isMobile }) => {
  const KPIs = [
    { label:"Installed Capacity",   value:"794",   unit:"kWp",  color:COLORS.solar, Icon:Sun         },
    { label:"Total Energy Generated",value:"1.37", unit:"GWh",  color:COLORS.solar, Icon:Zap         },
    { label:"Today Production",     value:"2.93",  unit:"MWh",  sub:"↑ +5% vs yesterday", color:COLORS.solar, Icon:Activity    },
    { label:"This Month",           value:"82.28", unit:"MWh",  color:COLORS.solar, Icon:TrendingDown },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* Area Chart */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:SPACING.md }}>
          <SectionTitle
            title="Grid vs Solar — Hari Ini (kW)"
            sub="27 April 2026 · Huawei Inverter · Status: Normal"
          />
          <div style={{ display:"flex", gap:SPACING.lg, fontSize:FONT.base, color:COLORS.textMuted, flexShrink:0 }}>
            <span><span style={{ display:"inline-block", width:12, borderTop:`2px solid ${COLORS.solar}`, marginRight:4, verticalAlign:"middle" }}/>Grid</span>
            <span><span style={{ display:"inline-block", width:12, borderTop:"2px solid #F59E0B", marginRight:4, verticalAlign:"middle" }}/>Solar</span>
          </div>
        </div>
        {/* Live metrics row */}
        <div style={{ display:"flex", gap:isMobile?SPACING.md:SPACING.xxl, marginBottom:SPACING.lg, flexWrap:"wrap" }}>
          {[
            { l:"Grid",     v:"6,872.437 kW", c:COLORS.textSecondary },
            { l:"Building", v:"6,921.53 kW",  c:COLORS.textPrimary   },
            { l:"Solar",    v:"49.09 kW",      c:COLORS.solar         },
          ].map(item => (
            <div key={item.l}>
              <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{item.l}</p>
              <p style={{ fontSize:FONT.lg,   fontWeight:700, color:item.c }}>{item.v}</p>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 190}>
          <AreaChart data={DATA_SOLAR_HOURLY} margin={{ right:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="h" tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} interval={isMobile ? 4 : 2} />
            <YAxis tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v, n) => [`${v.toLocaleString()} kW`, n === "grid" ? "Grid" : "Solar"]} />
            <Area type="monotone" dataKey="grid"  stroke={COLORS.solar} fill="#E8F5EE" strokeWidth={2} />
            <Area type="monotone" dataKey="solar" stroke={COLORS.grid}  fill="#FEF3C7" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Impact + Social */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:SPACING.md }}>
        <Card>
          <SectionTitle title="Environmental Impact" />
          {[
            { icon:"🌫️", l:"CO2 Reduction",   v:"650.38 ton" },
            { icon:"🌳", l:"Trees Equivalent", v:"889 trees"  },
            { icon:"⚡", l:"Self-Sufficiency", v:"0.71%"      },
            { icon:"🔆", l:"Grid Dependency",  v:"99.3% PLN"  },
          ].map(item => (
            <div key={item.l} style={{ display:"flex", alignItems:"center", gap:SPACING.sm + 2, padding:`${SPACING.sm}px 0`, borderBottom:`1px solid ${COLORS.bgPage}` }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{item.l}</p>
                <p style={{ fontSize:FONT.lg,   fontWeight:600, color:COLORS.textPrimary }}>{item.v}</p>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle title="Social Aspect" />
          {[
            { l:"Installation Workers", v:"39 people" },
            { l:"O&M Workers",          v:"3 people"  },
            { l:"Local Employment",     v:"87%"        },
          ].map(item => (
            <div key={item.l} style={{ display:"flex", justifyContent:"space-between", padding:`${SPACING.sm}px 0`, borderBottom:`1px solid ${COLORS.bgPage}` }}>
              <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{item.l}</p>
              <p style={{ fontSize:FONT.md,   fontWeight:600, color:COLORS.textPrimary }}>{item.v}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Monthly Bar Chart */}
      <Card>
        <SectionTitle title="Monthly Production (MWh)" sub="Jan – Dec 2026" />
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={DATA_SOLAR_MONTHLY} margin={{ right:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize:FONT.sm, fill:COLORS.textDisabled }} />
            <YAxis tick={{ fontSize:FONT.sm, fill:COLORS.textDisabled }} />
            <Tooltip formatter={v => [`${v},000 kWh`, "Production"]} />
            <Bar dataKey="v" fill={COLORS.solar} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};


// ── [H3] EV FLEET PAGE ──────────────────────────────────────

const EVPage = ({ isMobile }) => {
  const KPIs = [
    { label:"Baseline Cost",     value:"Rp 491.2M", unit:"",       color:COLORS.textSecondary, Icon:CreditCard  },
    { label:"Actual Cost",       value:"Rp 294.8M", unit:"",       color:COLORS.ev,            Icon:Zap         },
    { label:"Total Savings",     value:"40.0%",     unit:"",       sub:"vs diesel baseline",   color:COLORS.primary, Icon:TrendingDown },
    { label:"Energy Used",       value:"23.3",      unit:"MWh",    color:COLORS.textPrimary,   Icon:Activity    },
    { label:"Fuel Avoided",      value:"9,334",     unit:"L",      color:COLORS.grid,          Icon:Truck       },
    { label:"Emissions Avoided", value:"25.0",      unit:"tCO2e",  color:COLORS.bess,          Icon:Leaf        },
  ];

  const FLEET_STATUS = [
    { l:"Operational",    v:22, c:COLORS.primary },
    { l:"Charging",       v:12, c:COLORS.ev      },
    { l:"In Maintenance", v:34, c:COLORS.grid    },
    { l:"Offline",        v:28, c:"#9CA3AF"      },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* Cost Chart + Fleet Ops */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:SPACING.md }}>
        <Card>
          <SectionTitle title="Cost Comparison — 30 Hari Terakhir" sub="Baseline BBM vs aktual armada EV" />
          <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
            <AreaChart data={DATA_EV_COST} margin={{ right:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="d" tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} interval={isMobile ? 2 : 1} />
              <YAxis tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} tickFormatter={v => `Rp ${v}M`} />
              <Tooltip formatter={(v, n) => [`Rp ${v}M`, n === "b" ? "Baseline" : "Actual"]} />
              <Area type="monotone" dataKey="b" stroke="#9CA3AF" fill="#F3F4F6" strokeWidth={1.5} />
              <Area type="monotone" dataKey="a" stroke={COLORS.ev} fill="#E0F2FE" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle title="Fleet Operations" sub="96 kendaraan total" />
          {FLEET_STATUS.map(f => (
            <div key={f.l} style={{ marginBottom:SPACING.sm + 2 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:FONT.md, color:COLORS.textPrimary }}>{f.l}</span>
                <span style={{ fontSize:FONT.md, fontWeight:700, color:f.c }}>{f.v}</span>
              </div>
              <div style={{ height:6, borderRadius:RADIUS.pill, background:"#F3F4F6" }}>
                <div style={{ height:"100%", borderRadius:RADIUS.pill, background:f.c, width:`${(f.v/96)*100}%` }} />
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:SPACING.md, paddingTop:SPACING.md, borderTop:`1px solid ${COLORS.bgPage}` }}>
            {[{ l:"Avg. SoC", v:"65%" }, { l:"Avg. Daily", v:"185 km" }].map(i => (
              <div key={i.l}>
                <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{i.l}</p>
                <p style={{ fontSize:FONT.xl,   fontWeight:700, color:COLORS.textPrimary }}>{i.v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Cost Savers Table */}
      <Card>
        <SectionTitle title="Top Cost Savers" sub="Kendaraan dengan penghematan tertinggi — 30 hari terakhir" />
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", fontSize:FONT.md, borderCollapse:"collapse", minWidth:isMobile ? 400 : 0 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${COLORS.border}` }}>
                {["Vehicle ID","Baseline","Actual","Savings","Reduction"].map(h => (
                  <th key={h} style={{ padding:`${SPACING.sm}px ${SPACING.xs}px`, textAlign:"left", fontWeight:500, color:COLORS.textMuted, fontSize:FONT.base }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA_EV_TOP_SAVERS.map(v => (
                <tr key={v.id} style={{ borderBottom:`1px solid ${COLORS.bgPage}` }}>
                  <td style={{ padding:`${SPACING.sm + 2}px ${SPACING.xs}px`, fontWeight:600, color:COLORS.textPrimary }}>{v.id}</td>
                  <td style={{ padding:`${SPACING.sm + 2}px ${SPACING.xs}px`, color:COLORS.textMuted }}>Rp {v.baseline}M</td>
                  <td style={{ padding:`${SPACING.sm + 2}px ${SPACING.xs}px`, color:COLORS.textMuted }}>Rp {v.actual}M</td>
                  <td style={{ padding:`${SPACING.sm + 2}px ${SPACING.xs}px`, fontWeight:700, color:COLORS.primary }}>Rp {v.savings}M</td>
                  <td style={{ padding:`${SPACING.sm + 2}px ${SPACING.xs}px` }}>
                    <span style={{ background:"#DCFCE7", color:"#15803D", padding:"2px 8px", borderRadius:RADIUS.pill, fontSize:FONT.base, fontWeight:600 }}>
                      {v.pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


// ── [H4] BESS PAGE ──────────────────────────────────────────

const BESSPage = ({ isMobile }) => {
  const KPIs = [
    { label:"Total Capacity",    value:"500",       unit:"kWh",     color:COLORS.bess,    Icon:Battery      },
    { label:"Current SoC",       value:"65%",       unit:"",        sub:"Discharging mode",color:COLORS.bess,Icon:Activity     },
    { label:"Peak Shaving Savings",value:"Rp 113.6M",unit:"",      sub:"This month",     color:COLORS.primary,Icon:TrendingDown },
    { label:"Cycle Count Today", value:"1.2",       unit:"cycles",  color:COLORS.grid,    Icon:Zap          },
  ];

  const GREEN_LOOP = [
    { title:"☀ Solar → BESS",    desc:"Excess solar disimpan saat peak sun (08:00–16:00). Energi hijau tersedia 24 jam.",         val:"120 kWh hari ini", color:COLORS.solar },
    { title:"🔋 BESS → Building", desc:"Discharge saat peak tariff untuk mengurangi demand charge & meningkatkan cost efficiency.", val:"85 kWh hari ini",  color:COLORS.bess  },
    { title:"🔋 BESS → EV Fleet", desc:"Prioritas green energy untuk overnight EV charging (20:00–06:00). Maksimalkan Scope 1.",   val:"75 kWh hari ini",  color:COLORS.ev    },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* SoC Chart */}
      <Card>
        <SectionTitle
          title="State of Charge — Hari Ini"
          sub="Solar → BESS (08:00–16:00) · BESS discharge untuk Building & EV (malam)"
        />
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
          <AreaChart data={DATA_BESS_SOC} margin={{ right:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="t" tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} interval={isMobile ? 2 : 1} />
            <YAxis domain={[0, 100]} tick={{ fontSize:FONT.xs, fill:COLORS.textDisabled }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={v => [`${v}%`, "State of Charge"]} />
            <Area type="monotone" dataKey="soc" stroke={COLORS.bess} fill="#F0EEFF" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Live Status + Green Loop */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:SPACING.md }}>
        <Card>
          <SectionTitle title="BESS Live Status" />
          {[
            { l:"Operating Mode", v:"Discharging", badge:true },
            { l:"Current Output", v:"85 kW"        },
            { l:"Solar Input",    v:"49 kW"         },
            { l:"Temperature",    v:"28.4°C"        },
            { l:"Battery Health", v:"98.2%"         },
            { l:"Est. Full Charge",v:"16:20 today"  },
          ].map(item => (
            <div key={item.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:`${SPACING.sm}px 0`, borderBottom:`1px solid ${COLORS.bgPage}` }}>
              <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{item.l}</p>
              {item.badge
                ? <Badge status="Discharging" />
                : <p style={{ fontSize:FONT.md, fontWeight:600, color:COLORS.textPrimary }}>{item.v}</p>
              }
            </div>
          ))}
          <div style={{ marginTop:SPACING.md }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:FONT.base, marginBottom:SPACING.xs + 2 }}>
              <span style={{ color:COLORS.textMuted }}>State of Charge</span>
              <span style={{ color:COLORS.bess, fontWeight:700 }}>65%</span>
            </div>
            <div style={{ height:10, borderRadius:RADIUS.pill, background:"#F0EEFF" }}>
              <div style={{ height:"100%", borderRadius:RADIUS.pill, width:"65%", background:COLORS.bess }} />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Green Energy Loop" sub="Bagaimana BESS menghubungkan Solar PV dan EV Fleet" />
          {GREEN_LOOP.map(item => (
            <div key={item.title} style={{
              padding      : SPACING.md,
              borderRadius : RADIUS.lg,
              background   : item.color + "0D",
              border       : `1px solid ${item.color}25`,
              marginBottom : SPACING.sm,
            }}>
              <p style={{ fontSize:FONT.md,   fontWeight:700, color:item.color, marginBottom:5 }}>{item.title}</p>
              <p style={{ fontSize:FONT.base, color:COLORS.textSecondary, lineHeight:1.5, marginBottom:SPACING.sm }}>{item.desc}</p>
              <p style={{ fontSize:FONT.lg,   fontWeight:700, color:COLORS.textPrimary }}>{item.val}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};


// ── [H5] ESG REPORT PAGE ────────────────────────────────────

const ESGPage = ({ isMobile }) => {
  const KPIs = [
    { label:"Total CO2e Avoided",  value:"675.38", unit:"tCO2e", sub:"Scope 1 + Scope 2",      color:COLORS.primary, Icon:Leaf         },
    { label:"Renewable Energy %",  value:"0.71%",  unit:"",      sub:"of total building load",  color:COLORS.ev,      Icon:Sun          },
    { label:"Fuel Displaced",      value:"9,334",  unit:"liters",sub:"diesel equivalent",        color:COLORS.grid,    Icon:Zap          },
    { label:"Local Workforce",     value:"42",     unit:"orang", sub:"installation + O&M",       color:COLORS.bess,    Icon:Users        },
  ];

  const ESG_PILLARS = [
    {
      cat  : "Environmental",
      color: COLORS.primary,
      items: [
        { l:"Scope 1 Avoided (EV)",    v:"25.0 tCO2e"    },
        { l:"Scope 2 Avoided (Solar)", v:"650.38 tCO2e"  },
        { l:"Fuel Displaced",          v:"9,334 L"        },
        { l:"Trees Equivalent",        v:"889 trees"      },
      ],
    },
    {
      cat  : "Social",
      color: COLORS.ev,
      items: [
        { l:"Installation Workers", v:"39 orang" },
        { l:"O&M Workers",          v:"3 orang"  },
        { l:"Local Employment",     v:"87%"       },
        { l:"Training Hours",       v:"240 jam"   },
      ],
    },
    {
      cat  : "Governance",
      color: COLORS.bess,
      items: [
        { l:"Reporting Frequency",  v:"Real-time"   },
        { l:"3rd Party Validation", v:"In Progress" },
        { l:"Audit Trail",          v:"Complete"    },
        { l:"Next Report",          v:"Q2 2026"     },
      ],
    },
  ];

  const SDGs = [
    { sdg:"SDG 7",  l:"Affordable & Clean Energy",   c:"#F59E0B" },
    { sdg:"SDG 9",  l:"Industry & Innovation",        c:"#0EA5E9" },
    { sdg:"SDG 11", l:"Sustainable Cities",            c:"#8B5CF6" },
    { sdg:"SDG 12", l:"Responsible Consumption",       c:COLORS.primary },
    { sdg:"SDG 13", l:"Climate Action",                c:"#EF4444" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* Trend Chart */}
      <Card>
        <SectionTitle title="CO2e Avoided & Fuel Displaced — Monthly Trend" sub="Okt 2025 – Apr 2026" />
        <div style={{ display:"flex", gap:SPACING.lg, marginBottom:SPACING.sm + 2, fontSize:FONT.base, color:COLORS.textMuted }}>
          <span><span style={{ display:"inline-block", width:12, borderTop:`2px solid ${COLORS.primary}`, marginRight:4, verticalAlign:"middle" }}/>CO2e (ton)</span>
          <span><span style={{ display:"inline-block", width:12, borderTop:"2px solid #F59E0B", marginRight:4, verticalAlign:"middle" }}/>Fuel (×10 L)</span>
        </div>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 180}>
          <AreaChart data={DATA_ESG_MONTHLY} margin={{ right:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="m" tick={{ fontSize:FONT.sm, fill:COLORS.textDisabled }} />
            <YAxis tick={{ fontSize:FONT.sm, fill:COLORS.textDisabled }} />
            <Tooltip />
            <Area type="monotone" dataKey="co2"  name="CO2e (ton)"   stroke={COLORS.primary} fill="#E8F5EE" strokeWidth={2} />
            <Area type="monotone" dataKey="fuel" name="Fuel (×10 L)" stroke={COLORS.grid}   fill="#FEF3C7" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* ESG Pillars + SDG */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:SPACING.md }}>
        <Card>
          <SectionTitle title="ESG Summary — Q1 2026" sub="Environmental · Social · Governance" />
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:SPACING.sm + 2 }}>
            {ESG_PILLARS.map(pillar => (
              <div key={pillar.cat} style={{ padding:SPACING.md, borderRadius:RADIUS.lg, background:pillar.color+"08", border:`1px solid ${pillar.color}20` }}>
                <p style={{ fontSize:FONT.md, fontWeight:700, color:pillar.color, marginBottom:SPACING.sm }}>{pillar.cat}</p>
                {pillar.items.map(item => (
                  <div key={item.l} style={{ display:"flex", justifyContent:"space-between", padding:`${SPACING.xs + 3}px 0`, borderBottom:`1px solid ${pillar.color}15` }}>
                    <p style={{ fontSize:FONT.base, color:COLORS.textMuted }}>{item.l}</p>
                    <p style={{ fontSize:FONT.base, fontWeight:600, color:COLORS.textPrimary }}>{item.v}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="SDG Alignment" />
          {SDGs.map(s => (
            <div key={s.sdg} style={{ display:"flex", alignItems:"center", gap:SPACING.sm + 2, padding:`${SPACING.sm}px 0`, borderBottom:`1px solid ${COLORS.bgPage}` }}>
              <span style={{ fontSize:FONT.xs, fontWeight:700, padding:"3px 7px", borderRadius:RADIUS.pill, background:s.c, color:"#fff", flexShrink:0 }}>
                {s.sdg}
              </span>
              <p style={{ fontSize:FONT.base, color:COLORS.textPrimary }}>{s.l}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};


// ── [H6] BILLING PAGE ───────────────────────────────────────

const BillingPage = ({ isMobile }) => {
  const KPIs = [
    { label:"Current Outstanding",       value:"Rp 294.8M", unit:"", sub:"EV Fleet + Solar — Apr 2026", color:COLORS.ev,      Icon:CreditCard  },
    { label:"Cumulative Savings",        value:"Rp 1.18B",  unit:"", sub:"Total 6-month savings",        color:COLORS.primary, Icon:TrendingDown },
    { label:"Next Payment Due",          value:"15 Mei",    unit:"2026", sub:"",                          color:COLORS.grid,    Icon:Clock        },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:SPACING.md + 2 }}>

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:SPACING.sm + 2 }}>
        {KPIs.map(kpi => <KPI key={kpi.label} {...kpi} />)}
      </div>

      {/* Billing Table */}
      <Card>
        <SectionTitle title="Riwayat Pembayaran — 6 Bulan Terakhir" sub="Solar PV + EV Fleet + BESS combined invoices" />
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", fontSize:FONT.md, borderCollapse:"collapse", minWidth:isMobile ? 400 : 0 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${COLORS.border}` }}>
                {["Periode","Layanan","Invoice","Status","Savings vs Fossil"].map(h => (
                  <th key={h} style={{ padding:`${SPACING.sm}px ${SPACING.xs + 2}px`, textAlign:"left", fontWeight:500, color:COLORS.textMuted, fontSize:FONT.base }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATA_BILLING_HISTORY.map(row => (
                <tr key={row.period} style={{ borderBottom:`1px solid ${COLORS.bgPage}` }}>
                  <td style={{ padding:`${SPACING.sm + 3}px ${SPACING.xs + 2}px`, fontWeight:600, color:COLORS.textPrimary }}>{row.period}</td>
                  <td style={{ padding:`${SPACING.sm + 3}px ${SPACING.xs + 2}px`, color:COLORS.textMuted }}>{row.service}</td>
                  <td style={{ padding:`${SPACING.sm + 3}px ${SPACING.xs + 2}px`, fontWeight:700, color:COLORS.textPrimary }}>{row.amount}</td>
                  <td style={{ padding:`${SPACING.sm + 3}px ${SPACING.xs + 2}px` }}><Badge status={row.status} /></td>
                  <td style={{ padding:`${SPACING.sm + 3}px ${SPACING.xs + 2}px`, fontWeight:700, color:COLORS.primary }}>{row.saving}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Savings Banner */}
      <Card style={{ background:"#F0FDF4", border:"1px solid #86EFAC" }}>
        <div style={{ display:"flex", alignItems:"center", gap:SPACING.md }}>
          <span style={{ fontSize:22 }}>💡</span>
          <div>
            <p style={{ fontSize:FONT.lg, fontWeight:700, color:"#15803D", marginBottom:4 }}>
              Total 6-Month Savings: Rp 1.18B
            </p>
            <p style={{ fontSize:FONT.base, color:"#166534", lineHeight:1.6 }}>
              Dengan ekosistem SUN Group (Solar PV + EV Fleet + BESS), bisnis Anda menghemat Rp 1.18 miliar dalam 6 bulan — setara 675 tCO2e emisi gas rumah kaca yang dihindari.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// [I] NAVIGATION CONFIG
//     Tambah/hapus menu di sini
// ─────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id:"overview", label:"Overview",   Icon:LayoutDashboard },
  { id:"solar",    label:"Solar PV",   Icon:Sun             },
  { id:"ev",       label:"EV Fleet",   Icon:Truck           },
  { id:"bess",     label:"BESS",       Icon:Battery         },
  { id:"esg",      label:"ESG Report", Icon:Leaf            },
  { id:"billing",  label:"Billing",    Icon:CreditCard      },
];

// Metadata per halaman (judul & subtitle di topbar)
const PAGE_META = {
  overview : { title:"Overview",    sub:`${BRAND.siteName} — Solar PV · EV Fleet · BESS Unified`         },
  solar    : { title:"Solar PV",    sub:`Live monitoring · ${BRAND.siteName} · Inverter: Huawei`          },
  ev       : { title:"EV Fleet",    sub:"Baseline BBM vs aktual · 96 kendaraan · 30 hari terakhir"        },
  bess     : { title:"BESS",        sub:`Battery Energy Storage · 500 kWh · ${BRAND.siteName}`            },
  esg      : { title:"ESG Report",  sub:"Environmental, Social & Governance — Q1 2026"                    },
  billing  : { title:"Billing",     sub:"Riwayat invoice & payment tracking"                              },
};


// ─────────────────────────────────────────────────────────────
// [J] LOGIN PAGE
// ─────────────────────────────────────────────────────────────

// Credentials — edit atau tambah user di sini
// PERHATIAN: Untuk production, validasi harus di backend
const VALID_USERS = [
  { email:"demo", password:"demo" },
  { email:"admin@sungroup.co.id",   password:"Admin@2026"     },
  { email:"demo@sungroup.co.id",    password:"demo123"        },
];

const LoginPage = ({ onLogin }) => {
  const { isMobile } = useBreakpoint();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

const handleLogin = () => {
  // Tetap wajib isi form, tapi isinya bebas
  if (!email || !password) {
    setError("Email dan password wajib diisi.");
    return;
  }

  // DEMO MODE:
  // Semua input diterima, tidak ada validasi credential
  setError("");
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    onLogin(email);
  }, 600);
};
  // Stat cards di panel kiri login
  const LOGIN_STATS = [
    { label:"Total Savings",    val:"Rp 892.4M", icon:"💰" },
    { label:"CO2e Avoided",     val:"675 tCO2e", icon:"🌿" },
    { label:"EV Fleet",         val:"96 units",  icon:"🚌" },
    { label:"Solar Capacity",   val:"794 kWp",   icon:"☀" },
  ];

  // Sistem terintegrasi chips di panel kiri
  const SYSTEM_CHIPS = [
    { Icon:Sun,     label:"Solar PV",   color:COLORS.solar },
    { Icon:Truck,   label:"EV Fleet",   color:COLORS.ev    },
    { Icon:Battery, label:"BESS",       color:COLORS.bess  },
    { Icon:Leaf,    label:"ESG Report", color:"#34D399"    },
  ];

  const inputStyle = {
    width        : "100%",
    padding      : `${SPACING.sm + 3}px ${SPACING.md + 1}px`,
    borderRadius : RADIUS.lg,
    border       : `1.5px solid ${COLORS.border}`,
    background   : COLORS.bgCard,
    fontSize     : FONT.lg,
    color        : COLORS.textPrimary,
    outline      : "none",
    boxSizing    : "border-box",
    fontFamily   : FONT.family,
    transition   : "border-color 0.15s",
  };

  return (
    <div style={{
      display       : "flex",
      flexDirection : isMobile ? "column" : "row",
      minHeight     : "100vh",
      fontFamily    : FONT.family,
    }}>

      {/* ── Left / Top Panel ── */}
      <div style={{
        flex       : isMobile ? 0 : 1,
        background : COLORS.navy,
        display    : "flex",
        flexDirection:"column",
        justifyContent:"space-between",
        padding    : isMobile ? `${SPACING.xxl}px ${SPACING.xl}px` : `${SPACING.xxxl}px ${SPACING.xxxl + 8}px`,
        position   : "relative",
        overflow   : "hidden",
      }}>
        {/* Decorative rings */}
        <div style={{ position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",border:"1px solid #ffffff08",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",border:"1px solid #ffffff05",pointerEvents:"none" }}/>

        {/* Logo */}
        <Logo size={BRAND.logoSize} lightText />

        {/* Hero text */}
        <div>
          <div style={{
            display     : "inline-flex",
            alignItems  : "center",
            gap         : 6,
            padding     : "5px 12px",
            borderRadius: RADIUS.pill,
            background  : COLORS.primary + "22",
            border      : `1px solid ${COLORS.primary}44`,
            marginBottom: SPACING.xl,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:COLORS.primary }} />
            <span style={{ color:COLORS.primary, fontSize:FONT.sm, fontWeight:600, letterSpacing:"0.04em" }}>
              INTEGRATED CLEAN ENERGY PLATFORM
            </span>
          </div>
          <h1 style={{ color:"#fff", fontSize:isMobile ? 22 : 30, fontWeight:700, lineHeight:1.25, marginBottom:SPACING.md }}>
            Satu Dashboard.<br />
            <span style={{ color:COLORS.primary }}>Seluruh Ekosistem Energi.</span>
          </h1>
          <p style={{ color:"#6B8FA8", fontSize:FONT.lg, lineHeight:1.7, maxWidth:380 }}>
            Monitor Solar PV, EV Fleet, dan BESS dalam satu tampilan terintegrasi. Dari data operasional hingga laporan ESG — semuanya real-time.
          </p>
        </div>

        {/* Stat cards */}
        {!isMobile && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:SPACING.sm + 2 }}>
            {LOGIN_STATS.map(s => (
              <div key={s.label} style={{ padding:`${SPACING.md}px ${SPACING.md + 2}px`, borderRadius:RADIUS.lg, background:COLORS.navyDark, border:`1px solid #1E3048`, display:"flex", alignItems:"center", gap:SPACING.sm + 2 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <div>
                  <p style={{ color:"#4A7A9B", fontSize:FONT.sm, marginBottom:2 }}>{s.label}</p>
                  <p style={{ color:"#fff", fontSize:FONT.xl, fontWeight:700 }}>{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* System chips */}
        {!isMobile && (
          <div>
            <p style={{ color:"#4A7A9B", fontSize:FONT.sm, marginBottom:SPACING.sm, letterSpacing:"0.04em" }}>SISTEM TERINTEGRASI</p>
            <div style={{ display:"flex", gap:SPACING.sm, flexWrap:"wrap" }}>
              {SYSTEM_CHIPS.map(({ Icon: Ic, label, color }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:SPACING.xs + 2, padding:"5px 10px", borderRadius:RADIUS.pill, background:color+"18", border:`1px solid ${color}30` }}>
                  <Ic size={11} color={color} />
                  <span style={{ color, fontSize:FONT.base, fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security badge */}
        <div style={{ display:"flex", alignItems:"center", gap:SPACING.xs + 2 }}>
          <Shield size={11} color="#4A7A9B" />
          <p style={{ color:"#4A7A9B", fontSize:FONT.base }}>Secured · ISO 27001 · Data diproses secara lokal</p>
        </div>
      </div>

      {/* ── Right / Bottom Panel (Form) ── */}
      <div style={{
        width          : isMobile ? "100%" : 440,
        background     : COLORS.bgPage,
        display        : "flex",
        alignItems     : isMobile ? "flex-start" : "center",
        justifyContent : "center",
        padding        : isMobile ? `${SPACING.xxl}px ${SPACING.xl}px` : `${SPACING.xxxl}px ${SPACING.xxxl + 8}px`,
        minHeight      : isMobile ? "auto" : "100vh",
      }}>
        <div style={{ width:"100%", maxWidth:380 }}>

          {/* Form header */}
          <div style={{ marginBottom:SPACING.xxl + 4 }}>
            <p style={{ fontSize:FONT.h1, fontWeight:700, color:COLORS.textPrimary, marginBottom:SPACING.xs + 2 }}>
              Selamat datang 👋
            </p>
            <p style={{ fontSize:FONT.lg, color:COLORS.textMuted }}>
              Masuk ke akun {BRAND.name} Anda untuk melanjutkan.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div style={{ padding:`${SPACING.sm + 2}px ${SPACING.md}px`, borderRadius:RADIUS.lg, background:"#FEF2F2", border:"1px solid #FECACA", marginBottom:SPACING.md, display:"flex", alignItems:"center", gap:SPACING.sm }}>
              <span style={{ fontSize:FONT.lg }}>⚠</span>
              <p style={{ fontSize:FONT.base, color:"#DC2626" }}>{error}</p>
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom:SPACING.md }}>
            <label style={{ display:"block", fontSize:FONT.md, fontWeight:600, color:COLORS.textPrimary, marginBottom:SPACING.xs + 2 }}>
              Email
            </label>
            <input
              type="email"
              placeholder={`nama@${BRAND.name.toLowerCase().replace(" ","")+".co.id"}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e  => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom:SPACING.xs + 2 }}>
            <label style={{ display:"block", fontSize:FONT.md, fontWeight:600, color:COLORS.textPrimary, marginBottom:SPACING.xs + 2 }}>
              Password
            </label>
            <div style={{ position:"relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ ...inputStyle, paddingRight:40 }}
                onFocus={e => e.target.style.borderColor = COLORS.primary}
                onBlur={e  => e.target.style.borderColor = COLORS.border}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:COLORS.textMuted, padding:2 }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:SPACING.xxl }}>
            <button style={{ background:"none", border:"none", fontSize:FONT.md, color:COLORS.primary, cursor:"pointer", fontWeight:500, padding:0 }}>
              Lupa password?
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            style={{
              width          : "100%",
              padding        : `${SPACING.md + 1}px`,
              borderRadius   : RADIUS.lg,
              border         : "none",
              background     : loading ? "#4CB87A" : COLORS.primary,
              color          : "#fff",
              fontSize       : FONT.lg,
              fontWeight     : 700,
              cursor         : loading ? "not-allowed" : "pointer",
              display        : "flex",
              alignItems     : "center",
              justifyContent : "center",
              gap            : SPACING.sm,
              fontFamily     : FONT.family,
              transition     : "background 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width:13, height:13, border:"2px solid #ffffff55", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }} />
                Memverifikasi...
              </>
            ) : (
              <> Masuk ke Dashboard <ChevronRight size={15} /> </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:SPACING.sm + 2, margin:`${SPACING.xxl}px 0` }}>
            <div style={{ flex:1, height:1, background:COLORS.border }} />
            <span style={{ fontSize:FONT.base, color:COLORS.textDisabled }}>atau</span>
            <div style={{ flex:1, height:1, background:COLORS.border }} />
          </div>

          {/* SSO button */}
          <button style={{
            width          : "100%",
            padding        : `${SPACING.md}px`,
            borderRadius   : RADIUS.lg,
            border         : `1.5px solid ${COLORS.border}`,
            background     : COLORS.bgCard,
            fontSize       : FONT.lg,
            color          : COLORS.textPrimary,
            cursor         : "pointer",
            fontWeight     : 500,
            display        : "flex",
            alignItems     : "center",
            justifyContent : "center",
            gap            : SPACING.sm,
            fontFamily     : FONT.family,
          }}>
            <span style={{ fontSize:16 }}>🔐</span> Masuk dengan SSO Perusahaan
          </button>

          {/* Footer */}
          <p style={{ textAlign:"center", fontSize:FONT.sm, color:COLORS.textDisabled, marginTop:SPACING.xxxl }}>
            © {BRAND.year} {BRAND.name} ·{" "}
            <span style={{ color:COLORS.primary, cursor:"pointer" }}>Kebijakan Privasi</span> ·{" "}
            <span style={{ color:COLORS.primary, cursor:"pointer" }}>Syarat Penggunaan</span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// [K] DASHBOARD SHELL
//     Layout utama setelah login (Sidebar + Topbar + Content)
// ─────────────────────────────────────────────────────────────

const Dashboard = ({ onLogout, userName }) => {
  const [page, setPage] = useState("overview");
  const { isMobile, isTablet } = useBreakpoint();
  const { title, sub } = PAGE_META[page];

  // ── Mobile Layout ─────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:FONT.family, fontSize:FONT.lg, background:COLORS.bgPage }}>

        {/* Mobile Top Bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`${SPACING.md}px ${SPACING.lg}px`, background:COLORS.navy, flexShrink:0 }}>
          <Logo size={22} lightText />
          <div style={{ display:"flex", alignItems:"center", gap:SPACING.sm }}>
            <div style={{ padding:`${SPACING.xs}px ${SPACING.sm + 2}px`, borderRadius:RADIUS.sm, background:COLORS.navyDark, color:"#6B8FA8", fontSize:FONT.sm }}>
              {BRAND.siteName}
            </div>
            <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", color:"#4A7A9B", padding:2 }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Page Header */}
        <div style={{ padding:`${SPACING.md}px ${SPACING.lg}px ${SPACING.sm}px`, background:"#fff", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
          <p style={{ fontSize:FONT.xl,   fontWeight:700, color:COLORS.textPrimary, lineHeight:1 }}>{title}</p>
          <p style={{ fontSize:FONT.sm,   color:COLORS.textMuted, marginTop:2 }}>{sub}</p>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex:1, overflowY:"auto", padding:`${SPACING.md}px ${SPACING.md}px`, paddingBottom:70 }}>
          {page === "overview" && <OverviewPage setPage={setPage} isMobile />}
          {page === "solar"    && <SolarPage    isMobile />}
          {page === "ev"       && <EVPage       isMobile />}
          {page === "bess"     && <BESSPage     isMobile />}
          {page === "esg"      && <ESGPage      isMobile />}
          {page === "billing"  && <BillingPage  isMobile />}
        </div>

        {/* Mobile Bottom Navigation */}
        <div style={{
          position   : "fixed",
          bottom     : 0,
          left       : 0,
          right      : 0,
          background : COLORS.navy,
          borderTop  : "1px solid #1E3048",
          display    : "flex",
          justifyContent: "space-around",
          padding    : `${SPACING.xs + 2}px 0 ${SPACING.sm}px`,
          zIndex     : 100,
        }}>
          {NAV_ITEMS.map(({ id, label, Icon: Ic }) => {
            const active = page === id;
            return (
              <button key={id} onClick={() => setPage(id)} style={{
                display       : "flex",
                flexDirection : "column",
                alignItems    : "center",
                gap           : 2,
                padding       : `${SPACING.xs}px ${SPACING.sm}px`,
                background    : "none",
                border        : "none",
                cursor        : "pointer",
                color         : active ? COLORS.primary : "#4A7A9B",
                flex          : 1,
              }}>
                <Ic size={16} />
                <span style={{ fontSize:FONT.xs, fontWeight:active ? 600 : 400, lineHeight:1 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Desktop / Tablet Layout ───────────────────────────────
  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:FONT.family, fontSize:FONT.lg, background:COLORS.bgPage, overflow:"hidden" }}>

      {/* Sidebar */}
      <div style={{ width:isTablet ? 180 : 210, flexShrink:0, background:COLORS.navy, display:"flex", flexDirection:"column", height:"100%" }}>

        {/* Logo area */}
        <div style={{ padding:`${SPACING.lg + 2}px ${SPACING.lg + 2}px ${SPACING.lg}px`, borderBottom:"1px solid #1E3048" }}>
          <Logo size={BRAND.logoSize} lightText />
        </div>

        {/* Active site chip */}
        <div style={{ margin:`${SPACING.md}px ${SPACING.md}px 0`, padding:`${SPACING.sm + 2}px ${SPACING.md}px`, borderRadius:RADIUS.lg, background:COLORS.navyDark, border:"1px solid #1E3048" }}>
          <p style={{ color:"#6B8FA8", fontSize:FONT.sm, marginBottom:2 }}>Active Site</p>
          <p style={{ color:"#fff",   fontSize:FONT.md, fontWeight:600 }}>{BRAND.siteName}</p>
          <p style={{ color:COLORS.primary, fontSize:FONT.sm, marginTop:2 }}>● {BRAND.tierName}</p>
        </div>

        {/* Navigation menu */}
        <nav style={{ flex:1, padding:`${SPACING.md}px ${SPACING.sm + 2}px`, display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {NAV_ITEMS.map(({ id, label, Icon: Ic }) => {
            const active = page === id;
            return (
              <button key={id} onClick={() => setPage(id)} style={{
                display    : "flex",
                alignItems : "center",
                gap        : SPACING.sm + 2,
                padding    : `${SPACING.sm + 1}px ${SPACING.sm + 2}px`,
                borderRadius: RADIUS.md,
                textAlign  : "left",
                cursor     : "pointer",
                border     : "none",
                borderLeft : `3px solid ${active ? COLORS.primary : "transparent"}`,
                background : active ? COLORS.primary + "1E" : "transparent",
                color      : active ? COLORS.primary : COLORS.bgSidebar,
                width      : "100%",
                fontFamily : FONT.family,
                transition : "all 0.15s",
              }}>
                <Ic size={15} />
                <span style={{ fontSize:FONT.lg, fontWeight:active ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & logout */}
        <div style={{ padding:`${SPACING.md}px ${SPACING.lg}px`, borderTop:"1px solid #1E3048", display:"flex", alignItems:"center", gap:SPACING.sm + 2 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"#1E3048", display:"flex", alignItems:"center", justifyContent:"center", fontSize:FONT.md, fontWeight:700, color:COLORS.primary, flexShrink:0 }}>
            {userName ? userName[0].toUpperCase() : "F"}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ color:"#fff", fontSize:FONT.md, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {userName || "Fakhri"}
            </p>
            <p style={{ color:"#6B8FA8", fontSize:FONT.sm }}>Marketing & ESG</p>
          </div>
          <button onClick={onLogout} title="Keluar" style={{ background:"none", border:"none", cursor:"pointer", color:"#4A7A9B", padding:2, flexShrink:0 }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`${SPACING.md}px ${SPACING.xxl}px`, background:"#fff", borderBottom:`1px solid ${COLORS.border}`, flexShrink:0 }}>
          <div>
            <p style={{ fontSize:FONT.xxl, fontWeight:700, color:COLORS.textPrimary, lineHeight:1 }}>{title}</p>
            <p style={{ fontSize:FONT.base, color:COLORS.textMuted, marginTop:4 }}>{sub}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:SPACING.sm + 2 }}>
            <div style={{ padding:`${SPACING.xs + 2}px ${SPACING.md}px`, borderRadius:RADIUS.md, background:COLORS.bgPage, color:COLORS.textSecondary, fontSize:FONT.base }}>
              📅 27 Apr 2026
            </div>
            <button style={{ padding:`${SPACING.xs + 2}px ${SPACING.md + 2}px`, borderRadius:RADIUS.md, background:COLORS.primary, color:"#fff", border:"none", fontSize:FONT.md, fontWeight:600, cursor:"pointer", fontFamily:FONT.family }}>
              ↑ Export Report
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1, overflowY:"auto", padding:`${SPACING.xl}px ${SPACING.xxl}px` }}>
          {page === "overview" && <OverviewPage setPage={setPage} isMobile={false} />}
          {page === "solar"    && <SolarPage    isMobile={false} />}
          {page === "ev"       && <EVPage       isMobile={false} />}
          {page === "bess"     && <BESSPage     isMobile={false} />}
          {page === "esg"      && <ESGPage      isMobile={false} />}
          {page === "billing"  && <BillingPage  isMobile={false} />}
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────
// [L] ROOT APP — Entry point utama
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,   setUserName]   = useState("");

  const handleLogin  = (email) => { setUserName(email.split("@")[0]); setIsLoggedIn(true); };
  const handleLogout = ()      => { setIsLoggedIn(false); setUserName(""); };

  return isLoggedIn
    ? <Dashboard onLogout={handleLogout} userName={userName} />
    : <LoginPage onLogin={handleLogin} />;
}
