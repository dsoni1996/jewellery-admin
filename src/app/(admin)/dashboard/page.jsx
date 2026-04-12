"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Package, Users, TrendingUp, ArrowRight, Gem, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard, Badge } from "../../../components/common";
import { api } from "../../../lib/api";
import Link from "next/link";

const STATUS_VARIANT = { confirmed:"amber", processing:"blue", packed:"blue", shipped:"blue", out_for_delivery:"blue", delivered:"green", cancelled:"red", returned:"red" };
const TOOLTIP = { background:"#2C1A0E", border:"none", borderRadius:3, fontSize:12, color:"#D4AF6A" };

const S = `
.dash-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
@media(max-width:1100px){ .dash-stats { grid-template-columns:repeat(2,1fr); } }
.dash-row  { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:20px; }
.dash-row2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
@media(max-width:1000px){ .dash-row,.dash-row2 { grid-template-columns:1fr; } }
.chart-wrap { height:220px; margin-top:8px; }
.cat-bar-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.cat-bar-label { font-size:12px; color:var(--text2); width:90px; flex-shrink:0; }
.cat-bar-track { flex:1; height:6px; background:var(--bg); border-radius:3px; overflow:hidden; }
.cat-bar-fill  { height:100%; background:var(--gold); border-radius:3px; transition:width .6s ease; }
.cat-bar-pct   { font-size:11px; color:var(--text3); width:36px; text-align:right; flex-shrink:0; }
.alert-strip { background:linear-gradient(90deg,var(--dark) 0%,var(--brown) 100%); border-radius:var(--radius); padding:16px 22px; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.alert-strip p    { color:var(--gold-light); font-size:13px; }
.alert-strip span { color:rgba(255,255,255,.45); font-size:12px; }
.view-link { display:flex; align-items:center; gap:5px; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); text-decoration:none; }
`;

function fmt(n)  { return "₹ " + (n||0).toLocaleString("en-IN"); }
function fmtL(n) { return "₹" + ((n||0)/100000).toFixed(1) + "L"; }

const FALLBACK_MONTHLY = [
  { month:"Oct", revenue:842000, orders:18 }, { month:"Nov", revenue:1124000, orders:24 },
  { month:"Dec", revenue:1680000, orders:36 }, { month:"Jan", revenue:980000,  orders:21 },
  { month:"Feb", revenue:1240000, orders:27 }, { month:"Mar", revenue:1560000, orders:33 },
  { month:"Apr", revenue:1340000, orders:28 },
];
const FALLBACK_CATS = [
  { _id:"Rings", revenue:2534000, units:38 }, { _id:"Necklaces", revenue:3890000, units:31 },
  { _id:"Bangles", revenue:2098000, units:24 }, { _id:"Earrings", revenue:1560000, units:19 },
  { _id:"Mangalsutra", revenue:3276000, units:42 },
];
const FALLBACK_ORDERS = [
  { orderNumber:"MANAS-2025-00028", user:{firstName:"Priya",  lastName:"Sharma"}, pricing:{total:112732}, status:"delivered",  createdAt:new Date() },
  { orderNumber:"MANAS-2025-00027", user:{firstName:"Aarav",  lastName:"Mehta" }, pricing:{total:52697 }, status:"shipped",    createdAt:new Date() },
  { orderNumber:"MANAS-2025-00026", user:{firstName:"Sneha",  lastName:"Rathi" }, pricing:{total:87450 }, status:"processing", createdAt:new Date() },
  { orderNumber:"MANAS-2025-00025", user:{firstName:"Vikram", lastName:"Patel" }, pricing:{total:224000}, status:"confirmed",  createdAt:new Date() },
];

