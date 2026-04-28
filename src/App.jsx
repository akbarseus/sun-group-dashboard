import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  Sun, Battery, Truck, Leaf, CreditCard, LayoutDashboard,
  Zap, Activity, TrendingDown, Clock, Users, Eye, EyeOff,
  LogOut, Shield, ChevronRight
} from "lucide-react";

const G = "#00ab4e";
const NAVY = "#143341";
const DARK = "#162435";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const hourlyData = [
  {h:"00:00",grid:6800,solar:0},{h:"02:00",grid:6600,solar:0},{h:"04:00",grid:6400,solar:0},
  {h:"06:00",grid:6200,solar:5},{h:"07:00",grid:6100,solar:15},{h:"08:00",grid:5900,solar:28},
  {h:"09:00",grid:5700,solar:38},{h:"10:00",grid:5500,solar:45},{h:"11:00",grid:5400,solar:49},
  {h:"12:00",grid:5350,solar:49},{h:"13:00",grid:5380,solar:47},{h:"14:00",grid:5420,solar:44},
  {h:"15:00",grid:5600,solar:40},{h:"16:00",grid:5900,solar:30},{h:"17:00",grid:6200,solar:15},
  {h:"18:00",grid:6500,solar:3},{h:"20:00",grid:6800,solar:0},{h:"22:00",grid:6872,solar:0},
];
const monthlyProd = [
  {m:"Jan",v:72},{m:"Feb",v:78},{m:"Mar",v:80},{m:"Apr",v:82},{m:"May",v:85},
  {m:"Jun",v:88},{m:"Jul",v:86},{m:"Aug",v:84},{m:"Sep",v:80},{m:"Oct",v:76},{m:"Nov",v:74},{m:"Dec",v:72},
];
const costData = [
  {d:"29 Mar",b:95,a:30},{d:"1 Apr",b:92,a:28},{d:"4 Apr",b:88,a:27},{d:"7 Apr",b:90,a:29},
  {d:"10 Apr",b:85,a:26},{d:"13 Apr",b:87,a:28},{d:"16 Apr",b:92,a:30},{d:"19 Apr",b:89,a:27},
  {d:"22 Apr",b:88,a:26},{d:"25 Apr",b:91,a:29},{d:"27 Apr",b:90,a:28},
];
const bessData = [
  {t:"00:00",soc:85},{t:"02:00",soc:78},{t:"04:00",soc:70},{t:"06:00",soc:62},
  {t:"08:00",soc:68},{t:"10:00",soc:75},{t:"12:00",soc:82},{t:"14:00",soc:90},
  {t:"16:00",soc:88},{t:"18:00",soc:80},{t:"20:00",soc:73},{t:"22:00",soc:68},{t:"23:00",soc:65},
];
const esgMonthly = [
  {m:"Oct",co2:52,fuel:78},{m:"Nov",co2:55,fuel:82},{m:"Dec",co2:58,fuel:86},
  {m:"Jan",co2:60,fuel:89},{m:"Feb",co2:57,fuel:84},{m:"Mar",co2:62,fuel:92},{m:"Apr",co2:65,fuel:95},
];
const savingsBreakdown = [
  {name:"Solar PV vs PLN",value:287,color:G},
  {name:"EV vs Diesel",value:196,color:"#0EA5E9"},
  {name:"BESS Peak Shaving",value:114,color:"#8B5CF6"},
];
const topVehicles = [
  {id:"BYD M6 ADU 014",b:114.4,a:34.3,s:80.1,p:73},
  {id:"JAC T9 NYZ 007",b:117.4,a:35.2,s:82.2,p:71},
  {id:"Sany SYZ IKL 003",b:113.6,a:34.1,s:79.5,p:72},
  {id:"Chery J6T NYZ 010",b:111.1,a:33.3,s:77.8,p:71},
  {id:"Sany 965 NYZ 016",b:103.9,a:31.2,s:72.7,p:73},
];
const billingHistory = [
  {period:"Apr 2026",service:"EV Fleet + Solar PV",amount:"Rp 294.8M",status:"Due",saving:"Rp 196.4M"},
  {period:"Mar 2026",service:"EV Fleet + Solar PV",amount:"Rp 287.3M",status:"Paid",saving:"Rp 189.1M"},
  {period:"Feb 2026",service:"EV Fleet + Solar PV",amount:"Rp 301.2M",status:"Paid",saving:"Rp 205.6M"},
  {period:"Jan 2026",service:"EV + Solar + BESS",amount:"Rp 312.5M",status:"Paid",saving:"Rp 218.3M"},
  {period:"Dec 2025",service:"EV + Solar + BESS",amount:"Rp 298.7M",status:"Paid",saving:"Rp 197.8M"},
  {period:"Nov 2025",service:"EV Fleet + Solar PV",amount:"Rp 276.4M",status:"Paid",saving:"Rp 178.2M"},
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{background:"#fff",borderRadius:12,border:"1px solid #E5EAF0",padding:"16px 18px",...style}}>
    {children}
  </div>
);
const KPI = ({ label, value, unit, sub, color=G, Icon }) => (
  <Card>
    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
      <div style={{background:color+"18",borderRadius:8,padding:8,flexShrink:0}}>
        <Icon size={16} color={color}/>
      </div>
      <div style={{minWidth:0,flex:1}}>
        <p style={{fontSize:11,color:"#9BA8B5",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</p>
        <p style={{fontSize:20,fontWeight:700,color:"#1A2332",lineHeight:1}}>
          {value}<span style={{fontSize:12,fontWeight:400,color:"#9BA8B5",marginLeft:4}}>{unit}</span>
        </p>
        {sub&&<p style={{fontSize:11,color:"#6B7A8D",marginTop:4}}>{sub}</p>}
      </div>
    </div>
  </Card>
);
const Badge = ({ status }) => {
  const cfg={
    Normal:{bg:"#DCFCE7",color:"#15803D",dot:"#22C55E"},
    Charging:{bg:"#DBEAFE",color:"#1D4ED8",dot:"#3B82F6"},
    "In Maintenance":{bg:"#FEF3C7",color:"#B45309",dot:"#F59E0B"},
    Offline:{bg:"#F3F4F6",color:"#6B7280",dot:"#9CA3AF"},
    Discharging:{bg:"#F0EEFF",color:"#7C3AED",dot:"#8B5CF6"},
    Due:{bg:"#FEF3C7",color:"#B45309",dot:"#F59E0B"},
    Paid:{bg:"#DCFCE7",color:"#15803D",dot:"#22C55E"},
  }[status]||{bg:"#F3F4F6",color:"#6B7280",dot:"#9CA3AF"};
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,
      background:cfg.bg,color:cfg.color,fontSize:11,fontWeight:500}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:cfg.dot,flexShrink:0}}/>
      {status}
    </span>
  );
};
const SectionTitle = ({ title, sub }) => (
  <div style={{marginBottom:12}}>
    <p style={{fontSize:13,fontWeight:600,color:"#1A2332",marginBottom:2}}>{title}</p>
    {sub&&<p style={{fontSize:11,color:"#9BA8B5"}}>{sub}</p>}
  </div>
);

