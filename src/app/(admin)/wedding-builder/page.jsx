"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, X, Edit2, Trash2, Eye, EyeOff,
  Loader2, Check, AlertCircle, Star,
  Save, Package, Image, Settings, ExternalLink,
  Layout,
} from "lucide-react";
import { api } from "../../../lib/api";
import { Badge, Modal, Toggle, Pagination } from "../../../components/common";

/* ─── Constants ─── */
const OCCASIONS = ["engagement","mehendi","sangeet","wedding","reception","honeymoon"];
const OCCASION_LABELS = {
  engagement:"Engagement", mehendi:"Mehendi", sangeet:"Sangeet",
  wedding:"Wedding Day", reception:"Reception", honeymoon:"Honeymoon",
};
const CATEGORIES = ["Ring","Necklace","Earring","Bangle","Bracelet","Mangalsutra","Pendant","Chain","Haath Phool","Other"];
const PURITIES   = ["22KT","18KT","14KT","24KT"];
const METALS     = ["Yellow Gold","White Gold","Rose Gold"];
const BADGES     = ["Bestseller","New","Limited","Exclusive","Top Rated"];
const LIMIT = 20;

/* ══════════════════════════════════════════
   STYLES — matched to Page Builder
══════════════════════════════════════════ */
const S = `

/* ── Root ── */
.wa-root { max-width: 1240px; margin: 0 auto; }

/* ── Toolbar (same as pb-toolbar) ── */
.wa-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.wa-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.wa-toolbar-right { display: flex; align-items: center; gap: 8px; }

/* ── Status dot (identical to pb-status) ── */
.wa-status { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text3); }
.wa-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
.wa-status-dot.saving { background: var(--amber); animation: wa-pulse 1s infinite; }
@keyframes wa-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Live link (same as pb-live-link) ── */
.wa-live-link { display: flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); text-decoration: none; border: 1px solid var(--border); padding: 7px 14px; border-radius: var(--radius); transition: all .2s; }
.wa-live-link:hover { border-color: var(--gold); }

/* ── Admin Tabs ── */
.wa-tabs { display: flex; gap: 32px; border-bottom: 1px solid var(--border); margin-bottom: 24px; padding: 0 8px; }
.wa-tab { padding: 12px 4px; font-size: 13px; font-weight: 500; color: var(--text3); border-bottom: 2px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all .2s; background: none; border-left: none; border-right: none; border-top: none; font-family: var(--font-sans); }
.wa-tab:hover { color: var(--dark); }
.wa-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

/* ── Save bar (identical to pb-save-bar) ── */
.wa-save-bar { position: fixed; bottom: 0; left: var(--sidebar-w); right: 0; background: var(--white); border-top: 1px solid var(--border); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; z-index: 50; box-shadow: 0 -4px 20px rgba(44,26,14,.08); }
.wa-save-bar-info { font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
.wa-save-bar-actions { display: flex; gap: 10px; }

/* ── Loader spin (same as Page Builder) ── */
.loader-spin { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stats grid ── */
.wa-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
@media(max-width:900px) { .wa-stats { grid-template-columns: repeat(2,1fr); } }
.wa-stat-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; position: relative; overflow: hidden; }
.wa-stat-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.wa-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
.wa-stat-val { font-family: var(--font-serif); font-size: 32px; color: var(--dark); }
.wa-stat-icon { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }

/* ── Occasion filter tabs ── */
.wa-occ-tabs { display: flex; gap: 0; overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); background: var(--white); margin-bottom: 20px; scrollbar-width: none; }
.wa-occ-tabs::-webkit-scrollbar { display: none; }
.wa-occ-tab { flex-shrink: 0; background: none; border: none; padding: 10px 18px; font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); cursor: pointer; font-family: var(--font-sans); transition: all .15s; border-right: 1px solid var(--border); white-space: nowrap; }
.wa-occ-tab:last-child { border-right: none; }
.wa-occ-tab:hover { color: var(--dark); background: var(--bg); }
.wa-occ-tab.active { background: var(--dark); color: var(--gold-light); }
.wa-occ-count { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,.15); font-size: 9px; margin-left: 5px; }
.wa-occ-tab:not(.active) .wa-occ-count { background: var(--bg); color: var(--text3); }

/* ── Filter bar ── */
.wa-filter-bar { display: flex; align-items: center; gap: 10px; padding: 14px 16px; flex-wrap: wrap; }
.wa-filter-search { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 12px; background: var(--white); flex: 2; min-width: 200px; }
.wa-filter-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--dark); font-family: var(--font-sans); width: 100%; }
.wa-filter-search input::placeholder { color: var(--text3); }

/* ── Product grid ── */
.wa-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(230px,1fr)); gap: 16px; }
.wa-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: box-shadow .2s, transform .2s; position: relative; }
.wa-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.wa-card.hidden-prod { opacity: .55; }
.wa-card-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; display: block; background: var(--bg); }
.wa-card-badge { position: absolute; top: 10px; left: 10px; background: rgba(44,26,14,.85); color: #D4AF6A; font-size: 9px; letter-spacing: 1.5px; padding: 3px 9px; text-transform: uppercase; border-radius: 2px; }
.wa-card-occ { position: absolute; bottom: 8px; left: 8px; display: flex; gap: 4px; flex-wrap: wrap; }
.wa-card-occ-pill { background: rgba(44,26,14,.72); color: #D4AF6A; font-size: 9px; letter-spacing: 1px; padding: 2px 7px; text-transform: uppercase; border-radius: 2px; backdrop-filter: blur(4px); }
.wa-card-body { padding: 12px 14px; }
.wa-card-tag { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
.wa-card-name { font-family: var(--font-serif); font-size: 16px; font-weight: 400; color: var(--dark); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wa-card-meta { font-size: 11px; color: var(--text3); margin-bottom: 8px; }
.wa-card-price { font-family: var(--font-serif); font-size: 18px; color: var(--dark); margin-bottom: 8px; }
.wa-card-orig { font-size: 11px; color: var(--text3); text-decoration: line-through; margin-left: 5px; }
.wa-card-rating { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text2); margin-bottom: 10px; }
.wa-card-actions { display: flex; gap: 6px; }
.wa-card-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 7px; border-radius: var(--radius); border: 1px solid var(--border); background: none; cursor: pointer; color: var(--text2); font-family: var(--font-sans); transition: all .15s; }
.wa-card-btn:hover { border-color: var(--gold); color: var(--gold); }
.wa-card-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-bg); }

/* ── Form section separator (same as pb-section-settings-title) ── */
.wa-form-sep { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text3); margin: 16px 0 10px; display: flex; align-items: center; gap: 8px; }
.wa-form-sep::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── Form grid (same as pb-settings-grid) ── */
.wa-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.wa-form-grid.full { grid-template-columns: 1fr; }
.wa-form-grid.three { grid-template-columns: 1fr 1fr 1fr; }
.wa-field { display: flex; flex-direction: column; gap: 4px; }
.wa-label { font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); }
.wa-input, .wa-select, .wa-textarea { border: 1px solid var(--border); padding: 8px 10px; font-size: 12.5px; color: var(--dark); font-family: var(--font-sans); outline: none; border-radius: var(--radius); background: var(--white); width: 100%; transition: border-color .2s; }
.wa-input:focus, .wa-select:focus, .wa-textarea:focus { border-color: var(--gold); }
.wa-textarea { resize: vertical; }

/* ── Occasion pills ── */
.wa-occ-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.wa-occ-pill-btn { border: 1px solid var(--border); background: none; padding: 6px 14px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 2px; font-family: var(--font-sans); color: var(--text2); transition: all .2s; }
.wa-occ-pill-btn:hover { border-color: var(--gold); color: var(--gold); }
.wa-occ-pill-btn.selected { background: var(--dark); border-color: var(--dark); color: var(--gold-light); }

/* ── Image thumbs ── */
.wa-img-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.wa-img-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); }
.wa-img-add-row { display: flex; gap: 8px; margin-top: 8px; }

/* ── Config section card (same look as pb-section-card) ── */
.wa-cfg-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 20px; }
.wa-cfg-title { font-family: var(--font-serif); font-size: 18px; color: var(--dark); margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
.wa-cfg-title em { font-style: italic; color: var(--gold); }
.wa-cfg-title-count { font-size: 11px; color: var(--text3); font-family: var(--font-sans); font-style: normal; }

/* ── Config row (same bg as pb-settings panel) ── */
.wa-cfg-row { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; position: relative; }
.wa-cfg-row-del { position: absolute; top: 12px; right: 12px; color: var(--text3); background: none; border: none; cursor: pointer; display: flex; align-items: center; transition: color .15s; }
.wa-cfg-row-del:hover { color: var(--red); }

/* ── Add row btn (same as pb-add-slide-btn) ── */
.wa-add-row-btn { display: flex; align-items: center; gap: 6px; background: none; border: 1px dashed var(--border); padding: 8px 14px; font-size: 12px; color: var(--text3); cursor: pointer; border-radius: var(--radius); font-family: var(--font-sans); transition: all .2s; width: 100%; justify-content: center; margin-top: 4px; }
.wa-add-row-btn:hover { border-color: var(--gold); color: var(--gold); }

/* ── Empty state (same as pb-empty-canvas) ── */
.wa-empty { border: 2px dashed var(--border); border-radius: var(--radius); padding: 60px 20px; text-align: center; color: var(--text3); }
.wa-empty-icon { font-size: 36px; margin-bottom: 12px; }
.wa-empty-title { font-family: var(--font-serif); font-size: 20px; color: var(--dark); }
.wa-empty-sub { font-size: 12px; margin-top: 6px; margin-bottom: 20px; }

/* ── Toast (same as pb-toast — centered bottom) ── */
.wa-toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--dark); color: var(--gold-light); padding: 12px 24px; border-radius: var(--radius); font-size: 13px; z-index: 200; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.25); animation: wa-toast-in .25s ease; }
.wa-toast.error { background: var(--red); color: #fff; }
@keyframes wa-toast-in { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

/* ── Bottom spacer for save bar ── */
.wa-spacer { height: 80px; }
`;

