"use client";
import { useState, useEffect, useRef } from "react";
import {
  GripVertical, Eye, EyeOff, Settings2, Trash2, Plus,
  Save, RotateCcw, Check, Loader2, ChevronDown, ChevronUp,
  Layout, AlertCircle, ExternalLink, X,
} from "lucide-react";
import { api } from "../../../lib/api";

/* ── Section type metadata ── */
const SECTION_TYPES = {
  hero_carousel:  { label: "Hero Carousel",       icon: "🖼",  color: "#B8862A", desc: "Full-width slideshow with CTA buttons" },
  collection_grid:{ label: "Collections Grid",    icon: "⊞",  color: "#185FA5", desc: "3-panel editorial collection mosaic" },
  categories:     { label: "Shop by Category",    icon: "◉",  color: "#2e7d32", desc: "Circular category tile row" },
  trending:       { label: "Trending Jewellery",   icon: "★",  color: "#854F0B", desc: "Best-seller product cards" },
  new_arrivals:   { label: "New Arrivals",         icon: "✦",  color: "#993C1D", desc: "Dark editorial new arrivals strip" },
  trust_world:    { label: "MANAS World",          icon: "♦",  color: "#4A3728", desc: "Trust features + editorial stories" },
  product_row:    { label: "Product Row",          icon: "▦",  color: "#185FA5", desc: "Filtered horizontal product scroll" },
  banner_single:  { label: "Full Banner",          icon: "▬",  color: "#2C1A0E", desc: "Full-width promotional image banner" },
  banner_split:   { label: "Split Banner",         icon: "▩",  color: "#3A2818", desc: "Two-column split banner" },
  newsletter:     { label: "Newsletter",           icon: "✉",  color: "#2e7d32", desc: "Email subscription strip" },
  testimonials:   { label: "Testimonials",         icon: "❝",  color: "#854F0B", desc: "Customer review cards" },
};

const CATEGORIES = ["Ring","Necklace","Earring","Bangle","Bracelet","Mangalsutra","Pendant","Other"];
const PURITIES   = ["22KT","18KT","14KT","24KT"];

