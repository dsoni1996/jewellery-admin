"use client";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { StatCard } from "../../../components/common";

const monthlyData = [
  { month:"Oct", revenue:842000, orders:18, customers:14 },
  { month:"Nov", revenue:1124000, orders:24, customers:19 },
  { month:"Dec", revenue:1680000, orders:36, customers:28 },
  { month:"Jan", revenue:980000, orders:21, customers:16 },
  { month:"Feb", revenue:1240000, orders:27, customers:22 },
  { month:"Mar", revenue:1560000, orders:33, customers:25 },
  { month:"Apr", revenue:1340000, orders:28, customers:21 },
];

const categoryRevenue = [
  { name:"Rings",       revenue:2534000 },
  { name:"Necklaces",   revenue:3890000 },
  { name:"Bangles",     revenue:2098000 },
  { name:"Earrings",    revenue:1560000 },
  { name:"Mangalsutra", revenue:3276000 },
  { name:"Pendants",    revenue:890000  },
];

const pieData = [
  { name:"22KT Gold",   value:42, color:"#B8862A" },
  { name:"18KT Diamond",value:28, color:"#8FA8C8" },
  { name:"18KT Gold",   value:18, color:"#C99A30" },
  { name:"14KT Gold",   value:12, color:"#E8C96A" },
];

const paymentData = [
  { name:"UPI",        value:45 },
  { name:"Card",       value:30 },
  { name:"Net Banking",value:15 },
  { name:"EMI",        value:10 },
];

const TOOLTIP_STYLE = { background:"var(--dark)", border:"none", borderRadius:3, fontSize:12, color:"var(--gold-light)" };

const S = `
.an-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
@media(max-width:900px){ .an-grid { grid-template-columns:repeat(2,1fr); } }
.an-row { display:grid; grid-template-columns:3fr 2fr; gap:20px; margin-bottom:20px; }
.an-row2 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:20px; }
@media(max-width:1000px){ .an-row,.an-row2 { grid-template-columns:1fr; } }
.chart-h { height:230px; }
.chart-h-sm { height:180px; }
`;

export default function AnalyticsPage() {
  const fmt = n => `₹${(n/100000).toFixed(1)}L`;

  return (
    <>
      <style>{S}</style>

      {/* KPI cards */}
      <div className="an-grid">
        <StatCard label="Total Revenue"    value="₹ 88.7L"  sub="this year" trend={12.4} icon={TrendingUp}  color="var(--gold)" />
        <StatCard label="Total Orders"     value="187"       sub="this year" trend={8.2}  icon={ShoppingBag} color="var(--blue)"  colorBg="var(--blue-bg)" />
        <StatCard label="New Customers"    value="142"       sub="this year" trend={5.6}  icon={Users}       color="var(--green)" colorBg="var(--green-bg)" />
        <StatCard label="Avg. Order Value" value="₹ 89.4K"  sub="per order" trend={3.1}  icon={Package}     color="var(--amber)" colorBg="var(--amber-bg)" />
      </div>

      {/* Revenue trend + Category bar */}
      <div className="an-row">
        <div className="card">
          <div className="card-head">
            <span className="card-title">Revenue <em>Trend</em></span>
            <span style={{ fontSize:11, color:"var(--text3)", letterSpacing:1 }}>7 MONTHS</span>
          </div>
          <div className="card-body">
            <div className="chart-h">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#B8862A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#B8862A" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#185FA5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#185FA5" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:"var(--text3)" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="r" tick={{ fontSize:10, fill:"var(--text3)" }} axisLine={false} tickLine={false} tickFormatter={fmt} width={44} />
                  <YAxis yAxisId="o" orientation="right" tick={{ fontSize:10, fill:"var(--text3)" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [n==="revenue" ? `₹${v.toLocaleString("en-IN")}` : v, n==="revenue"?"Revenue":"Orders"]} />
                  <Area yAxisId="r" type="monotone" dataKey="revenue"  stroke="#B8862A" strokeWidth={2} fill="url(#rev)"  dot={false} />
                  <Area yAxisId="o" type="monotone" dataKey="orders"   stroke="#185FA5" strokeWidth={2} fill="url(#ord)"  dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Metal <em>Mix</em></span></div>
          <div className="card-body">
            <div className="chart-h" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`]} />
                  <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Category revenue + Payment methods + Customers */}
      <div className="an-row2">
        <div className="card">
          <div className="card-head"><span className="card-title">Revenue by <em>Category</em></span></div>
          <div className="card-body">
            <div className="chart-h-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" tick={{ fontSize:10, fill:"var(--text3)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:"var(--text2)" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`₹${v.toLocaleString("en-IN")}`]} />
                  <Bar dataKey="revenue" fill="#B8862A" radius={[0,3,3,0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Payment <em>Methods</em></span></div>
          <div className="card-body">
            <div className="chart-h-sm" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {paymentData.map((_, i) => <Cell key={i} fill={["#B8862A","#C99A30","#D4AF6A","#E8C96A"][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Customer <em>Growth</em></span></div>
          <div className="card-body">
            <div className="chart-h-sm">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:"var(--text3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:"var(--text3)" }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="customers" stroke="#2e7d32" strokeWidth={2} dot={{ r:3, fill:"#2e7d32" }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
