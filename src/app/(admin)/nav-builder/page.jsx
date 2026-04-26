"use client";
import { useState, useEffect } from "react";
import {
  Save, RotateCcw, Plus, Trash2, Eye, EyeOff,
  GripVertical, ChevronDown, ChevronUp, Loader2,
  Check, AlertCircle, ExternalLink, Image, Link as LinkIcon,
} from "lucide-react";
import { api } from "../../../lib/api";

const S = `
.nb-root { max-width: 1100px; margin: 0 auto; }

/* Toolbar */
.nb-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
.nb-toolbar-left { display:flex; align-items:center; gap:12px; }
.nb-status { display:flex; align-items:center; gap:7px; font-size:12px; color:var(--text3); }
.nb-dot { width:8px; height:8px; border-radius:50%; background:var(--green); }
.nb-dot.dirty { background:var(--amber); }

/* Section card */
.nb-section { background:var(--white); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:24px; }
.nb-section-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); cursor:pointer; }
.nb-section-title { font-family:var(--font-serif); font-size:18px; color:var(--dark); }
.nb-section-title em { font-style:italic; color:var(--gold); }
.nb-section-body { padding:20px; }

/* Nav item row */
.ni-row { display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:8px; transition:box-shadow .15s; }
.ni-row.dragging { opacity:.5; box-shadow:var(--shadow-md); }
.ni-drag { color:var(--text3); cursor:grab; flex-shrink:0; }
.ni-drag:active { cursor:grabbing; }
.ni-name { font-size:13px; font-weight:500; color:var(--dark); flex:1; min-width:0; }
.ni-href { font-size:11.5px; color:var(--text3); font-family:monospace; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ni-actions { display:flex; gap:6px; flex-shrink:0; }
.ni-btn { background:none; border:1px solid var(--border); border-radius:var(--radius); width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text2); transition:all .15s; }
.ni-btn:hover { border-color:var(--gold); color:var(--gold); }
.ni-btn.vis-on { color:var(--green); }
.ni-btn.danger:hover { border-color:var(--red); color:var(--red); }
.ni-badge { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; padding:2px 7px; border-radius:2px; font-weight:500; }
.ni-badge.mega { background:var(--blue-bg); color:var(--blue); }
.ni-badge.hidden { background:var(--border); color:var(--text3); }

/* Inline edit */
.ni-edit-form { padding:12px 14px; background:var(--white); border:1px solid var(--border); border-radius:var(--radius); margin-top:-4px; margin-bottom:8px; }
.ni-edit-grid { display:grid; grid-template-columns:1fr 1fr auto; gap:10px; align-items:end; }
.ni-edit-label { font-size:9.5px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--text3); margin-bottom:4px; display:block; }
.ni-edit-input { border:1px solid var(--border); padding:8px 10px; font-size:13px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); width:100%; }
.ni-edit-input:focus { border-color:var(--gold); }
.ni-edit-actions { display:flex; gap:8px; margin-top:10px; }

/* Mega col */
.mc-wrap { border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; overflow:hidden; }
.mc-head { display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--bg); }
.mc-title-input { border:1px solid var(--border); padding:5px 8px; font-size:12px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); flex:1; }
.mc-title-input:focus { border-color:var(--gold); }
.mc-items { padding:10px 14px; }
.mc-item-row { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid #F5EDE3; }
.mc-item-row:last-child { border-bottom:none; }
.mc-item-input { border:1px solid var(--border); padding:5px 8px; font-size:12px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); flex:1; }
.mc-item-input:focus { border-color:var(--gold); }

/* Image row */
.img-row { display:grid; grid-template-columns:80px 1fr 1fr auto; gap:10px; align-items:center; padding:10px 14px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:8px; }
.img-preview { width:80px; height:50px; object-fit:cover; border-radius:var(--radius); background:var(--border); display:block; }
.img-input { border:1px solid var(--border); padding:6px 10px; font-size:12px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); width:100%; }
.img-input:focus { border-color:var(--gold); }

/* Hints */
.hint-wrap { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
.hint-chip { display:flex; align-items:center; gap:6px; background:var(--bg); border:1px solid var(--border); border-radius:20px; padding:4px 12px; font-size:12px; color:var(--text2); }
.hint-chip-del { background:none; border:none; cursor:pointer; color:var(--text3); display:flex; padding:0; transition:color .15s; }
.hint-chip-del:hover { color:var(--red); }
.hint-add-row { display:flex; gap:8px; }
.hint-add-input { border:1px solid var(--border); padding:7px 12px; font-size:12.5px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); flex:1; }
.hint-add-input:focus { border-color:var(--gold); }

/* Toast */
.nb-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); padding:11px 24px; border-radius:var(--radius); font-size:13px; z-index:200; display:flex; align-items:center; gap:8px; box-shadow:var(--shadow-md); animation:toast-in .25s ease; white-space:nowrap; }
@keyframes toast-in { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
.nb-toast.success { background:var(--dark); color:var(--gold-light); }
.nb-toast.error   { background:var(--red);  color:#fff; }

/* Save bar */
.nb-save-bar { position:fixed; bottom:0; left:var(--sidebar-w); right:0; background:var(--white); border-top:1px solid var(--border); padding:14px 28px; display:flex; align-items:center; justify-content:space-between; z-index:50; box-shadow:0 -4px 20px rgba(44,26,14,.08); }
`;

