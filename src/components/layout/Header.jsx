"use client";
import { Bell, Search, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";

const titles = {
  "/dashboard":  "Dashboard",
  "/analytics":  "Analytics",
  "/products":   "Products",
  "/orders":     "Orders",
  "/customers":  "Customers",
  "/coupons":    "Coupons",
  "/reviews":    "Reviews",
  "/settings":      "Settings",
  "/page-builder": "Page Builder",
};

const S = `
.hdr { height:var(--header-h); background:var(--white); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 28px; gap:16px; position:sticky; top:0; z-index:40; }
.hdr-title { font-family:var(--font-serif); font-size:22px; font-weight:400; color:var(--dark); flex:1; }
.hdr-title em { font-style:italic; color:var(--gold); }
.hdr-search { display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--border); padding:7px 14px; border-radius:var(--radius); min-width:220px; }
.hdr-search input { border:none; background:transparent; outline:none; font-size:12.5px; color:var(--text); font-family:var(--font-sans); width:100%; }
.hdr-search input::placeholder { color:var(--text3); }
.hdr-icon-btn { background:none; border:1px solid var(--border); border-radius:var(--radius); width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text2); transition:all 0.2s; }
.hdr-icon-btn:hover { border-color:var(--gold); color:var(--gold); }
.hdr-notif { position:relative; }
.hdr-notif-dot { position:absolute; top:4px; right:4px; width:7px; height:7px; border-radius:50%; background:var(--gold); border:2px solid var(--white); }
.hdr-gold-line { position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--gold) 20%,var(--gold-light) 50%,var(--gold) 80%,transparent); }
`;

export default function Header() {
  const path = usePathname();
  const base = "/" + path.split("/")[1];
  const title = titles[base] || "Admin";

  return (
    <>
      <style>{S}</style>
      <header className="hdr" style={{ position: "relative" }}>
        <h1 className="hdr-title">
          {title.split(" ").map((w, i) =>
            i === title.split(" ").length - 1 ? <em key={i}> {w}</em> : w + " "
          )}
        </h1>

        <div className="hdr-search">
          <Search size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
          <input placeholder="Search anything…" />
        </div>

        <button className="hdr-icon-btn"><RefreshCw size={14} /></button>

        <button className="hdr-icon-btn hdr-notif">
          <Bell size={14} />
          <span className="hdr-notif-dot" />
        </button>

        <div className="hdr-gold-line" />
      </header>
    </>
  );
}
