"use client";
import { useState, useEffect, useRef } from "react";
import {
  GripVertical, Eye, EyeOff, Settings2, Trash2, Plus,
  Save, RotateCcw, Check, Loader2, ChevronDown, ChevronUp,
  Layout, AlertCircle, ExternalLink, X, Menu, ArrowLeft,Upload
} from "lucide-react";
import { api } from "../../../lib/api";

const SECTION_TYPES = {
  hero_carousel:  { label: "Hero Carousel",      icon: "🖼", color: "#B8862A", desc: "Full-width slideshow with CTA" },
  collection_grid:{ label: "Collections Grid",   icon: "⊞", color: "#185FA5", desc: "3-panel collection mosaic" },
  categories:     { label: "Shop by Category",   icon: "◉", color: "#2e7d32", desc: "Category tile row" },
  trending:       { label: "Trending Jewellery",  icon: "★", color: "#854F0B", desc: "Best-seller cards" },
  new_arrivals:   { label: "New Arrivals",        icon: "✦", color: "#993C1D", desc: "New arrivals strip" },
  trust_world:    { label: "MANAS World",         icon: "♦", color: "#4A3728", desc: "Trust features" },
  product_row:    { label: "Product Row",         icon: "▦", color: "#185FA5", desc: "Filtered product scroll" },
  banner_single:  { label: "Full Banner",         icon: "▬", color: "#2C1A0E", desc: "Full-width banner" },
  banner_split:   { label: "Split Banner",        icon: "▩", color: "#3A2818", desc: "Two-column banner" },
  newsletter:     { label: "Newsletter",          icon: "✉", color: "#2e7d32", desc: "Email subscription" },
  testimonials:   { label: "Testimonials",        icon: "❝", color: "#854F0B", desc: "Customer reviews" },
};

const CATEGORIES = ["Ring","Necklace","Earring","Bangle","Bracelet","Mangalsutra","Pendant","Other"];
const PURITIES   = ["22KT","18KT","14KT","24KT"];