/* ── CSS ── */
const S = `
.pb-root { max-width: 1240px; margin: 0 auto; }
.pb-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.pb-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pb-toolbar-right { display: flex; align-items: center; gap: 8px; }
.pb-status { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text3); }
.pb-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
.pb-status-dot.saving { background: var(--amber); animation: pulse-dot 1s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.pb-live-link { display: flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); text-decoration: none; border: 1px solid var(--border); padding: 7px 14px; border-radius: var(--radius); transition: all .2s; }
.pb-live-link:hover { border-color: var(--gold); }

/* Layout: sidebar + canvas */
.pb-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: start; }
@media(max-width: 900px) { .pb-layout { grid-template-columns: 1fr; } }

/* ── Add Section Sidebar ── */
.pb-sidebar { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); position: sticky; top: 80px; }
.pb-sidebar-head { padding: 14px 16px; border-bottom: 1px solid var(--border); }
.pb-sidebar-title { font-family: var(--font-serif); font-size: 17px; color: var(--dark); }
.pb-sidebar-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }
.pb-type-list { padding: 8px 0; max-height: 600px; overflow-y: auto; }
.pb-type-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; cursor: pointer; transition: background .15s; border: none; background: none; width: 100%; text-align: left; font-family: var(--font-sans); }
.pb-type-item:hover { background: var(--bg); }
.pb-type-item.disabled { opacity: .4; cursor: not-allowed; }
.pb-type-icon { width: 34px; height: 34px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.pb-type-label { font-size: 13px; font-weight: 500; color: var(--dark); }
.pb-type-desc { font-size: 11px; color: var(--text3); margin-top: 1px; }
.pb-type-add { margin-left: auto; color: var(--gold); flex-shrink: 0; }

/* ── Canvas ── */
.pb-canvas { display: flex; flex-direction: column; gap: 8px; min-height: 300px; }
.pb-empty-canvas { border: 2px dashed var(--border); border-radius: var(--radius); padding: 60px 20px; text-align: center; color: var(--text3); }
.pb-empty-canvas-icon { font-size: 36px; margin-bottom: 12px; }
.pb-empty-canvas-text { font-family: var(--font-serif); font-size: 20px; color: var(--dark); }
.pb-empty-canvas-sub { font-size: 12px; margin-top: 6px; }

/* ── Section Card ── */
.pb-section-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); transition: box-shadow .2s, transform .15s; user-select: none; }
.pb-section-card.dragging { opacity: .5; box-shadow: 0 8px 32px rgba(44,26,14,.18); }
.pb-section-card.drag-over { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(184,134,42,.2); }
.pb-section-card.hidden { opacity: .55; }
.pb-section-head { display: flex; align-items: center; gap: 10px; padding: 13px 16px; cursor: default; }
.pb-drag-handle { color: var(--text3); cursor: grab; flex-shrink: 0; transition: color .2s; }
.pb-drag-handle:hover { color: var(--gold); }
.pb-drag-handle:active { cursor: grabbing; }
.pb-section-icon { width: 32px; height: 32px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.pb-section-info { flex: 1; min-width: 0; }
.pb-section-label { font-size: 13.5px; font-weight: 500; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pb-section-type  { font-size: 11px; color: var(--text3); margin-top: 1px; letter-spacing: .3px; }
.pb-section-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.pb-icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: var(--radius); color: var(--text3); display: flex; align-items: center; transition: all .15s; }
.pb-icon-btn:hover { background: var(--bg); color: var(--dark); }
.pb-icon-btn.active { color: var(--gold); }
.pb-icon-btn.danger:hover { color: var(--red); }
.pb-section-badge { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 2px; font-weight: 500; }
.pb-section-badge.visible { background: var(--green-bg); color: var(--green); }
.pb-section-badge.hidden  { background: var(--border); color: var(--text3); }
.pb-order-badge { font-size: 10px; font-weight: 600; color: var(--text3); background: var(--bg); border: 1px solid var(--border); border-radius: 2px; padding: 2px 7px; min-width: 26px; text-align: center; }

/* ── Settings panel ── */
.pb-settings { border-top: 1px solid var(--border); padding: 16px; background: var(--bg); border-radius: 0 0 var(--radius) var(--radius); }
.pb-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.pb-settings-grid.full { grid-template-columns: 1fr; }
.pb-settings-grid.three { grid-template-columns: 1fr 1fr 1fr; }
.pb-field { display: flex; flex-direction: column; gap: 4px; }
.pb-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); }
.pb-input, .pb-select { border: 1px solid var(--border); padding: 8px 10px; font-size: 12.5px; color: var(--dark); font-family: var(--font-sans); outline: none; border-radius: var(--radius); background: var(--white); width: 100%; transition: border-color .2s; }
.pb-input:focus, .pb-select:focus { border-color: var(--gold); }
.pb-slides-list { display: flex; flex-direction: column; gap: 8px; }
.pb-slide-row { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 12px; }
.pb-slide-row-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: 500; color: var(--dark); }
.pb-add-slide-btn { display: flex; align-items: center; gap: 6px; background: none; border: 1px dashed var(--border); padding: 8px 14px; font-size: 12px; color: var(--text3); cursor: pointer; border-radius: var(--radius); font-family: var(--font-sans); transition: all .2s; width: 100%; justify-content: center; margin-top: 4px; }
.pb-add-slide-btn:hover { border-color: var(--gold); color: var(--gold); }
.pb-section-settings-title { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text2); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.pb-section-settings-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── Save bar ── */
.pb-save-bar { position: fixed; bottom: 0; left: var(--sidebar-w); right: 0; background: var(--white); border-top: 1px solid var(--border); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; z-index: 50; box-shadow: 0 -4px 20px rgba(44,26,14,.08); }
.pb-save-bar-info { font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
.pb-save-bar-actions { display: flex; gap: 10px; }

/* Toast */
.pb-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--dark); color: var(--gold-light); padding: 12px 24px; border-radius: var(--radius); font-size: 13px; z-index: 200; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.25); animation: toast-in .25s ease; }
@keyframes toast-in { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

/* ── Settings Panel for each section type ── */
function SectionSettings({ section, onChange }) {
  const s   = section.settings || {};
  const set = (key, val) => onChange({ ...section, settings: { ...s, [key]: val } });

  switch (section.type) {
    case "hero_carousel": {
      const slides = s.slides || [{}];
      const updateSlide = (i, key, val) => {
        const ns = [...slides];
        ns[i] = { ...ns[i], [key]: val };
        set("slides", ns);
      };
      const addSlide = () => set("slides", [...slides, {}]);
      const removeSlide = i => set("slides", slides.filter((_, idx) => idx !== i));

      return (
        <div>
          <p className="pb-section-settings-title">Slides</p>
          <div className="pb-settings-grid full" style={{ marginBottom: 8 }}>
            <div className="pb-field">
              <label className="pb-label">Autoplay Delay (ms)</label>
              <input className="pb-input" type="number" value={s.autoplayDelay || 4500}
                onChange={e => set("autoplayDelay", Number(e.target.value))} />
            </div>
          </div>
          <div className="pb-slides-list">
            {slides.map((slide, i) => (
              <div key={i} className="pb-slide-row">
                <div className="pb-slide-row-head">
                  Slide {i + 1}
                  {slides.length > 1 && (
                    <button className="pb-icon-btn danger" onClick={() => removeSlide(i)}><X size={13} /></button>
                  )}
                </div>
                <div className="pb-settings-grid full">
                  <div className="pb-field"><label className="pb-label">Image URL *</label>
                    <input className="pb-input" placeholder="https://..." value={slide.img || ""} onChange={e => updateSlide(i, "img", e.target.value)} /></div>
                </div>
                <div className="pb-settings-grid">
                  <div className="pb-field"><label className="pb-label">Eyebrow Text</label>
                    <input className="pb-input" placeholder="New Collection" value={slide.eyebrow || ""} onChange={e => updateSlide(i, "eyebrow", e.target.value)} /></div>
                  <div className="pb-field"><label className="pb-label">CTA Label</label>
                    <input className="pb-input" placeholder="Explore Now" value={slide.ctaLabel || ""} onChange={e => updateSlide(i, "ctaLabel", e.target.value)} /></div>
                </div>
                <div className="pb-settings-grid">
                  <div className="pb-field"><label className="pb-label">Title</label>
                    <input className="pb-input" placeholder="Sparkling" value={slide.title || ""} onChange={e => updateSlide(i, "title", e.target.value)} /></div>
                  <div className="pb-field"><label className="pb-label">Title (italic part)</label>
                    <input className="pb-input" placeholder="Avenues" value={slide.titleEm || ""} onChange={e => updateSlide(i, "titleEm", e.target.value)} /></div>
                </div>
                <div className="pb-settings-grid full">
                  <div className="pb-field"><label className="pb-label">Subtitle</label>
                    <input className="pb-input" placeholder="Diamonds that dazzle..." value={slide.subtitle || ""} onChange={e => updateSlide(i, "subtitle", e.target.value)} /></div>
                </div>
                <div className="pb-settings-grid full">
                  <div className="pb-field"><label className="pb-label">CTA Link</label>
                    <input className="pb-input" placeholder="/listing?category=Ring" value={slide.ctaHref || ""} onChange={e => updateSlide(i, "ctaHref", e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
          <button className="pb-add-slide-btn" onClick={addSlide}>
            <Plus size={13} /> Add Slide
          </button>
        </div>
      );
    }

    case "trending":
    case "new_arrivals":
    case "product_row": {
      const pf = s.productFilter || {};
      const setPf = (k, v) => set("productFilter", { ...pf, [k]: v });
      return (
        <div>
          <p className="pb-section-settings-title">Section Heading</p>
          <div className="pb-settings-grid">
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.title || ""} onChange={e => set("title", e.target.value)} placeholder="Trending Now" /></div>
            <div className="pb-field"><label className="pb-label">Subtitle</label>
              <input className="pb-input" value={s.subtitle || ""} onChange={e => set("subtitle", e.target.value)} placeholder="Pieces everyone is eyeing" /></div>
          </div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Text</label>
            <input className="pb-input" value={s.ctaText || ""} onChange={e => set("ctaText", e.target.value)} placeholder="View All" /></div></div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Link</label>
            <input className="pb-input" value={s.ctaLink || ""} onChange={e => set("ctaLink", e.target.value)} placeholder="/listing" /></div></div>

          <p className="pb-section-settings-title" style={{ marginTop: 14 }}>Product Filter</p>
          <div className="pb-settings-grid three">
            <div className="pb-field"><label className="pb-label">Category</label>
              <select className="pb-select" value={pf.category || ""} onChange={e => setPf("category", e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="pb-field"><label className="pb-label">Purity</label>
              <select className="pb-select" value={pf.purity || ""} onChange={e => setPf("purity", e.target.value)}>
                <option value="">Any Purity</option>
                {PURITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select></div>
            <div className="pb-field"><label className="pb-label">Limit</label>
              <input className="pb-input" type="number" value={pf.limit || 6} min={2} max={12}
                onChange={e => setPf("limit", Number(e.target.value))} /></div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {[["isBestSeller","Best Sellers"],["isNewArrival","New Arrivals"],["isFeatured","Featured"],["isWedding","Bridal"]].map(([k, lbl]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12.5, color: "var(--text2)" }}>
                <input type="checkbox" checked={!!pf[k]} onChange={e => setPf(k, e.target.checked)}
                  style={{ accentColor: "var(--gold)", width: 14, height: 14 }} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      );
    }

    case "collection_grid": {
      const cols = s.collections || [{}];
      const updateCol = (i, key, val) => {
        const nc = [...cols];
        nc[i] = { ...nc[i], [key]: val };
        set("collections", nc);
      };
      return (
        <div>
          <p className="pb-section-settings-title">Section Heading</p>
          <div className="pb-settings-grid">
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.title || ""} onChange={e => set("title", e.target.value)} /></div>
            <div className="pb-field"><label className="pb-label">Subtitle</label>
              <input className="pb-input" value={s.subtitle || ""} onChange={e => set("subtitle", e.target.value)} /></div>
          </div>
          <p className="pb-section-settings-title" style={{ marginTop: 14 }}>Collections ({cols.length})</p>
          {cols.map((col, i) => (
            <div key={i} className="pb-slide-row" style={{ marginBottom: 8 }}>
              <div className="pb-slide-row-head">Collection {i + 1}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select className="pb-select" style={{ width: "auto", padding: "3px 8px", fontSize: 11 }}
                    value={col.span || "small"} onChange={e => updateCol(i, "span", e.target.value)}>
                    <option value="large">Large</option>
                    <option value="small">Small</option>
                  </select>
                  {cols.length > 1 && <button className="pb-icon-btn danger" onClick={() => set("collections", cols.filter((_, idx) => idx !== i))}><X size={13} /></button>}
                </div>
              </div>
              <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">Image URL</label>
                <input className="pb-input" value={col.img || ""} onChange={e => updateCol(i, "img", e.target.value)} /></div></div>
              <div className="pb-settings-grid">
                <div className="pb-field"><label className="pb-label">Title</label>
                  <input className="pb-input" value={col.title || ""} onChange={e => updateCol(i, "title", e.target.value)} /></div>
                <div className="pb-field"><label className="pb-label">Subtitle</label>
                  <input className="pb-input" value={col.sub || ""} onChange={e => updateCol(i, "sub", e.target.value)} /></div>
              </div>
              <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">Link</label>
                <input className="pb-input" value={col.href || ""} onChange={e => updateCol(i, "href", e.target.value)} placeholder="/listing" /></div></div>
            </div>
          ))}
          <button className="pb-add-slide-btn" onClick={() => set("collections", [...cols, {}])}>
            <Plus size={13} /> Add Collection
          </button>
        </div>
      );
    }

    case "newsletter":
      return (
        <div className="pb-settings-grid full">
          <div className="pb-field"><label className="pb-label">Offer Text</label>
            <input className="pb-input" value={s.offerText || ""} onChange={e => set("offerText", e.target.value)} placeholder="Get 5% off your first order" /></div>
        </div>
      );

    case "banner_single":
      return (
        <div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">Banner Image URL</label>
            <input className="pb-input" value={s.bannerImg || ""} onChange={e => set("bannerImg", e.target.value)} /></div></div>
          <div className="pb-settings-grid">
            <div className="pb-field"><label className="pb-label">Title</label>
              <input className="pb-input" value={s.bannerTitle || ""} onChange={e => set("bannerTitle", e.target.value)} /></div>
            <div className="pb-field"><label className="pb-label">CTA Text</label>
              <input className="pb-input" value={s.bannerCta || ""} onChange={e => set("bannerCta", e.target.value)} /></div>
          </div>
          <div className="pb-settings-grid full"><div className="pb-field"><label className="pb-label">CTA Link</label>
            <input className="pb-input" value={s.bannerHref || ""} onChange={e => set("bannerHref", e.target.value)} /></div></div>
        </div>
      );

    default:
      return <p style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic" }}>No editable settings for this section type.</p>;
  }
}

/* ── Drag-and-drop hook ── */
function useDragDrop(sections, setSections) {
  const dragIdx = useRef(null);
  const [overIdx, setOverIdx] = useState(null);

  const onDragStart = (e, i) => {
    dragIdx.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, i) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(i);
  };
  const onDrop = (e, i) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) { setOverIdx(null); return; }
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    setSections(next);
    dragIdx.current = null;
    setOverIdx(null);
  };
  const onDragEnd = () => { dragIdx.current = null; setOverIdx(null); };

  return { onDragStart, onDragOver, onDrop, onDragEnd, overIdx };
}

/* ══════════════════════════════════════════
   PAGE BUILDER COMPONENT
══════════════════════════════════════════ */
export default function PageBuilderPage() {
  const [sections,  setSections]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [dirty,     setDirty]     = useState(false);
  const [openId,    setOpenId]    = useState(null);   // which section settings open
  const [toast,     setToast]     = useState(null);
  const [resetting, setResetting] = useState(false);

  const { onDragStart, onDragOver, onDrop, onDragEnd, overIdx } = useDragDrop(sections, (next) => {
    setSections(next);
    setDirty(true);
  });

  /* ── Load config ── */
  useEffect(() => {
    (async () => {
      try {
        const { sections: s } = await api.homeSection.getConfig();
        setSections(s || []);
      } catch (e) {
        showToast("⚠ Could not load — using defaults");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (msg, duration = 2800) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  /* ── Mutators ── */
  const updateSection = (idx, updates) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s));
    setDirty(true);
  };

  const toggleVisible = (idx) => {
    updateSection(idx, { visible: !sections[idx].visible });
  };

  const removeSection = (idx) => {
    if (!confirm(`Remove "${sections[idx].label}"?`)) return;
    setSections(prev => prev.filter((_, i) => i !== idx));
    if (openId === sections[idx].id) setOpenId(null);
    setDirty(true);
  };

  const addSection = (type) => {
    const meta = SECTION_TYPES[type];
    const newSec = {
      id:      `${type}_${Date.now()}`,
      type,
      label:   meta.label,
      visible: true,
      order:   sections.length,
      settings:{},
      products:[],
    };
    setSections(prev => [...prev, newSec]);
    setOpenId(newSec.id);
    setDirty(true);
  };

  /* ── Save ── */
  const save = async () => {
    setSaving(true);
    try {
      await api.homeSection.saveConfig(sections);
      setDirty(false);
      showToast("✓ Home page saved successfully");
    } catch (e) {
      showToast("⚠ Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Reset to defaults ── */
  const reset = async () => {
    if (!confirm("Reset to default sections? All customisations will be lost.")) return;
    setResetting(true);
    try {
      const { sections: s } = await api.homeSection.reset();
      setSections(s || []);
      setDirty(false);
      setOpenId(null);
      showToast("✓ Reset to defaults");
    } catch (e) {
      showToast("⚠ Reset failed: " + e.message);
    } finally {
      setResetting(false);
    }
  };

  /* ── Which types are already added ── */
  const usedTypes = new Set(sections.map(s => s.type));
  const singleUseTypes = new Set(["hero_carousel","categories","trust_world","newsletter","testimonials"]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:400, color:"var(--text3)", gap:10 }}>
      <Loader2 size={22} className="loader-spin" /> Loading page builder…
    </div>
  );

  return (
    <>
      <style>{S}</style>

      {/* Toast */}
      {toast && <div className="pb-toast"><Check size={14} /> {toast}</div>}

      <div className="pb-root">
        {/* Toolbar */}
        <div className="pb-toolbar">
          <div className="pb-toolbar-left">
            <div className="pb-status">
              <span className={`pb-status-dot${saving ? " saving" : ""}`} />
              {saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}
            </div>
            <span style={{ color:"var(--border)", fontSize:16 }}>|</span>
            <span style={{ fontSize:12, color:"var(--text3)" }}>
              {sections.length} sections · {sections.filter(s => s.visible).length} visible
            </span>
          </div>
          <div className="pb-toolbar-right">
            <a href="http://localhost:3000" target="_blank" rel="noopener" className="pb-live-link">
              <ExternalLink size={12} /> Preview Live
            </a>
          </div>
        </div>

        {/* Main layout */}
        <div className="pb-layout">

          {/* ── Sidebar: add sections ── */}
          <div className="pb-sidebar">
            <div className="pb-sidebar-head">
              <p className="pb-sidebar-title">Add <span style={{ fontStyle:"italic", color:"var(--gold)" }}>Section</span></p>
              <p className="pb-sidebar-sub">Click to add to the page</p>
            </div>
            <div className="pb-type-list">
              {Object.entries(SECTION_TYPES).map(([type, meta]) => {
                const isUsed = singleUseTypes.has(type) && usedTypes.has(type);
                return (
                  <button
                    key={type}
                    className={`pb-type-item${isUsed ? " disabled" : ""}`}
                    onClick={() => !isUsed && addSection(type)}
                    disabled={isUsed}
                    title={isUsed ? "Already added" : `Add ${meta.label}`}
                  >
                    <div className="pb-type-icon" style={{ background: meta.color + "18", color: meta.color }}>
                      {meta.icon}
                    </div>
                    <div>
                      <p className="pb-type-label">{meta.label}</p>
                      <p className="pb-type-desc">{meta.desc}</p>
                    </div>
                    {!isUsed && <Plus size={14} className="pb-type-add" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Canvas ── */}
          <div className="pb-canvas">
            {sections.length === 0 ? (
              <div className="pb-empty-canvas">
                <div className="pb-empty-canvas-icon">🏗</div>
                <p className="pb-empty-canvas-text">Canvas is empty</p>
                <p className="pb-empty-canvas-sub">Add sections from the panel on the left</p>
              </div>
            ) : sections.map((section, idx) => {
              const meta    = SECTION_TYPES[section.type] || { label: section.type, icon: "□", color: "#888" };
              const isOpen  = openId === section.id;
              const isDragOver = overIdx === idx;

              return (
                <div
                  key={section.id}
                  className={`pb-section-card${!section.visible ? " hidden" : ""}${isDragOver ? " drag-over" : ""}`}
                  draggable
                  onDragStart={e => onDragStart(e, idx)}
                  onDragOver={e => onDragOver(e, idx)}
                  onDrop={e => onDrop(e, idx)}
                  onDragEnd={onDragEnd}
                >
                  {/* Section header row */}
                  <div className="pb-section-head">
                    {/* Drag handle */}
                    <div className="pb-drag-handle" title="Drag to reorder">
                      <GripVertical size={16} />
                    </div>

                    {/* Order badge */}
                    <span className="pb-order-badge">{idx + 1}</span>

                    {/* Icon */}
                    <div className="pb-section-icon" style={{ background: meta.color + "18", color: meta.color }}>
                      {meta.icon}
                    </div>

                    {/* Info */}
                    <div className="pb-section-info">
                      <input
                        className="pb-section-label"
                        value={section.label}
                        onChange={e => updateSection(idx, { label: e.target.value })}
                        style={{ background:"none", border:"none", outline:"none", width:"100%", cursor:"text", font:"inherit", fontSize:13.5, fontWeight:500, color:"var(--dark)", padding:0 }}
                        title="Click to rename"
                      />
                      <p className="pb-section-type">{meta.label}</p>
                    </div>

                    {/* Visibility badge */}
                    <span className={`pb-section-badge ${section.visible ? "visible" : "hidden"}`}>
                      {section.visible ? "Visible" : "Hidden"}
                    </span>

                    {/* Action buttons */}
                    <div className="pb-section-actions">
                      {/* Toggle visible */}
                      <button
                        className={`pb-icon-btn${section.visible ? " active" : ""}`}
                        onClick={() => toggleVisible(idx)}
                        title={section.visible ? "Hide section" : "Show section"}
                      >
                        {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      {/* Settings toggle */}
                      <button
                        className={`pb-icon-btn${isOpen ? " active" : ""}`}
                        onClick={() => setOpenId(isOpen ? null : section.id)}
                        title="Edit settings"
                      >
                        <Settings2 size={15} />
                      </button>

                      {/* Delete */}
                      <button className="pb-icon-btn danger" onClick={() => removeSection(idx)} title="Remove section">
                        <Trash2 size={15} />
                      </button>

                      {/* Expand toggle */}
                      <button className="pb-icon-btn" onClick={() => setOpenId(isOpen ? null : section.id)}>
                        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Settings panel (expanded) */}
                  {isOpen && (
                    <div className="pb-settings">
                      <SectionSettings
                        section={section}
                        onChange={updated => updateSection(idx, updated)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom spacer for save bar */}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Sticky save bar ── */}
      <div className="pb-save-bar">
        <div className="pb-save-bar-info">
          <Layout size={14} style={{ color:"var(--gold)" }} />
          Home Page · {sections.length} sections
          {dirty && (
            <span style={{ color:"var(--amber)", display:"flex", alignItems:"center", gap:5 }}>
              <AlertCircle size={13} /> Unsaved changes
            </span>
          )}
        </div>
        <div className="pb-save-bar-actions">
          <button className="btn btn-outline btn-sm" onClick={reset} disabled={resetting}>
            {resetting ? <Loader2 size={13} className="loader-spin" /> : <RotateCcw size={13} />}
            Reset to Defaults
          </button>
          <button className="btn btn-primary btn-md" onClick={save} disabled={saving || !dirty}>
            {saving ? <><Loader2 size={13} className="loader-spin" /> Saving…</> : <><Save size={13} /> Save Changes</>}
          </button>
        </div>
      </div>
    </>
  );
}
