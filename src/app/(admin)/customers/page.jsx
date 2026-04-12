/* ══════════════════════════════════════════════════
   customers/page.jsx
══════════════════════════════════════════════════ */
"use client";
import { useState } from "react";
import { Search, X, Users, ShoppingBag, Heart, Star } from "lucide-react";
import { Badge, StatCard, Pagination } from "../../../components/common";

const mockCustomers = [
  { id:1, name:"Priya Sharma",   phone:"9876543210", email:"priya@email.com",  city:"Mumbai",    orders:8,  spent:524000, joined:"Jan 2024", status:"active"   },
  { id:2, name:"Aarav Mehta",    phone:"9765432109", email:"aarav@email.com",  city:"Delhi",     orders:3,  spent:157391, joined:"Mar 2024", status:"active"   },
  { id:3, name:"Sneha Rathi",    phone:"9654321098", email:"sneha@email.com",  city:"Bangalore", orders:5,  spent:312000, joined:"Feb 2024", status:"active"   },
  { id:4, name:"Vikram Patel",   phone:"9543210987", email:"vikram@email.com", city:"Ahmedabad", orders:12, spent:892000, joined:"Nov 2023", status:"active"   },
  { id:5, name:"Meera Iyer",     phone:"9432109876", email:"meera@email.com",  city:"Chennai",   orders:2,  spent:98500,  joined:"Apr 2024", status:"inactive" },
  { id:6, name:"Rohan Gupta",    phone:"9321098765", email:"rohan@email.com",  city:"Kolkata",   orders:6,  spent:445000, joined:"Dec 2023", status:"active"   },
  { id:7, name:"Ananya Singh",   phone:"9210987654", email:"ananya@email.com", city:"Hyderabad", orders:4,  spent:234000, joined:"Feb 2024", status:"active"   },
  { id:8, name:"Karan Malhotra", phone:"9109876543", email:"karan@email.com",  city:"Pune",      orders:1,  spent:52697,  joined:"Apr 2024", status:"active"   },
];

const S = `
.cust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
@media(max-width:900px){ .cust-grid { grid-template-columns:repeat(2,1fr); } }
`;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.city.toLowerCase().includes(search.toLowerCase())
  );
  const fmt = n => "₹ " + n.toLocaleString("en-IN");

  return (
    <>
      <style>{S}</style>
      <div className="cust-grid">
        <StatCard label="Total Customers" value="142"    sub="registered users"           icon={Users}      color="var(--gold)" />
        <StatCard label="Active"          value="128"    sub="vs last month" trend={8.2}  icon={Users}      color="var(--green)" colorBg="var(--green-bg)" />
        <StatCard label="Total Orders"    value="187"    sub="from all customers"         icon={ShoppingBag} color="var(--blue)" colorBg="var(--blue-bg)" />
        <StatCard label="Avg. Order Value" value="₹89.4K" sub="per customer"             icon={Star}       color="var(--amber)" colorBg="var(--amber-bg)" />
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="filter-search" style={{ flex: 1 }}>
            <Search size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
            <input placeholder="Search by name, phone, city…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",display:"flex" }}><X size={13} /></button>}
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>Customer</th><th>Contact</th><th>City</th>
              <th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th>
            </tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34,height:34,borderRadius:"50%",background:"var(--gold-pale)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--gold)",fontWeight:600,fontSize:13,flexShrink:0 }}>
                        {c.name.charAt(0)}
                      </div>
                      <span className="tbl-name">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontSize:13 }}>{c.phone}</p>
                    <p className="tbl-sub">{c.email}</p>
                  </td>
                  <td style={{ fontSize:13 }}>{c.city}</td>
                  <td style={{ fontSize:13, fontWeight:500 }}>{c.orders}</td>
                  <td style={{ fontSize:13, fontWeight:500 }}>{fmt(c.spent)}</td>
                  <td style={{ fontSize:12, color:"var(--text3)" }}>{c.joined}</td>
                  <td><Badge variant={c.status === "active" ? "green" : "gray"}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