export default function DashboardPage() {
  const [greeting,    setGreeting]    = useState("Good day");
  const [statsData,   setStatsData]   = useState(null);
  const [monthly,     setMonthly]     = useState(FALLBACK_MONTHLY);
  const [categories,  setCategories]  = useState(FALLBACK_CATS);
  const [recentOrders,setRecentOrders]= useState(FALLBACK_ORDERS);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [s, m, c] = await Promise.all([
          api.stats.getSummary(),
          api.stats.getMonthly(),
          api.stats.getCategories(),
        ]);
        setStatsData(s.stats);
        if (s.recentOrders?.length) setRecentOrders(s.recentOrders);
        if (m.monthly?.length)      setMonthly(m.monthly);
        if (c.categories?.length)   setCategories(c.categories);
      } catch { /* use fallback data */ }
      finally { setLoading(false); }
    })();
  }, []);

  const catMax = Math.max(...categories.map(c => c.revenue), 1);

  if (loading) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:400,color:"var(--text3)" }}>
      <Loader2 size={28} className="loader-spin" />
    </div>
  );

  return (
    <>
      <style>{S}</style>

      <div className="alert-strip">
        <div>
          <p>{greeting}, <strong style={{ color:"var(--gold-light)" }}>Admin</strong> 👋</p>
          <span>Here's what's happening with MANAS today</span>
        </div>
        <Gem size={24} style={{ color:"rgba(212,175,106,.35)" }} />
      </div>

      <div className="dash-stats">
        <StatCard label="Total Revenue"  value={statsData ? fmtL(statsData.revenue.total) : "₹ 88.7L"}
          sub={statsData ? `${statsData.revenue.trend>0?"▲":"▼"} ${Math.abs(statsData.revenue.trend)}% this month` : "vs last month"}
          trend={statsData?.revenue.trend ?? 12.4} icon={TrendingUp} color="var(--gold)" colorBg="var(--gold-pale)" />
        <StatCard label="Total Orders"   value={statsData?.orders.total ?? 187}
          sub={`${statsData?.orders.pending ?? 12} pending`}
          icon={ShoppingBag} color="var(--blue)" colorBg="var(--blue-bg)" />
        <StatCard label="Products"       value={statsData?.products.total ?? 24}
          sub={`${statsData?.products.lowStock ?? 3} low stock`}
          icon={Package} color="var(--amber)" colorBg="var(--amber-bg)" />
        <StatCard label="Customers"      value={statsData?.customers.total ?? 142}
          sub={`+${statsData?.customers.thisMonth ?? 14} this month`}
          icon={Users} color="var(--green)" colorBg="var(--green-bg)" />
      </div>

      <div className="dash-row">
        <div className="card">
          <div className="card-head">
            <span className="card-title">Revenue <em>Overview</em></span>
            <span style={{ fontSize:11,color:"var(--text3)",letterSpacing:1 }}>{monthly.length} MONTHS</span>
          </div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top:4,right:4,bottom:0,left:0 }}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#B8862A" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#B8862A" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize:11,fill:"var(--text3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10,fill:"var(--text3)" }} axisLine={false} tickLine={false}
                    tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`} width={42} />
                  <Tooltip contentStyle={TOOLTIP} formatter={v=>[`₹ ${(v||0).toLocaleString("en-IN")}`,"Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#B8862A" strokeWidth={2} fill="url(#rg)" dot={false} activeDot={{ r:4,fill:"#B8862A" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Sales by <em>Category</em></span></div>
          <div className="card-body">
            {categories.slice(0,6).map((c,i) => (
              <div key={i} className="cat-bar-row">
                <span className="cat-bar-label">{c._id}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width:`${(c.revenue/catMax)*100}%` }} />
                </div>
                <span className="cat-bar-pct">{c.units} pcs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-row2">
        <div className="card">
          <div className="card-head">
            <span className="card-title">Recent <em>Orders</em></span>
            <Link href="/orders" className="view-link">View all <ArrowRight size={12}/></Link>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((o,i) => (
                  <tr key={i}>
                    <td>
                      <p className="tbl-name" style={{ fontSize:12,fontFamily:"monospace" }}>{o.orderNumber}</p>
                      <p className="tbl-sub">{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</p>
                    </td>
                    <td style={{ fontSize:13 }}>{o.user?.firstName} {o.user?.lastName}</td>
                    <td style={{ fontSize:13,fontWeight:500 }}>{fmt(o.pricing?.total)}</td>
                    <td><Badge variant={STATUS_VARIANT[o.status]||"gray"}>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Quick <em>Actions</em></span></div>
          <div className="card-body">
            {[
              { label:"Add New Product",     href:"/products",  icon:"+" },
              { label:"View Pending Orders", href:"/orders",    icon:"📦" },
              { label:"Check Reviews",       href:"/reviews",   icon:"★" },
              { label:"Manage Coupons",      href:"/coupons",   icon:"🏷" },
              { label:"View Analytics",      href:"/analytics", icon:"📊" },
              { label:"Settings",            href:"/settings",  icon:"⚙" },
            ].map((a,i) => (
              <Link key={i} href={a.href} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F5EDE3",textDecoration:"none" }}>
                <div style={{ width:32,height:32,borderRadius:"var(--radius)",background:"var(--bg)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                  {a.icon}
                </div>
                <span style={{ fontSize:13,color:"var(--text)",fontWeight:500 }}>{a.label}</span>
                <ArrowRight size={12} style={{ marginLeft:"auto",color:"var(--text3)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