// ─── Energy Flow ──────────────────────────────────────────────────────────────
const EnergyFlow = () => (
  <Card style={{padding:"16px 18px"}}>
    <SectionTitle title="Energy Flow — Real-time" sub="How clean energy moves across your ecosystem"/>
    <svg viewBox="0 0 700 180" width="100%" style={{overflow:"visible",display:"block"}}>
      <defs>
        {[["ag",G],["ap","#8B5CF6"],["ab","#F59E0B"],["ac","#0EA5E9"]].map(([id,fill])=>(
          <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={fill}/>
          </marker>
        ))}
      </defs>
      <rect x="10" y="55" width="110" height="75" rx="10" fill="#E8F5EE" stroke={G} strokeWidth="1.5"/>
      <text x="65" y="82" textAnchor="middle" fill={G} fontSize="11" fontWeight="600">☀ Solar PV</text>
      <text x="65" y="100" textAnchor="middle" fill="#1A2332" fontSize="15" fontWeight="700">49.09 kW</text>
      <text x="65" y="118" textAnchor="middle" fill="#6B7A8D" fontSize="10">794 kWp installed</text>
      <path d="M120 92 L175 92" stroke={G} strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ag)"/>
      <text x="147" y="86" textAnchor="middle" fill={G} fontSize="9">charge</text>
      <rect x="175" y="45" width="120" height="95" rx="10" fill="#F0EEFF" stroke="#8B5CF6" strokeWidth="1.5"/>
      <text x="235" y="73" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="600">🔋 BESS</text>
      <text x="235" y="95" textAnchor="middle" fill="#1A2332" fontSize="15" fontWeight="700">65% SoC</text>
      <text x="235" y="113" textAnchor="middle" fill="#6B7A8D" fontSize="10">500 kWh capacity</text>
      <text x="235" y="129" textAnchor="middle" fill="#8B5CF6" fontSize="9">Discharging: 85 kW</text>
      <rect x="175" y="155" width="120" height="20" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1"/>
      <text x="235" y="169" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="600">⚡ PLN Grid — 6,872 kW</text>
      <path d="M295 92 L365 92" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ap)"/>
      <text x="330" y="86" textAnchor="middle" fill="#8B5CF6" fontSize="9">discharge</text>
      <path d="M295 165 C340 165 360 120 365 108" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ab)"/>
      <rect x="365" y="42" width="130" height="95" rx="10" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5"/>
      <text x="430" y="70" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="600">🏭 Building</text>
      <text x="430" y="90" textAnchor="middle" fill="#1A2332" fontSize="15" fontWeight="700">6,921 kW</text>
      <text x="430" y="108" textAnchor="middle" fill="#6B7A8D" fontSize="10">total load</text>
      <text x="430" y="125" textAnchor="middle" fill={G} fontSize="9">0.71% from Solar ✓</text>
      <path d="M495 89 L555 89" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ac)"/>
      <text x="525" y="83" textAnchor="middle" fill="#0EA5E9" fontSize="9">EV charge</text>
      <rect x="555" y="55" width="130" height="70" rx="10" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1.5"/>
      <text x="620" y="80" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="600">🚌 EV Fleet</text>
      <text x="620" y="100" textAnchor="middle" fill="#1A2332" fontSize="15" fontWeight="700">50 units</text>
      <text x="620" y="116" textAnchor="middle" fill="#6B7A8D" fontSize="10">12 charging now</text>
    </svg>
    <div style={{display:"flex",flexWrap:"wrap",gap:16,marginTop:8}}>
      {[{color:G,label:"Solar generation"},{color:"#8B5CF6",label:"BESS discharge"},{color:"#F59E0B",label:"Grid supply"},{color:"#0EA5E9",label:"EV charging"}].map(({color,label})=>(
        <span key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#9BA8B5"}}>
          <span style={{display:"inline-block",width:18,borderTop:`2px dashed ${color}`}}/>
          {label}
        </span>
      ))}
    </div>
  </Card>
);

