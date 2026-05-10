"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import Header  from "../../components/layout/Header";

const S = `
.admin-shell { display:flex; min-height:100vh; }
.admin-main  { margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; min-width:0; }
.admin-content { flex:1; padding:24px 28px; }
.sb-overlay { display:none; }
@media(max-width:900px) {
  .admin-main { margin-left:0; }
  .sb-overlay {
    display:block; position:fixed; inset:0;
    background:rgba(0,0,0,0.55); z-index:49;
    animation:sb-fade .2s ease;
  }
  @keyframes sb-fade { from{opacity:0} to{opacity:1} }
}
`;

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready,       setReady]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/login");
    else setReady(true);
  }, [pathname]);

  // Route change pe sidebar band karo
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!ready) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--dark2)" }}>
      <div style={{ fontFamily:"var(--font-serif)", fontSize:22, color:"var(--gold-light)", letterSpacing:3 }}>MANAS…</div>
    </div>
  );

  return (
    <>
      <style>{S}</style>
      <div className="admin-shell">

        {/* Mobile overlay — click se sidebar band */}
        {sidebarOpen && (
          <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="admin-main">
          <Header onMenuClick={() => setSidebarOpen(o => !o)} />
          <main className="admin-content">{children}</main>
        </div>

      </div>
    </>
  );
}