/* ─── Empty form ─── */
const emptyForm = () => ({
  name:"", slug:"", description:"", sku:"",
  category:"Necklace", subCategory:"",
  occasion:[],
  "price.current":"", "price.original":"",
  thumbnail:"", images:[],
  "metal.type":"Yellow Gold", "metal.purity":"22KT", "metal.weight":"",
  "stones.type":"", "stones.weight":"",
  pieces:1, piecesList:"",
  makingCharges:"",
  "inventory.quantity":5, "inventory.inStock":true,
  isBestSeller:false, isNewArrival:false, isFeatured:true, isWedding:true,
  badge:"Bestseller",
  certification:"BIS Hallmarked",
  rating:4.8, reviewCount:0,
  isActive:true,
});

function nestForm(flat) {
  const out = {};
  Object.entries(flat).forEach(([k, v]) => {
    const parts = k.split(".");
    if (parts.length === 2) {
      if (!out[parts[0]]) out[parts[0]] = {};
      out[parts[0]][parts[1]] = v === "" ? undefined : v;
    } else {
      out[k] = v;
    }
  });
  return out;
}

const fmt = n => n ? "₹ " + Number(n).toLocaleString("en-IN") : "—";
const emptyConfig = () => ({ heroSlides: [], journeySteps: [], testimonials: [] });