// ─── Pages ────────────────────────────────────────────────────────────────────
const OverviewPage = ({ setPage }) => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      <KPI label="Total Financial Savings" value="Rp 892.4M" unit="" sub="↑ Solar + EV + BESS combined" color={G} Icon={TrendingDown}/>
      <KPI label="CO2e Avoided" value="675.38" unit="tCO2e" sub="Scope 1 + Scope 2" color="#8B5CF6" Icon={Leaf}/>
      <KPI label="Energy Generated" value="1.37" unit="GWh" sub="Solar PV cumulative" color="#0EA5E9" Icon={Zap}/>
      <KPI label="System Health" value="98%" unit="" sub="All systems operational" color="#F59E0B" Icon={Activity}/>
    </div>
    <EnergyFlow/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
      <Card>
        <SectionTitle title="Savings Breakdown — Last 30 Days" sub="3 dimensions: Solar PV, EV Fleet, BESS peak shaving"/>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={savingsBreakdown} layout="vertical" margin={{left:0,right:20}}>
            <XAxis type="number" tick={{fontSize:10,fill:"#9BA8B5"}} tickFormatter={v=>`Rp ${v}M`}/>
            <YAxis type="category" dataKey="name" width={145} tick={{fontSize:11,fill:"#1A2332"}}/>
            <Tooltip formatter={v=>[`Rp ${v}M`,"Savings"]}/>
            <Bar dataKey="value" radius={[0,6,6,0]}>
              {savingsBreakdown.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionTitle title="System Status"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {label:"Solar PV",status:"Normal",val:"794 kWp",page:"solar",Icon:Sun,color:G},
            {label:"EV Fleet",status:"Charging",val:"50 units · 12 active",page:"ev",Icon:Truck,color:"#0EA5E9"},
            {label:"BESS",status:"Discharging",val:"500 kWh · 65% SoC",page:"bess",Icon:Battery,color:"#8B5CF6"},
          ].map(({label,status,val,page,Icon:Ic,color})=>(
            <button key={page} onClick={()=>setPage(page)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,
              textAlign:"left",border:`1px solid ${color}30`,background:color+"0D",cursor:"pointer",width:"100%",
            }}>
              <Ic size={14} color={color}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12,fontWeight:600,color:"#1A2332"}}>{label}</p>
                <p style={{fontSize:11,color:"#9BA8B5",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{val}</p>
              </div>
              <Badge status={status}/>
            </button>
          ))}
        </div>
        <p style={{fontSize:10,color:"#C5CDD6",marginTop:12}}>Updated: 27 Apr 2026, 17:10 WIB</p>
      </Card>
    </div>
    <Card>
      <SectionTitle title="Key Insights"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {type:"success",title:"Strong cost performance",desc:"EV fleet operating 72% below diesel baseline, exceeding the 70% quarterly target."},
          {type:"warning",title:"Charging optimization opportunity",desc:"Peak charging costs detected between 2–4 PM. Consider shifting sessions to off-peak hours."},
          {type:"info",title:"ESG milestone approaching",desc:"On track to exceed 1,000 tCO2e avoided by end of Q2 2026 — strong narrative for award submissions."},
        ].map(({type,title,desc})=>{
          const cfg={success:{bg:"#F0FDF4",border:"#86EFAC",icon:"✓",color:"#15803D"},warning:{bg:"#FFFBEB",border:"#FDE68A",icon:"!",color:"#B45309"},info:{bg:"#EFF6FF",border:"#BFDBFE",icon:"i",color:"#1D4ED8"}}[type];
          return (
            <div key={title} style={{padding:"12px 14px",borderRadius:10,background:cfg.bg,border:`1px solid ${cfg.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{width:16,height:16,borderRadius:"50%",background:cfg.color,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cfg.icon}</span>
                <p style={{fontSize:12,fontWeight:600,color:cfg.color}}>{title}</p>
              </div>
              <p style={{fontSize:11,color:"#4B5563",lineHeight:1.5}}>{desc}</p>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

const SolarPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      <KPI label="Installed Capacity" value="794" unit="kWp" color={G} Icon={Sun}/>
      <KPI label="Total Energy Generated" value="1.37" unit="GWh" color={G} Icon={Zap}/>
      <KPI label="Today Production" value="2.93" unit="MWh" sub="↑ +5% vs yesterday" color={G} Icon={Activity}/>
      <KPI label="This Month" value="82.28" unit="MWh" color={G} Icon={TrendingDown}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <SectionTitle title="Grid vs Solar — Today (kW)" sub="27 April 2026 · Huawei Inverter · Status: Normal"/>
          <div style={{display:"flex",gap:16,fontSize:11,color:"#9BA8B5"}}>
            <span><span style={{display:"inline-block",width:12,borderTop:`2px solid ${G}`,marginRight:4,verticalAlign:"middle"}}/>Grid</span>
            <span><span style={{display:"inline-block",width:12,borderTop:"2px solid #F59E0B",marginRight:4,verticalAlign:"middle"}}/>Solar</span>
          </div>
        </div>
        <div style={{display:"flex",gap:24,marginBottom:16}}>
          {[{l:"Grid",v:"6,872 kW",c:"#6B7A8D"},{l:"Building",v:"6,921 kW",c:"#1A2332"},{l:"Solar",v:"49.09 kW",c:G}].map(i=>(
            <div key={i.l}><p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p><p style={{fontSize:13,fontWeight:700,color:i.c}}>{i.v}</p></div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={hourlyData} margin={{right:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
            <XAxis dataKey="h" tick={{fontSize:9,fill:"#C5CDD6"}} interval={2}/>
            <YAxis tick={{fontSize:9,fill:"#C5CDD6"}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={(v,n)=>[`${v.toLocaleString()} kW`,n==="grid"?"Grid":"Solar"]}/>
            <Area type="monotone" dataKey="grid" stroke={G} fill="#E8F5EE" strokeWidth={2}/>
            <Area type="monotone" dataKey="solar" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <SectionTitle title="Environmental Impact"/>
          {[{icon:"🌫️",l:"CO2 Reduction",v:"650.38 ton"},{icon:"🌳",l:"Trees Equivalent",v:"889 trees"},{icon:"⚡",l:"Self-Sufficiency",v:"0.71% solar"},{icon:"🔆",l:"Grid Dependency",v:"99.3% PLN"}].map(i=>(
            <div key={i.l} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F7FA"}}>
              <span style={{fontSize:18}}>{i.icon}</span>
              <div><p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p><p style={{fontSize:13,fontWeight:600,color:"#1A2332"}}>{i.v}</p></div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle title="Social Aspect"/>
          {[{l:"Installation Workers",v:"39 people"},{l:"O&M Workers",v:"3 people"},{l:"Local Employment",v:"87%"}].map(i=>(
            <div key={i.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F5F7FA"}}>
              <p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p><p style={{fontSize:12,fontWeight:600,color:"#1A2332"}}>{i.v}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
    <Card>
      <SectionTitle title="Monthly Production (MWh)" sub="Jan – Dec 2026"/>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={monthlyProd} margin={{right:10}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false}/>
          <XAxis dataKey="m" tick={{fontSize:10,fill:"#C5CDD6"}}/>
          <YAxis tick={{fontSize:10,fill:"#C5CDD6"}} tickFormatter={v=>`${v}k`}/>
          <Tooltip formatter={v=>[`${v},000 kWh`,"Production"]}/>
          <Bar dataKey="v" fill={G} radius={[4,4,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

const EVPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
      {[{l:"Baseline Cost",v:"Rp 491.2M",c:"#6B7A8D"},{l:"Actual Cost",v:"Rp 294.8M",c:"#0EA5E9"},{l:"Total Savings",v:"40.0%",c:G},{l:"Energy Used",v:"23.3 MWh",c:"#1A2332"},{l:"Fuel Avoided",v:"9,334 L",c:"#F59E0B"},{l:"Emissions Avoided",v:"25.0 tCO2e",c:"#8B5CF6"}].map(k=>(
        <Card key={k.l} style={{padding:"12px 14px"}}>
          <p style={{fontSize:10,color:"#9BA8B5",marginBottom:6}}>{k.l}</p>
          <p style={{fontSize:17,fontWeight:700,color:k.c}}>{k.v}</p>
        </Card>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
      <Card>
        <SectionTitle title="Cost Comparison — Last 30 Days" sub="Fuel baseline vs electrified actuals"/>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={costData} margin={{right:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
            <XAxis dataKey="d" tick={{fontSize:9,fill:"#C5CDD6"}} interval={1}/>
            <YAxis tick={{fontSize:9,fill:"#C5CDD6"}} tickFormatter={v=>`Rp ${v}M`}/>
            <Tooltip formatter={(v,n)=>[`Rp ${v}M`,n==="b"?"Baseline":"Actual"]}/>
            <Area type="monotone" dataKey="b" stroke="#9CA3AF" fill="#F3F4F6" strokeWidth={1.5}/>
            <Area type="monotone" dataKey="a" stroke="#0EA5E9" fill="#E0F2FE" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionTitle title="Fleet Operations" sub="96 vehicles in fleet"/>
        {[{l:"Operational",v:22,c:G},{l:"Charging",v:12,c:"#0EA5E9"},{l:"In Maintenance",v:34,c:"#F59E0B"},{l:"Offline",v:28,c:"#9CA3AF"}].map(f=>(
          <div key={f.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:12,color:"#1A2332"}}>{f.l}</span>
              <span style={{fontSize:12,fontWeight:700,color:f.c}}>{f.v}</span>
            </div>
            <div style={{height:6,borderRadius:99,background:"#F3F4F6"}}>
              <div style={{height:"100%",borderRadius:99,background:f.c,width:`${(f.v/96)*100}%`}}/>
            </div>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:"1px solid #F5F7FA"}}>
          {[{l:"Avg. SoC",v:"65%"},{l:"Avg. Daily",v:"185 km"}].map(i=>(
            <div key={i.l}><p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p><p style={{fontSize:14,fontWeight:700,color:"#1A2332"}}>{i.v}</p></div>
          ))}
        </div>
      </Card>
    </div>
    <Card>
      <SectionTitle title="Top Cost Savers" sub="Vehicles with highest savings vs diesel baseline — Last 30 days"/>
      <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
        <thead>
          <tr style={{borderBottom:"1px solid #E5EAF0"}}>
            {["Vehicle ID","Baseline","Actual","Savings","Reduction"].map(h=>(
              <th key={h} style={{padding:"8px 4px",textAlign:"left",fontWeight:500,color:"#9BA8B5",fontSize:11}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topVehicles.map(v=>(
            <tr key={v.id} style={{borderBottom:"1px solid #F9FAFB"}}>
              <td style={{padding:"10px 4px",fontWeight:600,color:"#1A2332"}}>{v.id}</td>
              <td style={{padding:"10px 4px",color:"#9BA8B5"}}>Rp {v.b}M</td>
              <td style={{padding:"10px 4px",color:"#9BA8B5"}}>Rp {v.a}M</td>
              <td style={{padding:"10px 4px",fontWeight:700,color:G}}>Rp {v.s}M</td>
              <td style={{padding:"10px 4px"}}>
                <span style={{background:"#DCFCE7",color:"#15803D",padding:"2px 8px",borderRadius:99,fontSize:11,fontWeight:600}}>{v.p}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const BESSPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      <KPI label="Total Capacity" value="500" unit="kWh" color="#8B5CF6" Icon={Battery}/>
      <KPI label="Current SoC" value="65%" unit="" sub="Discharging mode" color="#8B5CF6" Icon={Activity}/>
      <KPI label="Peak Shaving Savings" value="Rp 113.6M" unit="" sub="This month" color={G} Icon={TrendingDown}/>
      <KPI label="Cycle Count Today" value="1.2" unit="cycles" color="#F59E0B" Icon={Zap}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
      <Card>
        <SectionTitle title="State of Charge — Today" sub="Solar charges BESS (08:00–16:00) → BESS discharges for Building & EV (night)"/>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={bessData} margin={{right:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
            <XAxis dataKey="t" tick={{fontSize:9,fill:"#C5CDD6"}}/>
            <YAxis domain={[0,100]} tick={{fontSize:9,fill:"#C5CDD6"}} tickFormatter={v=>`${v}%`}/>
            <Tooltip formatter={v=>[`${v}%`,"State of Charge"]}/>
            <Area type="monotone" dataKey="soc" stroke="#8B5CF6" fill="#F0EEFF" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionTitle title="BESS Live Status"/>
        {[{l:"Operating Mode",v:"Discharging",badge:true},{l:"Current Output",v:"85 kW"},{l:"Solar Input",v:"49 kW"},{l:"Temperature",v:"28.4°C"},{l:"Battery Health",v:"98.2%"},{l:"Est. Full Charge",v:"16:20 today"}].map(i=>(
          <div key={i.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F9FAFB"}}>
            <p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p>
            {i.badge?<Badge status="Discharging"/>:<p style={{fontSize:12,fontWeight:600,color:"#1A2332"}}>{i.v}</p>}
          </div>
        ))}
        <div style={{marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}>
            <span style={{color:"#9BA8B5"}}>State of Charge</span>
            <span style={{color:"#8B5CF6",fontWeight:700}}>65%</span>
          </div>
          <div style={{height:10,borderRadius:99,background:"#F0EEFF"}}>
            <div style={{height:"100%",borderRadius:99,width:"65%",background:"#8B5CF6"}}/>
          </div>
        </div>
      </Card>
    </div>
    <Card>
      <SectionTitle title="BESS Role in the Green Energy Loop" sub="How BESS connects Solar PV and EV Fleet into one integrated ecosystem"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {title:"☀ Solar → BESS",desc:"Excess solar stored during peak sunlight hours (08:00–16:00). Enables 24-hour green energy.",val:"120 kWh today",color:G},
          {title:"🔋 BESS → Building",desc:"Discharge during peak grid tariff hours to reduce demand charges and improve energy cost efficiency.",val:"85 kWh today",color:"#8B5CF6"},
          {title:"🔋 BESS → EV Charging",desc:"Prioritized green energy for overnight EV fleet charging (20:00–06:00). Maximizes Scope 1 reduction.",val:"75 kWh today",color:"#0EA5E9"},
        ].map(i=>(
          <div key={i.title} style={{padding:"14px",borderRadius:10,background:i.color+"0D",border:`1px solid ${i.color}25`}}>
            <p style={{fontSize:12,fontWeight:700,color:i.color,marginBottom:6}}>{i.title}</p>
            <p style={{fontSize:11,color:"#6B7A8D",lineHeight:1.5,marginBottom:10}}>{i.desc}</p>
            <p style={{fontSize:14,fontWeight:700,color:"#1A2332"}}>{i.val}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ESGPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      <KPI label="Total CO2e Avoided" value="675.38" unit="tCO2e" sub="Scope 1 + Scope 2" color={G} Icon={Leaf}/>
      <KPI label="Renewable Energy %" value="0.71%" unit="" sub="of total building load" color="#0EA5E9" Icon={Sun}/>
      <KPI label="Fuel Displaced" value="9,334" unit="liters" sub="diesel equivalent" color="#F59E0B" Icon={Zap}/>
      <KPI label="Local Workforce" value="42" unit="people" sub="installation + O&M" color="#8B5CF6" Icon={Users}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
      <Card>
        <SectionTitle title="CO2e Avoided & Fuel Displaced — Monthly Trend" sub="Oct 2025 – Apr 2026"/>
        <div style={{display:"flex",gap:16,marginBottom:10,fontSize:11,color:"#9BA8B5"}}>
          <span><span style={{display:"inline-block",width:12,borderTop:`2px solid ${G}`,marginRight:4,verticalAlign:"middle"}}/>CO2e (ton)</span>
          <span><span style={{display:"inline-block",width:12,borderTop:"2px solid #F59E0B",marginRight:4,verticalAlign:"middle"}}/>Fuel displaced (×10 L)</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={esgMonthly} margin={{right:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
            <XAxis dataKey="m" tick={{fontSize:10,fill:"#C5CDD6"}}/>
            <YAxis tick={{fontSize:10,fill:"#C5CDD6"}}/>
            <Tooltip/>
            <Area type="monotone" dataKey="co2" name="CO2e (ton)" stroke={G} fill="#E8F5EE" strokeWidth={2}/>
            <Area type="monotone" dataKey="fuel" name="Fuel (×10L)" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <SectionTitle title="SDG Alignment"/>
        {[{sdg:"SDG 7",l:"Affordable & Clean Energy",c:"#F59E0B"},{sdg:"SDG 9",l:"Industry & Innovation",c:"#0EA5E9"},{sdg:"SDG 11",l:"Sustainable Cities",c:"#8B5CF6"},{sdg:"SDG 12",l:"Responsible Consumption",c:G},{sdg:"SDG 13",l:"Climate Action",c:"#EF4444"}].map(s=>(
          <div key={s.sdg} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F7FA"}}>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 7px",borderRadius:99,background:s.c,color:"#fff",flexShrink:0}}>{s.sdg}</span>
            <p style={{fontSize:11,color:"#1A2332"}}>{s.l}</p>
          </div>
        ))}
      </Card>
    </div>
    <Card>
      <SectionTitle title="ESG Summary — Q1 2026" sub="Environmental · Social · Governance"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {cat:"Environmental",color:G,items:[{l:"Scope 1 Avoided (EV)",v:"25.0 tCO2e"},{l:"Scope 2 Avoided (Solar)",v:"650.38 tCO2e"},{l:"Fuel Displaced",v:"9,334 L"},{l:"Trees Equivalent",v:"889 trees"}]},
          {cat:"Social",color:"#0EA5E9",items:[{l:"Installation Workers",v:"39 people"},{l:"O&M Workers",v:"3 people"},{l:"Local Employment",v:"87%"},{l:"Training Hours",v:"240 hrs"}]},
          {cat:"Governance",color:"#8B5CF6",items:[{l:"Reporting Frequency",v:"Real-time"},{l:"3rd Party Validation",v:"In Progress"},{l:"Audit Trail",v:"Complete"},{l:"Next Report",v:"Q2 2026"}]},
        ].map(cat=>(
          <div key={cat.cat} style={{padding:"14px",borderRadius:10,background:cat.color+"08",border:`1px solid ${cat.color}20`}}>
            <p style={{fontSize:12,fontWeight:700,color:cat.color,marginBottom:10}}>{cat.cat}</p>
            {cat.items.map(i=>(
              <div key={i.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${cat.color}15`}}>
                <p style={{fontSize:11,color:"#9BA8B5"}}>{i.l}</p>
                <p style={{fontSize:11,fontWeight:600,color:"#1A2332"}}>{i.v}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const BillingPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
      <KPI label="Current Outstanding Bill" value="Rp 294.8M" unit="" sub="EV Fleet + Solar PV — Apr 2026" color="#0EA5E9" Icon={CreditCard}/>
      <KPI label="Cumulative Savings vs Baseline" value="Rp 1.18B" unit="" sub="Total 6-month savings" color={G} Icon={TrendingDown}/>
      <KPI label="Next Due Date" value="15 May" unit="2026" sub="Payment period" color="#F59E0B" Icon={Clock}/>
    </div>
    <Card>
      <SectionTitle title="Last 6 Months Payment History" sub="Solar PV + EV Fleet + BESS combined invoices"/>
      <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
        <thead>
          <tr style={{borderBottom:"1px solid #E5EAF0"}}>
            {["Period","Services","Invoice Amount","Status","Savings vs Fossil"].map(h=>(
              <th key={h} style={{padding:"8px 6px",textAlign:"left",fontWeight:500,color:"#9BA8B5",fontSize:11}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {billingHistory.map(row=>(
            <tr key={row.period} style={{borderBottom:"1px solid #F9FAFB"}}>
              <td style={{padding:"11px 6px",fontWeight:600,color:"#1A2332"}}>{row.period}</td>
              <td style={{padding:"11px 6px",color:"#9BA8B5"}}>{row.service}</td>
              <td style={{padding:"11px 6px",fontWeight:700,color:"#1A2332"}}>{row.amount}</td>
              <td style={{padding:"11px 6px"}}><Badge status={row.status}/></td>
              <td style={{padding:"11px 6px",fontWeight:700,color:G}}>{row.saving}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
    <Card style={{background:"#F0FDF4",border:"1px solid #86EFAC"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:22}}>💡</span>
        <div>
          <p style={{fontSize:13,fontWeight:700,color:"#15803D",marginBottom:4}}>Total 6-Month Savings: Rp 1.18B</p>
          <p style={{fontSize:11,color:"#166534"}}>By switching to SUN Group's integrated clean energy ecosystem, your business has avoided Rp 1.18 billion in fossil fuel costs over the last 6 months — equivalent to 675 tCO2e of greenhouse gas emissions.</p>
        </div>
      </div>
    </Card>
  </div>
);

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV = [
  {id:"overview",label:"Overview",Icon:LayoutDashboard},
  {id:"solar",label:"Solar PV",Icon:Sun},
  {id:"ev",label:"EV Fleet",Icon:Truck},
  {id:"bess",label:"BESS",Icon:Battery},
  {id:"esg",label:"ESG Report",Icon:Leaf},
  {id:"billing",label:"Billing",Icon:CreditCard},
];
const PAGE_META = {
  overview:{title:"Overview",sub:"Unified ecosystem — Solar PV · EV Fleet · BESS"},
  solar:{title:"Solar PV",sub:"Live monitoring — Demo Site · Sapphire Customer · Inverter: Huawei"},
  ev:{title:"EV Fleet",sub:"Fuel baseline vs electrified actuals · 96 vehicles · Last 30 days"},
  bess:{title:"BESS",sub:"Battery Energy Storage System — 500 kWh · PT Berau Coal Site"},
  esg:{title:"ESG Report",sub:"Environmental, Social & Governance — Q1 2026"},
  billing:{title:"Billing",sub:"Invoice history & payment tracking"},
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  const statCards = [
    {label:"Total Savings",val:"Rp 892.4M",color:G,icon:"💰"},
    {label:"CO2e Avoided",val:"675 tCO2e",color:"#8B5CF6",icon:"🌿"},
    {label:"EV Fleet",val:"96 units",color:"#0EA5E9",icon:"🚌"},
    {label:"Solar Capacity",val:"794 kWp",color:"#F59E0B",icon:"☀"},
  ];

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",fontSize:13}}>

      {/* ── Left Panel ── */}
      <div style={{flex:1,background:NAVY,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"40px 48px",position:"relative",overflow:"hidden"}}>

        {/* Decorative rings */}
        <div style={{position:"absolute",top:-120,right:-120,width:400,height:400,borderRadius:"50%",border:"1px solid #ffffff08",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:-60,right:-60,width:250,height:250,borderRadius:"50%",border:"1px solid #ffffff06",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",border:"1px solid #ffffff06",pointerEvents:"none"}}/>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Sun size={18} color="#fff"/>
          </div>
          <div>
            <p style={{color:"#fff",fontSize:15,fontWeight:700,lineHeight:1}}>SUN GROUP</p>
            <p style={{color:"#4A7A9B",fontSize:11,marginTop:3,letterSpacing:"0.04em"}}>Data Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:99,background:G+"22",border:`1px solid ${G}44`,marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:G}}/>
            <span style={{color:G,fontSize:11,fontWeight:600,letterSpacing:"0.04em"}}>INTEGRATED CLEAN ENERGY PLATFORM</span>
          </div>
          <h1 style={{color:"#fff",fontSize:32,fontWeight:700,lineHeight:1.25,marginBottom:14}}>
            Satu Dashboard.<br/>
            <span style={{color:G}}>Seluruh Ekosistem Energi.</span>
          </h1>
          <p style={{color:"#6B8FA8",fontSize:14,lineHeight:1.7,maxWidth:380}}>
            Monitor Solar PV, EV Fleet, dan BESS dalam satu tampilan terintegrasi. Dari data operasional hingga laporan ESG — semuanya real-time, satu platform.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {statCards.map(s=>(
            <div key={s.label} style={{padding:"14px 16px",borderRadius:12,background:DARK,border:"1px solid #1E3048",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <div>
                <p style={{color:"#4A7A9B",fontSize:10,marginBottom:2}}>{s.label}</p>
                <p style={{color:"#fff",fontSize:15,fontWeight:700}}>{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Systems */}
        <div>
          <p style={{color:"#4A7A9B",fontSize:11,marginBottom:10,letterSpacing:"0.04em"}}>SISTEM TERINTEGRASI</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{icon:Sun,label:"Solar PV",color:G},{icon:Truck,label:"EV Fleet",color:"#0EA5E9"},{icon:Battery,label:"BESS",color:"#8B5CF6"},{icon:Leaf,label:"ESG Report",color:"#34D399"}].map(({icon:Ic,label,color})=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:99,background:color+"18",border:`1px solid ${color}30`}}>
                <Ic size={12} color={color}/>
                <span style={{color,fontSize:11,fontWeight:500}}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Shield size={12} color="#4A7A9B"/>
          <p style={{color:"#4A7A9B",fontSize:11}}>Secured · ISO 27001 · Data diproses secara lokal</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{width:420,background:"#F4F6F9",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 48px"}}>
        <div style={{width:"100%"}}>

          {/* Header */}
          <div style={{marginBottom:32}}>
            <p style={{fontSize:22,fontWeight:700,color:"#1A2332",marginBottom:6}}>Selamat datang 👋</p>
            <p style={{fontSize:13,color:"#9BA8B5"}}>Masuk ke akun SUN Group Anda untuk melanjutkan.</p>
          </div>

          {/* Demo hint */}
          <div style={{padding:"10px 14px",borderRadius:10,background:"#EFF6FF",border:"1px solid #BFDBFE",marginBottom:24,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:14}}>💡</span>
            <p style={{fontSize:11,color:"#1D4ED8"}}>Demo: gunakan email dan password apapun untuk masuk.</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{padding:"10px 14px",borderRadius:10,background:"#FEF2F2",border:"1px solid #FECACA",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14}}>⚠</span>
              <p style={{fontSize:11,color:"#DC2626"}}>{error}</p>
            </div>
          )}

          {/* Form fields */}
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#1A2332",marginBottom:6}}>Email</label>
            <input
              type="email"
              placeholder="nama@sunenergy.co.id"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              style={{
                width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #E5EAF0",
                background:"#fff",fontSize:13,color:"#1A2332",outline:"none",boxSizing:"border-box",
                transition:"border-color 0.15s",
              }}
              onFocus={e=>e.target.style.borderColor=G}
              onBlur={e=>e.target.style.borderColor="#E5EAF0"}
            />
          </div>

          <div style={{marginBottom:8}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#1A2332",marginBottom:6}}>Password</label>
            <div style={{position:"relative"}}>
              <input
                type={showPass?"text":"password"}
                placeholder="Masukkan password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{
                  width:"100%",padding:"11px 42px 11px 14px",borderRadius:10,border:"1.5px solid #E5EAF0",
                  background:"#fff",fontSize:13,color:"#1A2332",outline:"none",boxSizing:"border-box",
                  transition:"border-color 0.15s",
                }}
                onFocus={e=>e.target.style.borderColor=G}
                onBlur={e=>e.target.style.borderColor="#E5EAF0"}
              />
              <button onClick={()=>setShowPass(!showPass)} style={{
                position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",color:"#9BA8B5",padding:2,
              }}>
                {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <button style={{background:"none",border:"none",fontSize:12,color:G,cursor:"pointer",fontWeight:500,padding:0}}>
              Lupa password?
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            style={{
              width:"100%",padding:"13px",borderRadius:10,border:"none",
              background:loading?"#4CB87A":G,color:"#fff",fontSize:14,fontWeight:700,
              cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",
              justifyContent:"center",gap:8,transition:"background 0.2s",
            }}
          >
            {loading?(
              <>
                <span style={{width:14,height:14,border:"2px solid #ffffff55",borderTop:"2px solid #fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>
                Memverifikasi...
              </>
            ):(
              <>Masuk ke Dashboard <ChevronRight size={16}/></>
            )}
          </button>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"24px 0"}}>
            <div style={{flex:1,height:1,background:"#E5EAF0"}}/>
            <span style={{fontSize:11,color:"#C5CDD6"}}>atau</span>
            <div style={{flex:1,height:1,background:"#E5EAF0"}}/>
          </div>

          {/* SSO */}
          <button style={{
            width:"100%",padding:"12px",borderRadius:10,border:"1.5px solid #E5EAF0",
            background:"#fff",fontSize:13,color:"#1A2332",cursor:"pointer",fontWeight:500,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            <span style={{fontSize:16}}>🔐</span> Masuk dengan SSO Perusahaan
          </button>

          {/* Footer */}
          <p style={{textAlign:"center",fontSize:11,color:"#C5CDD6",marginTop:32}}>
            © 2026 SUN Group · <span style={{color:G,cursor:"pointer"}}>Kebijakan Privasi</span> · <span style={{color:G,cursor:"pointer"}}>Syarat Penggunaan</span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
const Dashboard = ({ onLogout, userName }) => {
  const [page, setPage] = useState("overview");
  const { title, sub } = PAGE_META[page];

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",fontSize:13,background:"#F4F6F9",overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:210,flexShrink:0,background:NAVY,display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"18px 18px 16px",borderBottom:"1px solid #1E3048"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:G,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Sun size={15} color="#fff"/>
            </div>
            <div>
              <p style={{color:"#fff",fontSize:13,fontWeight:700,lineHeight:1}}>SUN GROUP</p>
              <p style={{color:"#6B8FA8",fontSize:10,marginTop:2}}>Data Platform</p>
            </div>
          </div>
        </div>
        <div style={{margin:"12px 12px 0",padding:"10px 12px",borderRadius:10,background:"#162435",border:"1px solid #1E3048"}}>
          <p style={{color:"#6B8FA8",fontSize:10,marginBottom:2}}>Active Site</p>
          <p style={{color:"#fff",fontSize:12,fontWeight:600}}>PT Berau Coal</p>
          <p style={{color:G,fontSize:10,marginTop:2}}>● Sapphire Customer</p>
        </div>
        <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(({id,label,Icon:Ic})=>{
            const active=page===id;
            return (
              <button key={id} onClick={()=>setPage(id)} style={{
                display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,
                textAlign:"left",cursor:"pointer",border:"none",
                background:active?G+"1E":"transparent",
                borderLeft:`3px solid ${active?G:"transparent"}`,
                color:active?G:"#7A9AB5",width:"100%",
              }}>
                <Ic size={15}/><span style={{fontSize:13,fontWeight:active?600:400}}>{label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{padding:"14px 16px",borderTop:"1px solid #1E3048"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#1E3048",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:G,flexShrink:0}}>
              {userName?userName[0].toUpperCase():"F"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{color:"#fff",fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName||"Fakhri"}</p>
              <p style={{color:"#6B8FA8",fontSize:10}}>Marketing & ESG</p>
            </div>
            <button onClick={onLogout} title="Keluar" style={{background:"none",border:"none",cursor:"pointer",color:"#4A7A9B",padding:2,flexShrink:0}}>
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",background:"#fff",borderBottom:"1px solid #E5EAF0",flexShrink:0}}>
          <div>
            <p style={{fontSize:18,fontWeight:700,color:"#1A2332",lineHeight:1}}>{title}</p>
            <p style={{fontSize:11,color:"#9BA8B5",marginTop:4}}>{sub}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{padding:"6px 12px",borderRadius:8,background:"#F4F6F9",color:"#6B7A8D",fontSize:11}}>📅 27 Apr 2026</div>
            <button style={{padding:"6px 14px",borderRadius:8,background:G,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer"}}>↑ Export Report</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {page==="overview"&&<OverviewPage setPage={setPage}/>}
          {page==="solar"&&<SolarPage/>}
          {page==="ev"&&<EVPage/>}
          {page==="bess"&&<BESSPage/>}
          {page==="esg"&&<ESGPage/>}
          {page==="billing"&&<BillingPage/>}
        </div>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  return isLoggedIn
    ? <Dashboard onLogout={()=>setIsLoggedIn(false)} userName={userName}/>
    : <LoginPage onLogin={()=>{ setUserName("Fakhri"); setIsLoggedIn(true); }}/>;
}
