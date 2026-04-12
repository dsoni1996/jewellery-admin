"use client";
import { useState } from "react";
import { Star, Trash2, Check, Search } from "lucide-react";
import { Badge, StatCard } from "../../../components/common";

const mockReviews = [
  { id:1, product:"Diamond Mangalsutra",       user:"Priya S.",   rating:5, title:"Absolutely stunning",   comment:"The quality is exceptional. The diamonds sparkle beautifully.", date:"10 Apr 2025", approved:true  },
  { id:2, product:"Timeless Blossom Ring",      user:"Aarav M.",   rating:4, title:"Great craftsmanship",    comment:"Really happy with the purchase. Slight delay in delivery though.", date:"09 Apr 2025", approved:true  },
  { id:3, product:"Aakarshan Gold Necklace",    user:"Meera I.",   rating:5, title:"Bridal masterpiece",     comment:"Wore this on my wedding. Every single guest complimented it.", date:"08 Apr 2025", approved:false },
  { id:4, product:"Floral Gold Bangle Set",     user:"Sneha R.",   rating:3, title:"Good but pricey",        comment:"The bangles look beautiful but I feel the making charges are very high.", date:"07 Apr 2025", approved:false },
  { id:5, product:"Solitaire Engagement Ring",  user:"Kiran T.",   rating:5, title:"She said yes!",          comment:"The ring is perfect. She loved it instantly. Thank you MANAS!", date:"06 Apr 2025", approved:true  },
  { id:6, product:"Pearl Drop Earrings",        user:"Ananya S.",  rating:4, title:"Elegant and delicate",   comment:"Beautifully crafted. Goes well with both traditional and western outfits.", date:"05 Apr 2025", approved:true  },
];

const starColor = r => r >= 4 ? "var(--green)" : r === 3 ? "var(--amber)" : "var(--red)";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter]  = useState("all");
  const [search, setSearch]  = useState("");

  const approve = id => setReviews(p => p.map(r => r.id === id ? { ...r, approved: true } : r));
  const remove  = id => { if (confirm("Delete this review?")) setReviews(p => p.filter(r => r.id !== id)); };

  const filtered = reviews.filter(r => {
    const matchFilter = filter === "all" || (filter === "pending" ? !r.approved : r.approved);
    const matchSearch = r.product.toLowerCase().includes(search.toLowerCase()) || r.user.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Total Reviews"    value={reviews.length}                     icon={Star} color="var(--gold)" />
        <StatCard label="Avg. Rating"      value={avgRating + " ★"}  sub="out of 5"    icon={Star} color="var(--amber)" colorBg="var(--amber-bg)" />
        <StatCard label="Approved"         value={reviews.filter(r => r.approved).length}   icon={Check} color="var(--green)" colorBg="var(--green-bg)" />
        <StatCard label="Pending Approval" value={reviews.filter(r => !r.approved).length}  icon={Star} color="var(--red)" colorBg="var(--red-bg)" />
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="filter-search" style={{ flex:1 }}>
            <Search size={13} style={{ color:"var(--text3)", flexShrink:0 }} />
            <input placeholder="Search by product or customer…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["all","pending","approved"].map(f => (
            <button key={f} className={`btn btn-sm${filter === f ? " btn-primary" : " btn-outline"}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>Product</th><th>Customer</th><th>Rating</th>
              <th>Review</th><th>Date</th><th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontSize:13, fontWeight:500, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.product}</td>
                  <td style={{ fontSize:13 }}>{r.user}</td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Star size={12} fill={starColor(r.rating)} color={starColor(r.rating)} />
                      <span style={{ fontSize:13, fontWeight:500, color:starColor(r.rating) }}>{r.rating}.0</span>
                    </div>
                  </td>
                  <td style={{ maxWidth:260 }}>
                    <p style={{ fontSize:12.5, fontWeight:500, marginBottom:2 }}>{r.title}</p>
                    <p style={{ fontSize:12, color:"var(--text3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:240 }}>{r.comment}</p>
                  </td>
                  <td style={{ fontSize:12, color:"var(--text3)", whiteSpace:"nowrap" }}>{r.date}</td>
                  <td><Badge variant={r.approved ? "green" : "amber"}>{r.approved ? "Approved" : "Pending"}</Badge></td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      {!r.approved && (
                        <button className="btn btn-outline btn-sm" style={{ color:"var(--green)" }} onClick={() => approve(r.id)} title="Approve">
                          <Check size={12} />
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