/* ════════════════════════════════
   PRODUCT FORM
════════════════════════════════ */
function ProductForm({ form, setForm, err }) {
  const sf = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const sb = k => v => setForm(p => ({ ...p, [k]: v }));
  const [imgUrl, setImgUrl] = useState("");

  const toggleOcc = occ =>
    setForm(p => ({
      ...p,
      occasion: p.occasion.includes(occ)
        ? p.occasion.filter(o => o !== occ)
        : [...p.occasion, occ],
    }));

  const addImage = () => {
    if (!imgUrl.trim()) return;
    setForm(p => ({
      ...p,
      images: [...(p.images || []), imgUrl.trim()],
      thumbnail: p.thumbnail || imgUrl.trim(),
    }));
    setImgUrl("");
  };
  const removeImage = i => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  return (
    <div>
      {err && (
        <div style={{ background:"var(--red-bg)", color:"var(--red)", padding:"10px 14px", borderRadius:"var(--radius)", marginBottom:14, fontSize:12.5, display:"flex", gap:8, alignItems:"center" }}>
          <AlertCircle size={14} /> {err}
        </div>
      )}

      <p className="wa-form-sep">Basic Information</p>
      <div className="wa-form-grid">
        <div className="wa-field"><label className="wa-label">Product Name *</label>
          <input className="wa-input" value={form.name} onChange={sf("name")} placeholder="Rani Haar Bridal Set" /></div>
        <div className="wa-field"><label className="wa-label">SKU</label>
          <input className="wa-input" value={form.sku} onChange={sf("sku")} placeholder="MAN-NEC-001" /></div>
      </div>
      <div className="wa-form-grid full">
        <div className="wa-field"><label className="wa-label">Description</label>
          <textarea className="wa-textarea" value={form.description} onChange={sf("description")} rows={3} placeholder="A statement bridal set crafted in 22KT gold…" /></div>
      </div>
      <div className="wa-form-grid full">
        <div className="wa-field"><label className="wa-label">Pieces List</label>
          <input className="wa-input" value={form.piecesList} onChange={sf("piecesList")} placeholder="Necklace · Earrings · Maang Tikka · Bangles" /></div>
      </div>

      <p className="wa-form-sep">Occasions</p>
      <div className="wa-occ-pills">
        {OCCASIONS.map(occ => (
          <button key={occ} type="button"
            className={`wa-occ-pill-btn${form.occasion?.includes(occ) ? " selected" : ""}`}
            onClick={() => toggleOcc(occ)}>
            {OCCASION_LABELS[occ]}
          </button>
        ))}
      </div>

      <p className="wa-form-sep">Category & Metal</p>
      <div className="wa-form-grid three">
        <div className="wa-field"><label className="wa-label">Category *</label>
          <select className="wa-select" value={form.category} onChange={sf("category")}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div className="wa-field"><label className="wa-label">Metal Type</label>
          <select className="wa-select" value={form["metal.type"]} onChange={sf("metal.type")}>
            {METALS.map(m => <option key={m}>{m}</option>)}
          </select></div>
        <div className="wa-field"><label className="wa-label">Purity</label>
          <select className="wa-select" value={form["metal.purity"]} onChange={sf("metal.purity")}>
            {PURITIES.map(p => <option key={p}>{p}</option>)}
          </select></div>
      </div>
      <div className="wa-form-grid three">
        <div className="wa-field"><label className="wa-label">Metal Weight (g)</label>
          <input className="wa-input" type="number" value={form["metal.weight"]} onChange={sf("metal.weight")} placeholder="74.09" /></div>
        <div className="wa-field"><label className="wa-label">Stone Type</label>
          <input className="wa-input" value={form["stones.type"]} onChange={sf("stones.type")} placeholder="Diamond / Emerald" /></div>
        <div className="wa-field"><label className="wa-label">Stone Weight (ct)</label>
          <input className="wa-input" type="number" value={form["stones.weight"]} onChange={sf("stones.weight")} placeholder="0.45" /></div>
      </div>

      <p className="wa-form-sep">Pricing</p>
      <div className="wa-form-grid three">
        <div className="wa-field"><label className="wa-label">Current Price (₹) *</label>
          <input className="wa-input" type="number" value={form["price.current"]} onChange={sf("price.current")} placeholder="524000" /></div>
        <div className="wa-field"><label className="wa-label">Original Price (₹)</label>
          <input className="wa-input" type="number" value={form["price.original"]} onChange={sf("price.original")} placeholder="578000" /></div>
        <div className="wa-field"><label className="wa-label">Making Charges (₹)</label>
          <input className="wa-input" type="number" value={form.makingCharges} onChange={sf("makingCharges")} placeholder="14200" /></div>
      </div>

      <p className="wa-form-sep"><Image size={13} /> Images</p>
      <div className="wa-field" style={{ marginBottom:10 }}>
        <label className="wa-label">Thumbnail URL *</label>
        <input className="wa-input" value={form.thumbnail} onChange={sf("thumbnail")} placeholder="https://..." />
      </div>
      <div className="wa-field">
        <label className="wa-label">Gallery Images</label>
        <div className="wa-img-list">
          {(form.images || []).map((img, i) => (
            <div key={i} style={{ position:"relative" }}>
              <img src={img} alt="" className="wa-img-thumb" />
              <button type="button" onClick={() => removeImage(i)}
                style={{ position:"absolute", top:-5, right:-5, width:16, height:16, border:"none", borderRadius:"50%", background:"var(--red)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="wa-img-add-row">
          <input className="wa-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)}
            placeholder="Paste image URL and click Add"
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())} />
          <button type="button" className="btn btn-outline btn-sm" onClick={addImage}><Plus size={13} /></button>
        </div>
      </div>

      <p className="wa-form-sep">Inventory & Display</p>
      <div className="wa-form-grid three">
        <div className="wa-field"><label className="wa-label">Stock Qty</label>
          <input className="wa-input" type="number" value={form["inventory.quantity"]} onChange={sf("inventory.quantity")} /></div>
        <div className="wa-field"><label className="wa-label">Badge</label>
          <select className="wa-select" value={form.badge || ""} onChange={sf("badge")}>
            <option value="">No Badge</option>
            {BADGES.map(b => <option key={b}>{b}</option>)}
          </select></div>
        <div className="wa-field"><label className="wa-label">Pieces in Set</label>
          <input className="wa-input" type="number" value={form.pieces} onChange={sf("pieces")} min={1} /></div>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:8 }}>
        <Toggle value={form.isWedding}            onChange={sb("isWedding")}            label="Bridal / Wedding" />
        <Toggle value={form.isBestSeller}         onChange={sb("isBestSeller")}         label="Bestseller" />
        <Toggle value={form.isNewArrival}         onChange={sb("isNewArrival")}         label="New Arrival" />
        <Toggle value={form.isFeatured}           onChange={sb("isFeatured")}           label="Featured" />
        <Toggle value={form["inventory.inStock"]} onChange={sb("inventory.inStock")}    label="In Stock" />
        <Toggle value={form.isActive}             onChange={sb("isActive")}             label="Active / Visible" />
      </div>
    </div>
  );
}

/* ════════════════════════════════
   MAIN PAGE
════════════════════════════════ */
export default function WeddingAdminPage() {
  const [adminTab,     setAdminTab]     = useState("products");

  /* ── Products state ── */
  const [products,     setProducts]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [occFilter,    setOccFilter]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [modal,        setModal]        = useState(null);
  const [editProduct,  setEditProduct]  = useState(null);
  const [form,         setForm]         = useState(emptyForm());
  const [formErr,      setFormErr]      = useState("");
  const [saving,       setSaving]       = useState(false);

  /* ── Config state ── */
  const [configData,    setConfigData]    = useState(emptyConfig());
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving,  setConfigSaving]  = useState(false);
  const [configDirty,   setConfigDirty]   = useState(false);

  /* ── Toast ── */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Derived stats ── */
  const totalBridal   = products.filter(p => p.isWedding).length;
  const totalActive   = products.filter(p => p.isActive).length;
  const totalFeatured = products.filter(p => p.isFeatured).length;
  const avgRating     = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : "—";

  /* ── Load products ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { isWedding: true, limit: LIMIT, page };
      if (search)              params.search   = search;
      if (occFilter !== "all") params.occasion = occFilter;
      const { products: p, total: t } = await api.products.getAll(params);
      setProducts(p || []);
      setTotal(t || 0);
    } catch {
      showToast("⚠ Could not load products", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, occFilter]);

  useEffect(() => { load(); }, [load]);

  /* ── Load config when switching to config tab ── */
  useEffect(() => {
    if (adminTab !== "config") return;
    (async () => {
      setConfigLoading(true);
      try {
        const data = await api.weddingPage.getConfig();
        setConfigData({
          heroSlides:   data.heroSlides   || [],
          journeySteps: data.journeySteps || [],
          testimonials: data.testimonials || [],
        });
        setConfigDirty(false);
      } catch {
        showToast("⚠ Could not load page settings", "error");
      } finally {
        setConfigLoading(false);
      }
    })();
  }, [adminTab]);

  /* ── Occasion counts ── */
  const countOcc = occ =>
    occ === "all" ? total : products.filter(p => (p.occasion || []).includes(occ)).length;

  /* ── Product CRUD ── */
  const openAdd = () => {
    setForm(emptyForm());
    setEditProduct(null);
    setFormErr("");
    setModal("add");
  };

  const openEdit = prod => {
    const flat = { ...emptyForm() };
    Object.entries(prod).forEach(([k, v]) => {
      if (v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
        Object.entries(v).forEach(([kk, vv]) => { flat[`${k}.${kk}`] = vv ?? ""; });
      } else {
        flat[k] = v ?? "";
      }
    });
    flat.images   = prod.images   || [];
    flat.occasion = prod.occasion || [];
    setForm(flat);
    setEditProduct(prod);
    setFormErr("");
    setModal("edit");
  };

  const save = async () => {
    if (!form.name?.trim())            { setFormErr("Product name is required"); return; }
    if (!form["price.current"])        { setFormErr("Current price is required"); return; }
    if (!form.thumbnail?.trim())       { setFormErr("Thumbnail URL is required"); return; }
    if (!(form.occasion || []).length) { setFormErr("Select at least one occasion"); return; }

    setSaving(true); setFormErr("");
    try {
      const body = nestForm(form);
      body.isWedding = true;
      if (!body.slug && body.name)
        body.slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      if (editProduct) {
        await api.products.update(editProduct._id, body);
        showToast(`"${body.name}" updated ✓`);
      } else {
        await api.products.create(body);
        showToast(`"${body.name}" added ✓`);
      }
      setModal(null);
      load();
    } catch (e) {
      setFormErr(e.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async prod => {
    if (!confirm(`Delete "${prod.name}"? This cannot be undone.`)) return;
    try {
      await api.products.remove(prod._id);
      showToast(`"${prod.name}" deleted`);
      load();
    } catch (e) { showToast(e.message, "error"); }
  };

  const toggleActive = async prod => {
    try {
      await api.products.update(prod._id, { isActive: !prod.isActive });
      showToast(prod.isActive ? "Hidden from store" : "Visible in store");
      load();
    } catch (e) { showToast(e.message, "error"); }
  };

  /* ── Config helpers ── */
  const updateArr = (key, idx, field, val) => {
    const arr = [...configData[key]];
    arr[idx] = { ...arr[idx], [field]: val };
    setConfigData(prev => ({ ...prev, [key]: arr }));
    setConfigDirty(true);
  };
  const addArr = (key, emptyObj) => {
    setConfigData(prev => ({ ...prev, [key]: [...prev[key], emptyObj] }));
    setConfigDirty(true);
  };
  const delArr = (key, idx) => {
    setConfigData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
    setConfigDirty(true);
  };

  const saveConfig = async () => {
    setConfigSaving(true);
    try {
      await api.weddingPage.saveConfig(configData);
      setConfigDirty(false);
      showToast("Wedding page settings saved ✓");
    } catch (e) {
      showToast(e.message || "Save failed", "error");
    } finally {
      setConfigSaving(false);
    }
  };

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <>
      <style>{S}</style>

      {/* Toast — centered bottom, same as Page Builder */}
      {toast && (
        <div className={`wa-toast${toast.type === "error" ? " error" : ""}`}>
          {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <div className="wa-root">

        {/* ── Toolbar ── */}
        <div className="wa-toolbar">
          <div className="wa-toolbar-left">
            <div className="wa-status">
              <span className={`wa-status-dot${configSaving ? " saving" : ""}`} />
              {adminTab === "products"
                ? `${total} bridal products · ${totalActive} active`
                : configSaving ? "Saving…" : configDirty ? "Unsaved changes" : "All changes saved"
              }
            </div>
            <span style={{ color:"var(--border)", fontSize:16 }}>|</span>
            <span style={{ fontSize:12, color:"var(--text3)" }}>
              {adminTab === "products"
                ? `${totalFeatured} featured · avg ${avgRating}★`
                : `${configData.heroSlides.length} slides · ${configData.journeySteps.length} steps · ${configData.testimonials.length} reviews`
              }
            </span>
          </div>
          <div className="wa-toolbar-right">
            <a href="http://localhost:3000/wedding" target="_blank" rel="noopener" className="wa-live-link">
              <ExternalLink size={12} /> Preview Live
            </a>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="wa-tabs">
          <button className={`wa-tab${adminTab === "products" ? " active" : ""}`} onClick={() => setAdminTab("products")}>
            <Package size={16} /> Bridal Products
          </button>
          <button className={`wa-tab${adminTab === "config" ? " active" : ""}`} onClick={() => setAdminTab("config")}>
            <Settings size={16} /> Page Settings
          </button>
        </div>

        {/* ════ TAB: Products ════ */}
        {adminTab === "products" && (
          <>
            {/* Stats */}
            <div className="wa-stats">
              {[
                { label:"Total Bridal",  val:totalBridal,   color:"var(--gold)",  bg:"var(--gold-pale)",  icon:"💍" },
                { label:"Active",        val:totalActive,   color:"var(--green)", bg:"var(--green-bg)",   icon:"✓"  },
                { label:"Featured",      val:totalFeatured, color:"var(--blue)",  bg:"var(--blue-bg)",    icon:"★"  },
                { label:"Avg. Rating",   val:avgRating,     color:"var(--amber)", bg:"var(--amber-bg)",   icon:"⭐" },
              ].map((s, i) => (
                <div key={i} className="wa-stat-card">
                  <div className="wa-stat-bar" style={{ background:s.color }} />
                  <p className="wa-stat-label">{s.label}</p>
                  <p className="wa-stat-val">{s.val}</p>
                  <div className="wa-stat-icon" style={{ background:s.bg }}>{s.icon}</div>
                </div>
              ))}
            </div>

            {/* Occasion filter tabs */}
            <div className="wa-occ-tabs">
              {["all", ...OCCASIONS].map(occ => (
                <button key={occ} className={`wa-occ-tab${occFilter === occ ? " active" : ""}`}
                  onClick={() => { setOccFilter(occ); setPage(1); }}>
                  {occ === "all" ? "All Bridal" : OCCASION_LABELS[occ]}
                  <span className="wa-occ-count">{countOcc(occ)}</span>
                </button>
              ))}
            </div>

            {/* Search + Add */}
            <div style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:"var(--radius)", marginBottom:20 }}>
              <div className="wa-filter-bar">
                <div className="wa-filter-search">
                  <Search size={13} style={{ color:"var(--text3)", flexShrink:0 }} />
                  <input placeholder="Search bridal products…" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }} />
                  {search && (
                    <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", display:"flex" }}>
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button className="btn btn-primary btn-md" onClick={openAdd}>
                  <Plus size={14} /> Add Bridal Product
                </button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300, color:"var(--text3)", gap:10 }}>
                <Loader2 size={22} className="loader-spin" /> Loading products…
              </div>
            ) : products.length === 0 ? (
              <div className="wa-empty">
                <div className="wa-empty-icon">💍</div>
                <p className="wa-empty-title">No bridal products found</p>
                <p className="wa-empty-sub">
                  {search ? `No results for "${search}"` : "Add your first bridal product to get started"}
                </p>
                <button className="btn btn-primary btn-md" onClick={openAdd}>
                  <Plus size={14} /> Add First Product
                </button>
              </div>
            ) : (
              <>
                <div className="wa-grid">
                  {products.map(prod => (
                    <div key={prod._id} className={`wa-card${!prod.isActive ? " hidden-prod" : ""}`}>
                      <div style={{ position:"relative" }}>
                        <img src={prod.thumbnail || "https://picsum.photos/400/500?random=1"} alt={prod.name} className="wa-card-img" />
                        {prod.badge && <span className="wa-card-badge">{prod.badge}</span>}
                        <div className="wa-card-occ">
                          {(prod.occasion || []).slice(0, 2).map(o => (
                            <span key={o} className="wa-card-occ-pill">{OCCASION_LABELS[o] || o}</span>
                          ))}
                        </div>
                      </div>
                      <div className="wa-card-body">
                        <p className="wa-card-tag">{prod.metal?.purity} {prod.metal?.type} · {prod.category}</p>
                        <p className="wa-card-name">{prod.name}</p>
                        <p className="wa-card-meta">
                          {prod.metal?.weight ? `${prod.metal.weight}g` : ""}{prod.pieces > 1 ? ` · ${prod.pieces} pcs` : ""}
                        </p>
                        <div className="wa-card-rating">
                          <Star size={11} fill="#B8862A" color="#B8862A" />
                          <span>{prod.rating || "—"}</span>
                          <span style={{ color:"var(--text3)" }}>({prod.reviewCount || 0})</span>
                          {!prod.isActive && <Badge variant="gray">Hidden</Badge>}
                          {prod.isFeatured && <Badge variant="blue">Featured</Badge>}
                        </div>
                        <p className="wa-card-price">
                          {fmt(prod.price?.current)}
                          {prod.price?.original > prod.price?.current && (
                            <span className="wa-card-orig">{fmt(prod.price.original)}</span>
                          )}
                        </p>
                        <div className="wa-card-actions">
                          <button className="wa-card-btn" onClick={() => openEdit(prod)}><Edit2 size={11} /> Edit</button>
                          <button className="wa-card-btn" onClick={() => toggleActive(prod)} title={prod.isActive ? "Hide" : "Show"}>
                            {prod.isActive ? <EyeOff size={11} /> : <Eye size={11} />}
                          </button>
                          <button className="wa-card-btn danger" onClick={() => remove(prod)}><Trash2 size={11} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:20 }}>
                  <Pagination page={page} pages={Math.ceil(total / LIMIT)} total={total} limit={LIMIT} onPage={setPage} />
                </div>
              </>
            )}
          </>
        )}

        {/* ════ TAB: Config ════ */}
        {adminTab === "config" && (
          <>
            {configLoading ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:400, color:"var(--text3)", gap:10 }}>
                <Loader2 size={22} className="loader-spin" /> Loading page settings…
              </div>
            ) : (
              <>
                {/* Hero Slides */}
                <div className="wa-cfg-card">
                  <div className="wa-cfg-title">
                    <span>Hero <em>Slides</em></span>
                    <span className="wa-cfg-title-count">{configData.heroSlides.length} slides</span>
                  </div>
                  {configData.heroSlides.map((s, i) => (
                    <div key={i} className="wa-cfg-row">
                      <button className="wa-cfg-row-del" onClick={() => delArr("heroSlides", i)} title="Remove slide">
                        <Trash2 size={14} />
                      </button>
                      <div className="wa-form-grid full" style={{ marginBottom:12 }}>
                        <div className="wa-field"><label className="wa-label">Image URL</label>
                          <input className="wa-input" value={s.img || ""} onChange={e => updateArr("heroSlides", i, "img", e.target.value)} placeholder="https://..." /></div>
                      </div>
                      <div className="wa-form-grid three">
                        <div className="wa-field"><label className="wa-label">Eyebrow</label>
                          <input className="wa-input" value={s.eyebrow || ""} onChange={e => updateArr("heroSlides", i, "eyebrow", e.target.value)} placeholder="New Collection" /></div>
                        <div className="wa-field"><label className="wa-label">Title</label>
                          <input className="wa-input" value={s.title || ""} onChange={e => updateArr("heroSlides", i, "title", e.target.value)} placeholder="Bridal" /></div>
                        <div className="wa-field"><label className="wa-label">Italic Highlight (Em)</label>
                          <input className="wa-input" value={s.em || ""} onChange={e => updateArr("heroSlides", i, "em", e.target.value)} placeholder="Splendour" /></div>
                      </div>
                      <div className="wa-form-grid">
                        <div className="wa-field"><label className="wa-label">Subtitle</label>
                          <input className="wa-input" value={s.subtitle || ""} onChange={e => updateArr("heroSlides", i, "subtitle", e.target.value)} placeholder="Crafted for your special day" /></div>
                        <div className="wa-field"><label className="wa-label">CTA Link</label>
                          <input className="wa-input" value={s.ctaHref || ""} onChange={e => updateArr("heroSlides", i, "ctaHref", e.target.value)} placeholder="/listing?isWedding=true" /></div>
                      </div>
                    </div>
                  ))}
                  <button className="wa-add-row-btn" onClick={() => addArr("heroSlides", { img:"", eyebrow:"", title:"", em:"", subtitle:"", ctaHref:"" })}>
                    <Plus size={13} /> Add Slide
                  </button>
                </div>

                {/* Journey Steps */}
                <div className="wa-cfg-card">
                  <div className="wa-cfg-title">
                    <span>Journey <em>Steps</em></span>
                    <span className="wa-cfg-title-count">{configData.journeySteps.length} steps</span>
                  </div>
                  {configData.journeySteps.map((s, i) => (
                    <div key={i} className="wa-cfg-row">
                      <button className="wa-cfg-row-del" onClick={() => delArr("journeySteps", i)} title="Remove step">
                        <Trash2 size={14} />
                      </button>
                      <div className="wa-form-grid three">
                        <div className="wa-field"><label className="wa-label">Step Number</label>
                          <input className="wa-input" value={s.num || ""} onChange={e => updateArr("journeySteps", i, "num", e.target.value)} placeholder="01" /></div>
                        <div className="wa-field"><label className="wa-label">Title</label>
                          <input className="wa-input" value={s.title || ""} onChange={e => updateArr("journeySteps", i, "title", e.target.value)} placeholder="Select Your Set" /></div>
                        <div className="wa-field"><label className="wa-label">Description</label>
                          <input className="wa-input" value={s.desc || ""} onChange={e => updateArr("journeySteps", i, "desc", e.target.value)} placeholder="Browse our curated bridal range" /></div>
                      </div>
                    </div>
                  ))}
                  <button className="wa-add-row-btn" onClick={() => addArr("journeySteps", { num:"", title:"", desc:"" })}>
                    <Plus size={13} /> Add Step
                  </button>
                </div>

                {/* Testimonials */}
                <div className="wa-cfg-card">
                  <div className="wa-cfg-title">
                    <span>Client <em>Testimonials</em></span>
                    <span className="wa-cfg-title-count">{configData.testimonials.length} reviews</span>
                  </div>
                  {configData.testimonials.map((s, i) => (
                    <div key={i} className="wa-cfg-row">
                      <button className="wa-cfg-row-del" onClick={() => delArr("testimonials", i)} title="Remove testimonial">
                        <Trash2 size={14} />
                      </button>
                      <div className="wa-form-grid three">
                        <div className="wa-field"><label className="wa-label">Name</label>
                          <input className="wa-input" value={s.name || ""} onChange={e => updateArr("testimonials", i, "name", e.target.value)} placeholder="Priya Sharma" /></div>
                        <div className="wa-field"><label className="wa-label">City</label>
                          <input className="wa-input" value={s.city || ""} onChange={e => updateArr("testimonials", i, "city", e.target.value)} placeholder="Mumbai" /></div>
                        <div className="wa-field"><label className="wa-label">Set Purchased</label>
                          <input className="wa-input" value={s.set || ""} onChange={e => updateArr("testimonials", i, "set", e.target.value)} placeholder="Rani Haar Bridal Set" /></div>
                      </div>
                      <div className="wa-form-grid full" style={{ marginTop:12 }}>
                        <div className="wa-field"><label className="wa-label">Review Text</label>
                          <textarea className="wa-textarea" value={s.text || ""} onChange={e => updateArr("testimonials", i, "text", e.target.value)} rows={2} placeholder="Absolutely stunning craftsmanship…" /></div>
                      </div>
                    </div>
                  ))}
                  <button className="wa-add-row-btn" onClick={() => addArr("testimonials", { name:"", city:"", text:"", set:"", img:"" })}>
                    <Plus size={13} /> Add Testimonial
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <div className="wa-spacer" />
      </div>

      {/* ── Sticky Save Bar — identical to Page Builder's pb-save-bar ── */}
      {adminTab === "config" && (
        <div className="wa-save-bar">
          <div className="wa-save-bar-info">
            <Layout size={14} style={{ color:"var(--gold)" }} />
            Wedding Page · {configData.heroSlides.length} slides · {configData.journeySteps.length} steps · {configData.testimonials.length} reviews
            {configDirty && (
              <span style={{ color:"var(--amber)", display:"flex", alignItems:"center", gap:5 }}>
                <AlertCircle size={13} /> Unsaved changes
              </span>
            )}
          </div>
          <div className="wa-save-bar-actions">
            <button className="btn btn-primary btn-md" onClick={saveConfig} disabled={configSaving || !configDirty}>
              {configSaving
                ? <><Loader2 size={13} className="loader-spin" /> Saving…</>
                : <><Save size={13} /> Save Page Settings</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Add <em>Bridal Product</em>" : `Edit <em>${editProduct?.name || "Product"}</em>`}
        width={680}
        footer={
          <>
            <button className="btn btn-outline btn-md" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary btn-md" onClick={save} disabled={saving}>
              {saving
                ? <><Loader2 size={13} className="loader-spin" /> Saving…</>
                : <><Save size={13} /> {modal === "add" ? "Add Product" : "Save Changes"}</>
              }
            </button>
          </>
        }
      >
        <ProductForm form={form} setForm={setForm} err={formErr} />
      </Modal>
    </>
  );
}