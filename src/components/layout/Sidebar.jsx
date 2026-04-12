"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Tag, Star, BarChart2, Settings, LogOut, Gem,
  ChevronRight,
} from "lucide-react";

const nav = [
  { group: "Main" },
  { label: "Dashboard",   href: "/dashboard",  icon: LayoutDashboard },
  { label: "Analytics",   href: "/analytics",  icon: BarChart2 },
  { group: "Catalogue" },
  { label: "Products",    href: "/products",   icon: Package },
  { group: "Commerce" },
  { label: "Orders",      href: "/orders",     icon: ShoppingBag },
  { label: "Customers",   href: "/customers",  icon: Users },
  { label: "Coupons",     href: "/coupons",    icon: Tag },
  { label: "Reviews",     href: "/reviews",    icon: Star },
  { group: "System" },
  { label: "Settings",    href: "/settings",   icon: Settings },
];

const S = `
.sb { width:var(--sidebar-w); height:100vh; background:var(--dark2); display:flex; flex-direction:column; flex-shrink:0; position:fixed; top:0; left:0; z-index:50; border-right:1px solid rgba(184,134,42,0.15); }
.sb-logo { padding:0 20px; height:var(--header-h); display:flex; align-items:center; gap:10px; border-bottom:1px solid rgba(184,134,42,0.15); flex-shrink:0; }
.sb-logo-icon { width:32px; height:32px; background:rgba(184,134,42,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--gold-light); }
.sb-logo-name { font-family:var(--font-serif); font-size:18px; font-weight:600; letter-spacing:3px; color:var(--white); text-transform:uppercase; }
.sb-logo-name span { color:var(--gold-light); }
.sb-badge { font-size:9px; letter-spacing:1.5px; color:var(--gold); background:rgba(184,134,42,0.12); border:1px solid rgba(184,134,42,0.25); padding:2px 7px; border-radius:2px; margin-left:auto; }
.sb-nav { flex:1; overflow-y:auto; padding:10px 0 16px; }
.sb-group { font-size:9px; font-weight:600; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,0.25); padding:16px 20px 6px; }
.sb-item { display:flex; align-items:center; gap:10px; padding:10px 20px; cursor:pointer; transition:background 0.15s, color 0.15s; color:rgba(255,255,255,0.5); font-size:12.5px; font-weight:400; letter-spacing:0.3px; position:relative; }
.sb-item:hover { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.85); }
.sb-item.active { background:rgba(184,134,42,0.14); color:var(--gold-light); }
.sb-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--gold); }
.sb-item-icon { flex-shrink:0; }
.sb-item-arrow { margin-left:auto; opacity:0.4; }
.sb-footer { padding:12px 20px 16px; border-top:1px solid rgba(184,134,42,0.1); }
.sb-user { display:flex; align-items:center; gap:10px; padding:8px 0 10px; }
.sb-avatar { width:32px; height:32px; border-radius:50%; background:rgba(184,134,42,0.2); display:flex; align-items:center; justify-content:center; color:var(--gold-light); font-size:13px; font-weight:600; flex-shrink:0; }
.sb-user-info { min-width:0; }
.sb-user-name { font-size:12px; font-weight:500; color:var(--white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sb-user-role { font-size:10px; color:rgba(255,255,255,0.35); letter-spacing:1px; text-transform:uppercase; }
.sb-logout { display:flex; align-items:center; gap:8px; background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.3); font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-family:var(--font-sans); padding:0; transition:color 0.2s; width:100%; }
.sb-logout:hover { color:var(--red-bg); }
`;

export default function Sidebar() {
  const path   = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <>
      <style>{S}</style>
      <aside className="sb">
        <div className="sb-logo">
          <div className="sb-logo-icon"><Gem size={14} /></div>
          <span className="sb-logo-name">MAN<span>A</span>S</span>
          <span className="sb-badge">ADMIN</span>
        </div>

        <nav className="sb-nav">
          {nav.map((item, i) =>
            item.group ? (
              <p key={i} className="sb-group">{item.group}</p>
            ) : (
              <div
                key={i}
                className={`sb-item${path.startsWith(item.href) ? " active" : ""}`}
                onClick={() => router.push(item.href)}
              >
                <item.icon size={15} className="sb-item-icon" />
                {item.label}
                <ChevronRight size={12} className="sb-item-arrow" />
              </div>
            )
          )}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">A</div>
            <div className="sb-user-info">
              <p className="sb-user-name">Admin</p>
              <p className="sb-user-role">Super Admin</p>
            </div>
          </div>
          <button className="sb-logout" onClick={logout}>
            <LogOut size={13} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