const S = `
/* ── Root ── */
.pb-root { max-width: 1240px; margin: 0 auto; padding-bottom: 80px; }

/* ── Toolbar ── */
.pb-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.pb-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pb-toolbar-right { display: flex; align-items: center; gap: 8px; }
.pb-status { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text3); }
.pb-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink:0; }
.pb-status-dot.saving { background: var(--amber); animation: pulse-dot 1s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.pb-live-link { display: flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); text-decoration: none; border: 1px solid var(--border); padding: 7px 14px; border-radius: var(--radius); transition: all .2s; white-space:nowrap; }
.pb-live-link:hover { border-color: var(--gold); }

/* ── Layout — sidebar + canvas ── */
.pb-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; align-items: start; }
@media(max-width:900px) { .pb-layout { grid-template-columns: 1fr; } }

/* ── Sidebar ── */
.pb-sidebar { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); position: sticky; top: 80px; }
@media(max-width:900px) {
  .pb-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 280px; max-width: 88vw; z-index: 200; border-radius: 0; transform: translateX(-100%); transition: transform .3s cubic-bezier(.4,0,.2,1); box-shadow: 6px 0 32px rgba(44,26,14,.18); overflow-y: auto; }
  .pb-sidebar.open { transform: translateX(0); }
}
.pb-sidebar-head { padding: 14px 16px; border-bottom: 1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.pb-sidebar-title { font-family: var(--font-serif); font-size: 17px; color: var(--dark); }
.pb-sidebar-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }
.pb-sidebar-close { display:none; background:none; border:none; cursor:pointer; color:var(--text3); padding:4px; }
@media(max-width:900px) { .pb-sidebar-close { display:flex; align-items:center; } }
.pb-type-list { padding: 8px 0; }
@media(max-width:900px) { .pb-type-list { max-height: none; } }
.pb-type-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; cursor: pointer; transition: background .15s; border: none; background: none; width: 100%; text-align: left; font-family: var(--font-sans); }
.pb-type-item:hover { background: var(--bg); }
.pb-type-item.disabled { opacity: .4; cursor: not-allowed; }
.pb-type-icon { width: 32px; height: 32px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.pb-type-label { font-size: 13px; font-weight: 500; color: var(--dark); }
.pb-type-desc { font-size: 11px; color: var(--text3); margin-top: 1px; }
.pb-type-add { margin-left: auto; color: var(--gold); flex-shrink: 0; }

/* ── Sidebar overlay ── */
.pb-sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(20,10,5,.5); z-index:199; backdrop-filter:blur(2px); animation:pb-fade .2s; }
@keyframes pb-fade { from{opacity:0} to{opacity:1} }
@media(max-width:900px) { .pb-sidebar-overlay.show { display:block; } }

/* ── Add section mobile FAB ── */
.pb-add-fab { display:none; position:fixed; bottom:80px; right:16px; z-index:50; background:var(--dark); color:var(--gold-light); border:none; width:52px; height:52px; border-radius:50%; cursor:pointer; box-shadow:0 4px 20px rgba(44,26,14,.35); align-items:center; justify-content:center; transition:background .2s; }
.pb-add-fab:hover { background:var(--gold); color:var(--dark); }
@media(max-width:900px) { .pb-add-fab { display:flex; } }

/* ── Canvas ── */
.pb-canvas { display: flex; flex-direction: column; gap: 8px; min-height: 300px; }
.pb-empty-canvas { border: 2px dashed var(--border); border-radius: var(--radius); padding: 60px 20px; text-align: center; color: var(--text3); }
.pb-empty-canvas-icon { font-size: 36px; margin-bottom: 12px; }
.pb-empty-canvas-text { font-family: var(--font-serif); font-size: 20px; color: var(--dark); }
.pb-empty-canvas-sub { font-size: 12px; margin-top: 6px; margin-bottom:20px; }

/* ── Section card ── */
.pb-section-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); transition: box-shadow .2s; user-select: none; }
.pb-section-card.dragging { opacity: .5; box-shadow: 0 8px 32px rgba(44,26,14,.18); }
.pb-section-card.drag-over { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(184,134,42,.2); }
.pb-section-card.hidden { opacity: .55; }
.pb-section-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; cursor: default; flex-wrap:nowrap; }
.pb-drag-handle { color: var(--text3); cursor: grab; flex-shrink: 0; transition: color .2s; }
.pb-drag-handle:hover { color: var(--gold); }
.pb-drag-handle:active { cursor: grabbing; }
@media(max-width:600px) { .pb-drag-handle { display:none; } }
.pb-section-icon { width: 30px; height: 30px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.pb-section-info { flex: 1; min-width: 0; }
.pb-section-label-input { background:none; border:none; outline:none; width:100%; cursor:text; font:inherit; font-size:13px; font-weight:500; color:var(--dark); padding:0; }
.pb-section-type  { font-size: 10px; color: var(--text3); margin-top: 1px; letter-spacing: .3px; }
.pb-section-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
.pb-icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: var(--radius); color: var(--text3); display: flex; align-items: center; transition: all .15s; }
.pb-icon-btn:hover { background: var(--bg); color: var(--dark); }
.pb-icon-btn.active { color: var(--gold); }
.pb-icon-btn.danger:hover { color: var(--red); }
/* Hide less-critical buttons on very small screens */
@media(max-width:400px) {
  .pb-section-badge { display:none; }
}
.pb-section-badge { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; font-weight: 500; flex-shrink:0; }
.pb-section-badge.visible { background: var(--green-bg); color: var(--green); }
.pb-section-badge.hidden  { background: var(--border); color: var(--text3); }
.pb-order-badge { font-size: 10px; font-weight: 600; color: var(--text3); background: var(--bg); border: 1px solid var(--border); border-radius: 2px; padding: 2px 6px; min-width: 22px; text-align: center; flex-shrink:0; }

/* ── Settings panel ── */
.pb-settings { border-top: 1px solid var(--border); padding: 16px; background: var(--bg); border-radius: 0 0 var(--radius) var(--radius); }
.pb-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.pb-settings-grid.full { grid-template-columns: 1fr; }
.pb-settings-grid.three { grid-template-columns: 1fr 1fr 1fr; }
@media(max-width:560px) {
  .pb-settings-grid { grid-template-columns: 1fr; }
  .pb-settings-grid.three { grid-template-columns: 1fr 1fr; }
}
.pb-field { display: flex; flex-direction: column; gap: 4px; }
.pb-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); }
.pb-input, .pb-select { border: 1px solid var(--border); padding: 8px 10px; font-size: 12.5px; color: var(--dark); font-family: var(--font-sans); outline: none; border-radius: var(--radius); background: var(--white); width: 100%; transition: border-color .2s; }
.pb-input:focus, .pb-select:focus { border-color: var(--gold); }
.pb-slides-list { display: flex; flex-direction: column; gap: 8px; }
.pb-slide-row { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; }
.pb-slide-row-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: var(--dark); }
.pb-add-slide-btn { display: flex; align-items: center; gap: 6px; background: none; border: 1px dashed var(--border); padding: 8px 14px; font-size: 12px; color: var(--text3); cursor: pointer; border-radius: var(--radius); font-family: var(--font-sans); transition: all .2s; width: 100%; justify-content: center; margin-top: 4px; }
.pb-add-slide-btn:hover { border-color: var(--gold); color: var(--gold); }
.pb-section-settings-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text2); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.pb-section-settings-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── Save bar ── */
.pb-save-bar { position: fixed; bottom: 0; left: var(--sidebar-w,240px); right: 0; background: var(--white); border-top: 1px solid var(--border); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 50; box-shadow: 0 -4px 20px rgba(44,26,14,.08); gap:10px; flex-wrap:wrap; }
@media(max-width:768px) { .pb-save-bar { left: 0; padding: 10px 16px; } }
.pb-save-bar-info { font-size: 12px; color: var(--text2); display: flex; align-items: center; gap: 8px; flex-wrap:wrap; }
.pb-save-bar-actions { display: flex; gap: 8px; flex-shrink:0; }

/* Toast */
.pb-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--dark); color: var(--gold-light); padding: 11px 20px; border-radius: var(--radius); font-size: 13px; z-index: 300; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.25); animation: toast-in .25s ease; white-space:nowrap; }
@keyframes toast-in { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

/* Mobile top bar for add button */
.pb-mobile-topbar { display:none; align-items:center; justify-content:space-between; margin-bottom:16px; }
@media(max-width:900px) { .pb-mobile-topbar { display:flex; } }


/* ── Image Uploader ── */
.pb-img-uploader { display: flex; flex-direction: column; gap: 0; }
.pb-img-preview { position: relative; width: 100%; aspect-ratio: 16/7; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); background: var(--bg); margin-bottom: 8px; }
.pb-img-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pb-img-preview-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text3); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; flex-direction: column; gap: 6px; }
.pb-img-preview-del { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: rgba(44,26,14,.75); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: background .15s; }
.pb-img-preview-del:hover { background: var(--red); }
.pb-img-actions { display: flex; gap: 6px; margin-bottom: 6px; }
.pb-img-upload-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--white); border: 1px solid var(--border); padding: 7px 10px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text2); cursor: pointer; border-radius: var(--radius); font-family: var(--font-sans); transition: all .15s; }
.pb-img-upload-btn:hover { border-color: var(--gold); color: var(--gold); }
.pb-img-upload-btn:disabled { opacity: .5; cursor: not-allowed; }
.pb-img-progress { height: 2px; background: var(--gold-pale,#fdf3e0); border-radius: 1px; overflow: hidden; margin-bottom: 6px; }
.pb-img-progress-bar { height: 100%; background: var(--gold); transition: width .3s ease; }
.pb-img-url-row { display: flex; gap: 6px; }
.pb-img-sep { display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: 10px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; }
.pb-img-sep::before, .pb-img-sep::after { content:''; flex:1; height:1px; background:var(--border); }
@keyframes spin { to { transform: rotate(360deg); } }
.loader-spin { animation: spin .8s linear infinite; }
`;