/* ── small helpers ── */
const uid = () => Math.random().toString(36).slice(2, 9);

export default function NavBuilderPage() {
  const [navData, setNavData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [dirty,   setDirty]   = useState(false);
  const [toast,   setToast]   = useState(null);

  /* open/close states */
  const [editingNavId, setEditingNavId] = useState(null);
  const [newHint,      setNewHint]      = useState("");

  /* Load */
  useEffect(() => {
    api.homeSection && (async () => {})(); // keep admin api alive
    (async () => {
      try {
        const { nav } = await api.homepage.getConfig().catch(() => ({})); // reuse admin token
        // Actually fetch nav config
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/nav/admin",
          { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } }
        );
        const data = await res.json();
        setNavData(data.nav || null);
      } catch {
        showToast("Could not load — using defaults", "error");
      } finally { setLoading(false); }
    })();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const mark = () => setDirty(true);

  /* ── Save ── */
  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/nav",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify(navData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDirty(false);
      showToast("Navigation saved ✓");
    } catch (e) {
      showToast(e.message || "Save failed", "error");
    } finally { setSaving(false); }
  };

  /* ── Reset ── */
  const reset = async () => {
    if (!confirm("Reset to defaults? All changes will be lost.")) return;
    const res = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/nav/reset",
      { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } }
    );
    const data = await res.json();
    setNavData(data.nav);
    setDirty(false);
    showToast("Reset to defaults ✓");
  };

  /* ── Nav item helpers ── */
  const toggleNavVisible = (id) => {
    setNavData(p => ({ ...p, navItems: p.navItems.map(i => i._id === id ? { ...i, visible: !i.visible } : i) }));
    mark();
  };
  const removeNavItem = (id) => {
    setNavData(p => ({ ...p, navItems: p.navItems.filter(i => i._id !== id) }));
    mark();
  };
  const updateNavItem = (id, key, val) => {
    setNavData(p => ({ ...p, navItems: p.navItems.map(i => i._id === id ? { ...i, [key]: val } : i) }));
    mark();
  };
  const addNavItem = () => {
    setNavData(p => ({ ...p, navItems: [...(p.navItems || []), { _id: uid(), name: "New Link", href: "/", visible: true, hasMegaMenu: false, order: (p.navItems?.length || 0) }] }));
    mark();
  };

  /* ── Mega col helpers ── */
  const updateMegaColTitle = (id, val) => {
    setNavData(p => ({ ...p, megaCols: p.megaCols.map(c => c._id === id ? { ...c, title: val } : c) }));
    mark();
  };
  const updateMegaItem = (colId, si, key, val) => {
    setNavData(p => ({
      ...p,
      megaCols: p.megaCols.map(c => c._id === colId
        ? { ...c, items: c.items.map((it, i) => i === si ? { ...it, [key]: val } : it) }
        : c
      ),
    }));
    mark();
  };
  const addMegaItem = (colId) => {
    setNavData(p => ({
      ...p,
      megaCols: p.megaCols.map(c => c._id === colId
        ? { ...c, items: [...c.items, { label: "New Item", href: "/listing", visible: true }] }
        : c
      ),
    }));
    mark();
  };
  const removeMegaItem = (colId, si) => {
    setNavData(p => ({
      ...p,
      megaCols: p.megaCols.map(c => c._id === colId ? { ...c, items: c.items.filter((_, i) => i !== si) } : c),
    }));
    mark();
  };

  /* ── Image helpers ── */
  const updateImg = (id, key, val) => {
    setNavData(p => ({ ...p, megaImgs: p.megaImgs.map(i => i._id === id ? { ...i, [key]: val } : i) }));
    mark();
  };
  const addImg = () => {
    setNavData(p => ({ ...p, megaImgs: [...(p.megaImgs || []), { _id: uid(), src: "", alt: "", href: "/listing", visible: true, order: (p.megaImgs?.length || 0) }] }));
    mark();
  };
  const removeImg = (id) => {
    setNavData(p => ({ ...p, megaImgs: p.megaImgs.filter(i => i._id !== id) }));
    mark();
  };

  /* ── Hint helpers ── */
  const addHint = () => {
    if (!newHint.trim()) return;
    setNavData(p => ({ ...p, searchHints: [...(p.searchHints || []), newHint.trim()] }));
    setNewHint("");
    mark();
  };
  const removeHint = (i) => {
    setNavData(p => ({ ...p, searchHints: p.searchHints.filter((_, idx) => idx !== i) }));
    mark();
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300, gap:10, color:"var(--text3)" }}>
      <Loader2 size={22} style={{ animation:"spin .8s linear infinite" }} />
      Loading nav config…
    </div>
  );

  if (!navData) return (
    <div style={{ textAlign:"center", padding:60, color:"var(--text3)" }}>
      <AlertCircle size={28} style={{ margin:"0 auto 12px" }} />
      <p>Could not load navigation config.</p>
    </div>
  );

  return (
    <>
      <style>{S}</style>
      {toast && <div className={`nb-toast ${toast.type}`}>{toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />} {toast.msg}</div>}

      <div className="nb-root">
        {/* Toolbar */}
        <div className="nb-toolbar">
          <div className="nb-toolbar-left">
            <div className="nb-status">
              <span className={`nb-dot${dirty ? " dirty" : ""}`} />
              {dirty ? "Unsaved changes" : "All changes saved"}
            </div>
          </div>
          <a href="http://localhost:3000" target="_blank" rel="noopener"
            style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", color:"var(--gold)", textDecoration:"none", border:"1px solid var(--border)", padding:"7px 14px", borderRadius:"var(--radius)" }}>
            <ExternalLink size={12} /> Preview
          </a>
        </div>

        {/* ── 1. Topbar ── */}
        <div className="nb-section">
          <div className="nb-section-head" style={{ cursor:"default" }}>
            <span className="nb-section-title">Announcement <em>Topbar</em></span>
            <button className={`ni-btn${navData.topbar?.visible ? " vis-on" : ""}`}
              onClick={() => { setNavData(p => ({ ...p, topbar: { ...p.topbar, visible: !p.topbar.visible } })); mark(); }}>
              {navData.topbar?.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
          <div className="nb-section-body">
            <label className="ni-edit-label">Topbar Text</label>
            <input className="ni-edit-input" value={navData.topbar?.text || ""}
              onChange={e => { setNavData(p => ({ ...p, topbar: { ...p.topbar, text: e.target.value } })); mark(); }}
              placeholder="FREE SHIPPING ON ORDERS ABOVE ₹50,000 · BIS HALLMARKED" />
          </div>
        </div>

        {/* ── 2. Nav Items ── */}
        <div className="nb-section">
          <div className="nb-section-head" style={{ cursor:"default" }}>
            <span className="nb-section-title">Navigation <em>Links</em></span>
            <button className="btn btn-outline btn-sm" onClick={addNavItem}><Plus size={13} /> Add Link</button>
          </div>
          <div className="nb-section-body">
            {(navData.navItems || []).map((item) => (
              <div key={item._id}>
                <div className="ni-row">
                  <GripVertical size={15} className="ni-drag" />
                  <span className="ni-name">{item.name}</span>
                  <span className="ni-href">{item.href}</span>
                  {item.hasMegaMenu && <span className="ni-badge mega">Mega Menu</span>}
                  {!item.visible && <span className="ni-badge hidden">Hidden</span>}
                  <div className="ni-actions">
                    <button className={`ni-btn${item.visible ? " vis-on" : ""}`}
                      onClick={() => toggleNavVisible(item._id)} title={item.visible ? "Hide" : "Show"}>
                      {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                    <button className="ni-btn" onClick={() => setEditingNavId(editingNavId === item._id ? null : item._id)} title="Edit">
                      ✏
                    </button>
                    <button className="ni-btn danger" onClick={() => removeNavItem(item._id)} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Inline edit */}
                {editingNavId === item._id && (
                  <div className="ni-edit-form">
                    <div className="ni-edit-grid">
                      <div>
                        <label className="ni-edit-label">Label</label>
                        <input className="ni-edit-input" value={item.name}
                          onChange={e => updateNavItem(item._id, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className="ni-edit-label">URL / Route</label>
                        <input className="ni-edit-input" value={item.href}
                          onChange={e => updateNavItem(item._id, "href", e.target.value)}
                          placeholder="/listing?category=Ring" />
                      </div>
                      <div>
                        <label className="ni-edit-label">Has Mega Menu</label>
                        <select className="ni-edit-input" value={item.hasMegaMenu ? "yes" : "no"}
                          onChange={e => updateNavItem(item._id, "hasMegaMenu", e.target.value === "yes")}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                    <div className="ni-edit-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => setEditingNavId(null)}>Done</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Mega Menu Columns ── */}
        <div className="nb-section">
          <div className="nb-section-head" style={{ cursor:"default" }}>
            <span className="nb-section-title">Mega Menu <em>Columns</em></span>
          </div>
          <div className="nb-section-body">
            {(navData.megaCols || []).map((col) => (
              <div key={col._id} className="mc-wrap">
                <div className="mc-head">
                  <GripVertical size={13} style={{ color:"var(--text3)" }} />
                  <input className="mc-title-input" value={col.title || ""} placeholder="Column heading (leave blank for no heading)"
                    onChange={e => updateMegaColTitle(col._id, e.target.value)} />
                  <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text2)", cursor:"pointer" }}>
                    <input type="checkbox" checked={!!col.highlightLast}
                      onChange={e => { setNavData(p => ({ ...p, megaCols: p.megaCols.map(c => c._id === col._id ? { ...c, highlightLast: e.target.checked } : c) })); mark(); }}
                      style={{ accentColor:"var(--gold)" }} />
                    Highlight last item
                  </label>
                </div>
                <div className="mc-items">
                  {col.items.map((item, si) => (
                    <div key={si} className="mc-item-row">
                      <input className="mc-item-input" value={item.label || ""}
                        onChange={e => updateMegaItem(col._id, si, "label", e.target.value)}
                        placeholder="Label" />
                      <input className="mc-item-input" value={item.href || ""}
                        onChange={e => updateMegaItem(col._id, si, "href", e.target.value)}
                        placeholder="/listing?category=Ring" />
                      <button className="ni-btn danger" onClick={() => removeMegaItem(col._id, si)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                  <button className="btn btn-outline btn-sm" style={{ marginTop:8 }} onClick={() => addMegaItem(col._id)}>
                    <Plus size={12} /> Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Mega Menu Images ── */}
        <div className="nb-section">
          <div className="nb-section-head" style={{ cursor:"default" }}>
            <span className="nb-section-title">Mega Menu <em>Images</em></span>
            <button className="btn btn-outline btn-sm" onClick={addImg}><Plus size={13} /> Add Image</button>
          </div>
          <div className="nb-section-body">
            {(navData.megaImgs || []).map((img) => (
              <div key={img._id} className="img-row">
                <img src={img.src || "https://picsum.photos/80/50"} alt={img.alt} className="img-preview" />
                <div>
                  <label style={{ fontSize:9.5, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text3)", display:"block", marginBottom:3 }}>Image URL</label>
                  <input className="img-input" value={img.src} onChange={e => updateImg(img._id, "src", e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label style={{ fontSize:9.5, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"var(--text3)", display:"block", marginBottom:3 }}>Alt & Link</label>
                  <input className="img-input" value={img.alt} onChange={e => updateImg(img._id, "alt", e.target.value)} placeholder="Label text" style={{ marginBottom:4 }} />
                  <input className="img-input" value={img.href} onChange={e => updateImg(img._id, "href", e.target.value)} placeholder="/listing" />
                </div>
                <button className="ni-btn danger" onClick={() => removeImg(img._id)}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Search Hints ── */}
        <div className="nb-section">
          <div className="nb-section-head" style={{ cursor:"default" }}>
            <span className="nb-section-title">Search <em>Hints</em></span>
          </div>
          <div className="nb-section-body">
            <div className="hint-wrap">
              {(navData.searchHints || []).map((h, i) => (
                <div key={i} className="hint-chip">
                  {h}
                  <button className="hint-chip-del" onClick={() => removeHint(i)}>✕</button>
                </div>
              ))}
            </div>
            <div className="hint-add-row">
              <input className="hint-add-input" placeholder="Add a search hint…" value={newHint}
                onChange={e => setNewHint(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addHint()} />
              <button className="btn btn-outline btn-sm" onClick={addHint}><Plus size={13} /> Add</button>
            </div>
          </div>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* Save bar */}
      <div className="nb-save-bar">
        <span style={{ fontSize:13, color:"var(--text2)", display:"flex", alignItems:"center", gap:8 }}>
          <LinkIcon size={14} style={{ color:"var(--gold)" }} /> Navigation Config
          {dirty && <span style={{ color:"var(--amber)", display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={13} /> Unsaved</span>}
        </span>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-outline btn-md" onClick={reset}>
            <RotateCcw size={13} /> Reset
          </button>
          <button className="btn btn-primary btn-md" onClick={save} disabled={saving || !dirty}>
            {saving ? <><Loader2 size={13} style={{ animation:"spin .8s linear infinite" }} /> Saving…</> : <><Save size={13} /> Save Changes</>}
          </button>
        </div>
      </div>
    </>
  );
}