/* ══════════════════════════════════════════
   IMAGE UPLOADER — single image, reusable
   value: current URL string
   onChange: (url: string) => void
   aspect: CSS aspect-ratio string for preview box (default "16/7")
══════════════════════════════════════════ */


function ImageUploader({ value, onChange, aspect = "16/7", placeholder = "No image" }) {
  const BASE       = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const fileRef   = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [urlInput,  setUrlInput]  = useState("");
  const [urlErr,    setUrlErr]    = useState("");
 
  const uploadFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert(`${file.name} exceeds 5 MB`); return; }
    setUploading(true); setProgress(10);
    try {
      const token    = typeof window !== "undefined" && localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("image", file);
      const res  = await fetch(`${BASE}/upload/single`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      setProgress(80);
      const data = await res.json();
      if (data.success && data.url) { onChange(data.url); setProgress(100); }
      else throw new Error(data.message || "Upload failed");
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false); setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
 
  const handleUrl = () => {
    setUrlErr("");
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http")) { setUrlErr("Enter a valid URL starting with http"); return; }
    onChange(url);
    setUrlInput("");
  };
 
  return (
    <div className="pb-img-uploader">
      {/* Preview */}
      <div className="pb-img-preview" style={{ aspectRatio: aspect }}>
        {value
          ? <>
              <img src={value} alt="preview" />
              <button className="pb-img-preview-del" type="button" onClick={() => onChange("")}>✕</button>
            </>
          : <div className="pb-img-preview-empty">
              <span style={{ fontSize:20, opacity:.3 }}>🖼</span>
              <span>{placeholder}</span>
            </div>
        }
      </div>
 
      {/* Upload + progress */}
      <div className="pb-img-actions">
        <button type="button" className="pb-img-upload-btn" disabled={uploading}
          onClick={() => fileRef.current?.click()}>
          {uploading
            ? <><Loader2 size={12} className="loader-spin" /> Uploading {progress}%</>
            : <><Upload size={12} /> Upload Image</>
          }
        </button>
      </div>
      {uploading && (
        <div className="pb-img-progress">
          <div className="pb-img-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
 
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
        onChange={e => uploadFile(e.target.files?.[0])} />
 
      {/* URL fallback */}
      <div className="pb-img-sep">or paste URL</div>
      <div className="pb-img-url-row">
        <input className="pb-input" value={urlInput} placeholder="https://..."
          onChange={e => { setUrlInput(e.target.value); setUrlErr(""); }}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleUrl())} />
        <button type="button" className="pb-icon-btn" style={{ border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"6px 10px" }}
          onClick={handleUrl}><Plus size={13}/></button>
      </div>
      {urlErr && <p style={{ fontSize:11, color:"var(--red)", marginTop:4 }}>{urlErr}</p>}
    </div>
  );
}

/* ── Section Settings ── */
function SectionSettings({ section, onChange }) {
  const s = section.settings || {};
  const set = (key, val) => onChange({ ...section, settings: { ...s, [key]: val } });

  switch (section.type) {
    case "hero_carousel": {
      const slides = s.slides || [{}];
      const updateSlide = (i, key, val) => {
        const ns = [...slides]; ns[i] = { ...ns[i], [key]: val }; set("slides", ns);
      };
      return (
        <div>
          <p className="pb-section-settings-title">Slides</p>
          <div className="pb-settings-grid full" style={{ marginBottom:8 }}>
            <div className="pb-field">
              <label className="pb-label">Autoplay Delay (ms)</label>
              <input className="pb-input" type="number" value={s.autoplayDelay||4500} onChange={e => set("autoplayDelay", Number(e.target.value))}/>
            </div>
          </div>
          <div className="pb-slides-list">
            {slides.map((slide, i) => (
              <div key={i} className="pb-slide-row">
                <div className="pb-slide-row-head">
                  Slide {i+1}
                  {slides.length > 1 && <button className="pb-icon-btn danger" onClick={() => set("slides", slides.filter((_,j)=>j!==i))}><X size={13}/></button>}
                </div>
                  {/* ── Image uploader ── */}
                <div style={{ marginBottom:10 }}>
                  <label className="pb-label" style={{ display:"block", marginBottom:6 }}>Slide Image</label>
                  <ImageUploader
                    value={slide.img || ""}
                    onChange={val => updateSlide(i, "img", val)}
                    aspect="16/7"
                    placeholder="No slide image"
                  />
                </div>
                {[["eyebrow","Eyebrow Text"],["title","Title"],["titleEm","Italic Highlight"],["subtitle","Subtitle"],["ctaLabel","CTA Label"],["ctaHref","CTA Link"]].map(([k,l]) => (
                  <div key={k} style={{ marginBottom:7 }}>
                    <label className="pb-label" style={{ display:"block", marginBottom:3 }}>{l}</label>
                    <input className="pb-input" value={slide[k]||""} onChange={e => updateSlide(i,k,e.target.value)} placeholder={k==="img"?"https://...":""} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="pb-add-slide-btn" onClick={() => set("slides",[...slides,{}])}><Plus size={13}/> Add Slide</button>
        </div>
      );
    }

    case "trending": case "new_arrivals": case "product_row": {
      const pf = s.productFilter || {};
      const setPf = (k,v) => set("productFilter",{...pf,[k]:v});
      return (
        <div>
          <p className="pb-section-settings-title">Section Heading</p>
          <div className="pb-settings-grid">
            <div className="pb-field"><label className="pb-label">Title</label><input className="pb-input" value={s.title||""} onChange={e=>set("title",e.target.value)} placeholder="Trending Now"/></div>
            <div className="pb-field"><label className="pb-label">Subtitle</label><input className="pb-input" value={s.subtitle||""} onChange={e=>set("subtitle",e.target.value)}/></div>
          </div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Text</label><input className="pb-input" value={s.ctaText||""} onChange={e=>set("ctaText",e.target.value)} placeholder="View All"/></div></div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Link</label><input className="pb-input" value={s.ctaLink||""} onChange={e=>set("ctaLink",e.target.value)} placeholder="/listing"/></div></div>
          <p className="pb-section-settings-title" style={{marginTop:14}}>Product Filter</p>
          <div className="pb-settings-grid three">
            <div className="pb-field"><label className="pb-label">Category</label>
              <select className="pb-select" value={pf.category||""} onChange={e=>setPf("category",e.target.value)}>
                <option value="">All</option>{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="pb-field"><label className="pb-label">Purity</label>
              <select className="pb-select" value={pf.purity||""} onChange={e=>setPf("purity",e.target.value)}>
                <option value="">Any</option>{PURITIES.map(p=><option key={p} value={p}>{p}</option>)}
              </select></div>
            <div className="pb-field"><label className="pb-label">Limit</label>
              <input className="pb-input" type="number" value={pf.limit||6} min={2} max={12} onChange={e=>setPf("limit",Number(e.target.value))}/></div>
          </div>
          <div style={{display:"flex",gap:16,marginTop:8,flexWrap:"wrap"}}>
            {[["isBestSeller","Best Sellers"],["isNewArrival","New Arrivals"],["isFeatured","Featured"],["isWedding","Bridal"]].map(([k,lbl])=>(
              <label key={k} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12.5,color:"var(--text2)"}}>
                <input type="checkbox" checked={!!pf[k]} onChange={e=>setPf(k,e.target.checked)} style={{accentColor:"var(--gold)",width:14,height:14}}/>{lbl}
              </label>
            ))}
          </div>
        </div>
      );
    }

    case "collection_grid": {
      const cols = s.collections || [{}];
      const updateCol = (i,key,val) => { const nc=[...cols]; nc[i]={...nc[i],[key]:val}; set("collections",nc); };
      return (
        <div>
          <p className="pb-section-settings-title">Section Heading</p>
          <div className="pb-settings-grid">
            <div className="pb-field"><label className="pb-label">Title</label><input className="pb-input" value={s.title||""} onChange={e=>set("title",e.target.value)}/></div>
            <div className="pb-field"><label className="pb-label">Subtitle</label><input className="pb-input" value={s.subtitle||""} onChange={e=>set("subtitle",e.target.value)}/></div>
          </div>
          <p className="pb-section-settings-title" style={{marginTop:14}}>Collections ({cols.length})</p>
          {cols.map((col,i)=>(
            <div key={i} className="pb-slide-row" style={{marginBottom:8}}>
              <div className="pb-slide-row-head">
                Collection {i+1}
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <select className="pb-select" style={{width:"auto",padding:"3px 8px",fontSize:11}} value={col.span||"small"} onChange={e=>updateCol(i,"span",e.target.value)}>
                    <option value="large">Large</option><option value="small">Small</option>
                  </select>
                  {cols.length>1 && <button className="pb-icon-btn danger" onClick={()=>set("collections",cols.filter((_,j)=>j!==i))}><X size={13}/></button>}
                </div>
              </div>
                {/* ── Image uploader ── */}
              <div style={{ marginBottom:10 }}>
                <label className="pb-label" style={{ display:"block", marginBottom:6 }}>Collection Image</label>
                <ImageUploader
                  value={col.img || ""}
                  onChange={val => updateCol(i, "img", val)}
                  aspect="16/7"
                  placeholder="No image"
                />
              </div>
              {[ ["title","Title"],["sub","Subtitle"],["href","Link"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:6}}>
                  <label className="pb-label" style={{display:"block",marginBottom:2}}>{l}</label>
                  <input className="pb-input" value={col[k]||""} onChange={e=>updateCol(i,k,e.target.value)} placeholder={k==="href"?"/listing":""}/>
                </div>
              ))}
            </div>
          ))}
          <button className="pb-add-slide-btn" onClick={()=>set("collections",[...cols,{}])}><Plus size={13}/> Add Collection</button>
        </div>
      );
    }

    case "newsletter":
      return (<div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">Offer Text</label><input className="pb-input" value={s.offerText||""} onChange={e=>set("offerText",e.target.value)} placeholder="Get 5% off your first order"/></div></div>);

    // case "banner_single":
    //   return (
    //     <div>

    //       <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">Banner Image URL</label><input className="pb-input" value={s.bannerImg||""} onChange={e=>set("bannerImg",e.target.value)}/></div></div>
    //       <div className="pb-settings-grid">
    //         <div className="pb-field"><label className="pb-label">Title</label><input className="pb-input" value={s.bannerTitle||""} onChange={e=>set("bannerTitle",e.target.value)}/></div>
    //         <div className="pb-field"><label className="pb-label">CTA Text</label><input className="pb-input" value={s.bannerCta||""} onChange={e=>set("bannerCta",e.target.value)}/></div>
    //       </div>
    //       <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Link</label><input className="pb-input" value={s.bannerHref||""} onChange={e=>set("bannerHref",e.target.value)}/></div></div>
    //     </div>
    //   );
    /* ─────────────────── BANNER SINGLE ─────────────────── */
    case "banner_single":
      return (
        <div>
          <p className="pb-section-settings-title">Banner Image</p>
          <ImageUploader
            value={s.bannerImg || ""}
            onChange={val => set("bannerImg", val)}
              aspect="16/7"
            placeholder="No banner image"
          />
          <div className="pb-settings-grid" style={{marginTop:12}}>
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.bannerTitle||""} onChange={e=>set("bannerTitle",e.target.value)}/></div>
            <div className="pb-field"><label className="pb-label">CTA Text</label>
              <input className="pb-input" value={s.bannerCta||""} onChange={e=>set("bannerCta",e.target.value)}/></div>
          </div>
          <div className="pb-settings-grid full">
            <div className="pb-field"><label className="pb-label">CTA Link</label>
              <input className="pb-input" value={s.bannerHref||""} onChange={e=>set("bannerHref",e.target.value)}/></div>
          </div>
        </div>
      );

         case "banner_split":
      return (
        <div>
          <p className="pb-section-settings-title">Left Panel</p>
          <ImageUploader
            value={s.leftImg || ""}
            onChange={val => set("leftImg", val)}
              aspect="16/7"
            placeholder="Left image"
          />
          <div className="pb-settings-grid" style={{marginTop:10}}>
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.leftTitle||""} onChange={e=>set("leftTitle",e.target.value)}/></div>
            <div className="pb-field"><label className="pb-label">Link</label>
              <input className="pb-input" value={s.leftHref||""} onChange={e=>set("leftHref",e.target.value)} placeholder="/listing"/></div>
          </div>
 
          <p className="pb-section-settings-title" style={{marginTop:14}}>Right Panel</p>
          <ImageUploader
            value={s.rightImg || ""}
            onChange={val => set("rightImg", val)}
            aspect="16/7"
            placeholder="Right image"
          />
          <div className="pb-settings-grid" style={{marginTop:10}}>
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.rightTitle||""} onChange={e=>set("rightTitle",e.target.value)}/></div>
            <div className="pb-field"><label className="pb-label">Link</label>
              <input className="pb-input" value={s.rightHref||""} onChange={e=>set("rightHref",e.target.value)} placeholder="/listing"/></div>
          </div>
        </div>
      );

    default:
      return <p style={{fontSize:12,color:"var(--text3)",fontStyle:"italic"}}>No editable settings for this section type.</p>;
  }
}

/* ── Drag drop hook ── */
function useDragDrop(sections, setSections) {
  const dragIdx = useRef(null);
  const [overIdx, setOverIdx] = useState(null);
  const onDragStart = (e,i) => { dragIdx.current=i; e.dataTransfer.effectAllowed="move"; };
  const onDragOver  = (e,i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (e,i) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from===null||from===i) { setOverIdx(null); return; }
    const next=[...sections]; const [moved]=next.splice(from,1); next.splice(i,0,moved);
    setSections(next); dragIdx.current=null; setOverIdx(null);
  };
  const onDragEnd = () => { dragIdx.current=null; setOverIdx(null); };
  return { onDragStart, onDragOver, onDrop, onDragEnd, overIdx };
}

/* ══ MAIN ══ */
export default function PageBuilderPage() {
  const [sections,  setSections]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [dirty,     setDirty]     = useState(false);
  const [openId,    setOpenId]    = useState(null);
  const [toast,     setToast]     = useState(null);
  const [resetting, setResetting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { onDragStart, onDragOver, onDrop, onDragEnd, overIdx } = useDragDrop(sections, (next) => {
    setSections(next); setDirty(true);
  });

  useEffect(() => {
    (async () => {
      try {
        const { sections: s } = await api.homeSection.getConfig();
        setSections(s || []);
      } catch { showToast("⚠ Could not load"); }
      finally { setLoading(false); }
    })();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2800); };

  const updateSection = (idx, updates) => {
    setSections(prev => prev.map((s,i) => i===idx ? {...s,...updates} : s));
    setDirty(true);
  };

  const toggleVisible = (idx) => updateSection(idx, { visible: !sections[idx].visible });

  const removeSection = (idx) => {
    if (!confirm(`Remove "${sections[idx].label}"?`)) return;
    setSections(prev => prev.filter((_,i) => i!==idx));
    if (openId === sections[idx]?.id) setOpenId(null);
    setDirty(true);
  };

  const addSection = (type) => {
    const meta = SECTION_TYPES[type];
    const newSec = { id:`${type}_${Date.now()}`, type, label:meta.label, visible:true, order:sections.length, settings:{}, products:[] };
    setSections(prev => [...prev, newSec]);
    setOpenId(newSec.id);
    setDirty(true);
    setSidebarOpen(false);
  };

  const save = async () => {
    setSaving(true);
    try { await api.homeSection.saveConfig(sections); setDirty(false); showToast("✓ Home page saved"); }
    catch (e) { showToast("⚠ Save failed: "+e.message); }
    finally { setSaving(false); }
  };

  const reset = async () => {
    if (!confirm("Reset to defaults? All changes will be lost.")) return;
    setResetting(true);
    try { const {sections:s} = await api.homeSection.reset(); setSections(s||[]); setDirty(false); setOpenId(null); showToast("✓ Reset to defaults"); }
    catch (e) { showToast("⚠ "+e.message); }
    finally { setResetting(false); }
  };

  const usedTypes = new Set(sections.map(s => s.type));
  const singleUse = new Set(["hero_carousel","categories","trust_world","newsletter","testimonials"]);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400,color:"var(--text3)",gap:10}}>
      <Loader2 size={22} className="loader-spin"/> Loading page builder…
    </div>
  );

  return (
    <>
      <style>{S}</style>
      {toast && <div className="pb-toast"><Check size={14}/> {toast}</div>}

      {/* Sidebar overlay — mobile */}
      <div className={`pb-sidebar-overlay${sidebarOpen?" show":""}`} onClick={()=>setSidebarOpen(false)}/>

      <div className="pb-root">
        {/* Toolbar */}
        <div className="pb-toolbar">
          <div className="pb-toolbar-left">
            <div className="pb-status">
              <span className={`pb-status-dot${saving?" saving":""}`}/>
              <span>{saving?"Saving…":dirty?"Unsaved changes":"All saved"}</span>
            </div>
            <span style={{color:"var(--border)",fontSize:16,flexShrink:0}}>|</span>
            <span style={{fontSize:12,color:"var(--text3)"}}>{sections.length} sections</span>
          </div>
          <div className="pb-toolbar-right">
            <a href="http://localhost:3000" target="_blank" rel="noopener" className="pb-live-link">
              <ExternalLink size={12}/> Preview
            </a>
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="pb-mobile-topbar">
          <button className="btn btn-outline btn-sm" onClick={()=>setSidebarOpen(true)}>
            <Plus size={13}/> Add Section
          </button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-outline btn-sm" onClick={reset} disabled={resetting}>
              {resetting ? <Loader2 size={13} className="loader-spin"/> : <RotateCcw size={13}/>}
            </button>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving||!dirty}>
              {saving ? <Loader2 size={13} className="loader-spin"/> : <Save size={13}/>}
              {saving ? " Saving…" : " Save"}
            </button>
          </div>
        </div>

        <div className="pb-layout">
          {/* Sidebar */}
          <div className={`pb-sidebar${sidebarOpen?" open":""}`}>
            <div className="pb-sidebar-head">
              <div>
                <p className="pb-sidebar-title">Add <span style={{fontStyle:"italic",color:"var(--gold)"}}>Section</span></p>
                <p className="pb-sidebar-sub">Click to add to page</p>
              </div>
              <button className="pb-sidebar-close" onClick={()=>setSidebarOpen(false)}>
                <X size={20}/>
              </button>
            </div>
            <div className="pb-type-list">
              {Object.entries(SECTION_TYPES).map(([type, meta]) => {
                const isUsed = singleUse.has(type) && usedTypes.has(type);
                return (
                  <button key={type} className={`pb-type-item${isUsed?" disabled":""}`}
                    onClick={()=>!isUsed&&addSection(type)} disabled={isUsed}>
                    <div className="pb-type-icon" style={{background:meta.color+"18",color:meta.color}}>{meta.icon}</div>
                    <div>
                      <p className="pb-type-label">{meta.label}</p>
                      <p className="pb-type-desc">{meta.desc}</p>
                    </div>
                    {!isUsed && <Plus size={13} className="pb-type-add"/>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas */}
          <div className="pb-canvas">
            {sections.length === 0 ? (
              <div className="pb-empty-canvas">
                <div className="pb-empty-canvas-icon">🏗</div>
                <p className="pb-empty-canvas-text">Canvas is empty</p>
                <p className="pb-empty-canvas-sub">Add sections to build your home page</p>
                <button className="btn btn-primary btn-md" onClick={()=>setSidebarOpen(true)}>
                  <Plus size={14}/> Add First Section
                </button>
              </div>
            ) : sections.map((section, idx) => {
              const meta   = SECTION_TYPES[section.type] || {label:section.type,icon:"□",color:"#888"};
              const isOpen = openId === section.id;
              return (
                <div key={section.id}
                  className={`pb-section-card${!section.visible?" hidden":""}${overIdx===idx?" drag-over":""}`}
                  draggable onDragStart={e=>onDragStart(e,idx)} onDragOver={e=>onDragOver(e,idx)}
                  onDrop={e=>onDrop(e,idx)} onDragEnd={onDragEnd}>

                  <div className="pb-section-head">
                    <div className="pb-drag-handle"><GripVertical size={15}/></div>
                    <span className="pb-order-badge">{idx+1}</span>
                    <div className="pb-section-icon" style={{background:meta.color+"18",color:meta.color}}>{meta.icon}</div>
                    <div className="pb-section-info">
                      <input className="pb-section-label-input" value={section.label}
                        onChange={e=>updateSection(idx,{label:e.target.value})} title="Click to rename"/>
                      <p className="pb-section-type">{meta.label}</p>
                    </div>
                    <span className={`pb-section-badge ${section.visible?"visible":"hidden"}`}>
                      {section.visible?"Visible":"Hidden"}
                    </span>
                    <div className="pb-section-actions">
                      <button className={`pb-icon-btn${section.visible?" active":""}`} onClick={()=>toggleVisible(idx)}>
                        {section.visible ? <Eye size={14}/> : <EyeOff size={14}/>}
                      </button>
                      <button className={`pb-icon-btn${isOpen?" active":""}`} onClick={()=>setOpenId(isOpen?null:section.id)}>
                        <Settings2 size={14}/>
                      </button>
                      <button className="pb-icon-btn danger" onClick={()=>removeSection(idx)}>
                        <Trash2 size={14}/>
                      </button>
                      <button className="pb-icon-btn" onClick={()=>setOpenId(isOpen?null:section.id)}>
                        {isOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="pb-settings">
                      <SectionSettings section={section} onChange={updated=>updateSection(idx,updated)}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div className="pb-save-bar">
        <div className="pb-save-bar-info">
          <Layout size={14} style={{color:"var(--gold)",flexShrink:0}}/>
          Home Page · {sections.length} sections
          {dirty && <span style={{color:"var(--amber)",display:"flex",alignItems:"center",gap:4}}><AlertCircle size={12}/> Unsaved</span>}
        </div>
        <div className="pb-save-bar-actions">
          <button className="btn btn-outline btn-sm" onClick={reset} disabled={resetting}>
            {resetting ? <Loader2 size={12} className="loader-spin"/> : <RotateCcw size={12}/>}
            <span className="hide-mobile"> Reset</span>
          </button>
          <button className="btn btn-primary btn-md" onClick={save} disabled={saving||!dirty}>
            {saving ? <><Loader2 size={13} className="loader-spin"/> Saving…</> : <><Save size={13}/> Save</>}
          </button>
        </div>
      </div>
    </>
  );
}
