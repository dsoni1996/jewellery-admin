"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, X, Edit2, Trash2, Eye, EyeOff,
  Loader2, Check, AlertCircle, Heart, Star,
  ChevronDown, ChevronUp, Save, RotateCcw,
  Package, Tag, Image,
} from "lucide-react";
import { api } from "../../../lib/api";
import { Badge, Modal, Toggle, Pagination } from "../../../components/common";

/* ─── Occasion options ─── */
const OCCASIONS = ["engagement","mehendi","sangeet","wedding","reception","honeymoon"];
const OCCASION_LABELS = {
  engagement:"Engagement", mehendi:"Mehendi", sangeet:"Sangeet",
  wedding:"Wedding Day",   reception:"Reception", honeymoon:"Honeymoon",
};

const CATEGORIES = ["Ring","Necklace","Earring","Bangle","Bracelet","Mangalsutra","Pendant","Chain","Haath Phool","Other"];
const PURITIES   = ["22KT","18KT","14KT","24KT"];
const METALS     = ["Yellow Gold","White Gold","Rose Gold"];
const BADGES     = ["Bestseller","New","Limited","Exclusive","Top Rated"];

/* ─── Styles ─── */
const S = `
/* Stats */
.wd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
@media(max-width:900px){.wd-stats{grid-template-columns:repeat(2,1fr);}}

/* Filter tabs */
.wd-occ-tabs{display:flex;gap:0;overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius);background:var(--white);margin-bottom:20px;scrollbar-width:none;}
.wd-occ-tabs::-webkit-scrollbar{display:none;}
.wd-occ-tab{flex-shrink:0;background:none;border:none;padding:10px 18px;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);cursor:pointer;font-family:var(--font-sans);transition:all .15s;border-right:1px solid var(--border);white-space:nowrap;}
.wd-occ-tab:last-child{border-right:none;}
.wd-occ-tab:hover{color:var(--dark);background:var(--bg);}
.wd-occ-tab.active{background:var(--dark);color:var(--gold-light);}
.wd-occ-count{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.15);font-size:9px;margin-left:5px;}
.wd-occ-tab:not(.active) .wd-occ-count{background:var(--bg);color:var(--text3);}

/* Product grid */
.wd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;}
.wd-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:box-shadow .2s,transform .2s;position:relative;}
.wd-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
.wd-card.hidden-prod{opacity:.55;}
.wd-card-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;background:var(--bg);}
.wd-card-badge{position:absolute;top:10px;left:10px;background:rgba(44,26,14,.85);color:#D4AF6A;font-size:9px;letter-spacing:1.5px;padding:3px 9px;text-transform:uppercase;border-radius:2px;}
.wd-card-occ{position:absolute;bottom:8px;left:8px;display:flex;gap:4px;flex-wrap:wrap;}
.wd-card-occ-pill{background:rgba(44,26,14,.72);color:#D4AF6A;font-size:9px;letter-spacing:1px;padding:2px 7px;text-transform:uppercase;border-radius:2px;backdrop-filter:blur(4px);}
.wd-card-body{padding:12px 14px;}
.wd-card-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:4px;}
.wd-card-name{font-family:var(--font-serif);font-size:16px;font-weight:400;color:var(--dark);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.wd-card-meta{font-size:11px;color:var(--text3);margin-bottom:8px;}
.wd-card-price{font-family:var(--font-serif);font-size:18px;color:var(--dark);margin-bottom:8px;}
.wd-card-orig{font-size:11px;color:var(--text3);text-decoration:line-through;margin-left:5px;}
.wd-card-rating{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text2);margin-bottom:10px;}
.wd-card-actions{display:flex;gap:6px;}
.wd-card-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:7px;border-radius:var(--radius);border:1px solid var(--border);background:none;cursor:pointer;color:var(--text2);font-family:var(--font-sans);transition:all .15s;}
.wd-card-btn:hover{border-color:var(--gold);color:var(--gold);}
.wd-card-btn.danger:hover{border-color:var(--red);color:var(--red);background:var(--red-bg);}

/* Occasion pills in form */
.wd-occ-pills{display:flex;flex-wrap:wrap;gap:8px;}
.wd-occ-pill-btn{border:1px solid var(--border);background:none;padding:6px 14px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:2px;font-family:var(--font-sans);color:var(--text2);transition:all .2s;}
.wd-occ-pill-btn:hover{border-color:var(--gold);color:var(--gold);}
.wd-occ-pill-btn.selected{background:var(--dark);border-color:var(--dark);color:var(--gold-light);}

/* Image previews in form */
.wd-img-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.wd-img-thumb{width:60px;height:60px;object-fit:cover;border-radius:var(--radius);border:1px solid var(--border);background:var(--bg);}
.wd-img-add-row{display:flex;gap:8px;margin-top:8px;}

/* Section title in form */
.wd-form-section{font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin:16px 0 10px;display:flex;align-items:center;gap:8px;}
.wd-form-section::after{content:'';flex:1;height:1px;background:var(--border);}

/* Toast */
.wd-toast{position:fixed;bottom:28px;right:24px;padding:12px 22px;border-radius:var(--radius);font-size:13px;z-index:200;display:flex;align-items:center;gap:8px;box-shadow:var(--shadow-md);animation:wd-toast-in .25s ease;font-family:var(--font-sans);}
@keyframes wd-toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.wd-toast.success{background:var(--dark);color:var(--gold-light);}
.wd-toast.error{background:var(--red);color:#fff;}

/* Empty state */
.wd-empty{text-align:center;padding:60px 20px;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);}
.wd-empty-icon{font-size:40px;margin-bottom:14px;}
.wd-empty-title{font-family:var(--font-serif);font-size:24px;color:var(--dark);margin-bottom:6px;}
.wd-spin{animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
`;

/* ─── Empty product form ─── */
const emptyForm = () => ({
  name: "", slug: "", description: "", sku: "",
  category: "Necklace", subCategory: "",
  occasion: [],
  "price.current": "", "price.original": "",
  thumbnail: "", images: [],
  "metal.type": "Yellow Gold", "metal.purity": "22KT", "metal.weight": "",
  "stones.type": "", "stones.weight": "",
  pieces: 1, piecesList: "",
  makingCharges: "",
  "inventory.quantity": 5, "inventory.inStock": true,
  isBestSeller: false, isNewArrival: false, isFeatured: true, isWedding: true,
  badge: "Bestseller",
  certification: "BIS Hallmarked",
  rating: 4.8, reviewCount: 0,
  isActive: true,
});

/* ─── Flatten nested object for form state ─── */
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

/* ─── format price ─── */
const fmt = n => n ? "₹ " + Number(n).toLocaleString("en-IN") : "—";

/* ═══════════════════════════════════════
   PRODUCT FORM MODAL BODY
═══════════════════════════════════════ */
function ProductForm({ form, setForm, err }) {
  const sf = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const sb = k => v => setForm(p => ({ ...p, [k]: v }));

  const toggleOcc = (occ) => {
    setForm(p => ({
      ...p,
      occasion: p.occasion.includes(occ)
        ? p.occasion.filter(o => o !== occ)
        : [...p.occasion, occ],
    }));
  };

  const [imgUrl, setImgUrl] = useState("");
  const addImage = () => {
    if (!imgUrl.trim()) return;
    setForm(p => ({ ...p, images: [...(p.images || []), imgUrl.trim()], thumbnail: p.thumbnail || imgUrl.trim() }));
    setImgUrl("");
  };
  const removeImage = (i) => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  return (
    <div>
      {err && (
        <div style={{ background:"var(--red-bg)", color:"var(--red)", padding:"10px 14px", borderRadius:"var(--radius)", marginBottom:14, fontSize:12.5, display:"flex", gap:8, alignItems:"center" }}>
          <AlertCircle size={14} /> {err}
        </div>
      )}

      {/* Basic Info */}
      <p className="wd-form-section">Basic Information</p>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Product Name *</label>
          <input className="form-input" value={form.name} onChange={sf("name")} placeholder="Rani Haar Bridal Set" />
        </div>
        <div className="form-field">
          <label className="form-label">SKU</label>
          <input className="form-input" value={form.sku} onChange={sf("sku")} placeholder="MAN-NEC-001" />
        </div>
      </div>
      <div className="form-grid full">
        <div className="form-field">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={sf("description")} rows={3} placeholder="A statement bridal set crafted in 22KT gold…" />
        </div>
      </div>
      <div className="form-grid full">
        <div className="form-field">
          <label className="form-label">Pieces List</label>
          <input className="form-input" value={form.piecesList} onChange={sf("piecesList")} placeholder="Necklace · Earrings · Maang Tikka · Bangles" />
        </div>
      </div>

      {/* Occasions */}
      <p className="wd-form-section">Occasions</p>
      <div className="wd-occ-pills">
        {OCCASIONS.map(occ => (
          <button key={occ} type="button"
            className={`wd-occ-pill-btn${form.occasion?.includes(occ) ? " selected" : ""}`}
            onClick={() => toggleOcc(occ)}>
            {OCCASION_LABELS[occ]}
          </button>
        ))}
      </div>

      {/* Category & Metal */}
      <p className="wd-form-section">Category & Metal</p>
      <div className="form-grid three">
        <div className="form-field">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.category} onChange={sf("category")}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Metal Type</label>
          <select className="form-select" value={form["metal.type"]} onChange={sf("metal.type")}>
            {METALS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Purity</label>
          <select className="form-select" value={form["metal.purity"]} onChange={sf("metal.purity")}>
            {PURITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="form-grid three">
        <div className="form-field">
          <label className="form-label">Metal Weight (g)</label>
          <input className="form-input" type="number" value={form["metal.weight"]} onChange={sf("metal.weight")} placeholder="74.09" />
        </div>
        <div className="form-field">
          <label className="form-label">Stone Type</label>
          <input className="form-input" value={form["stones.type"]} onChange={sf("stones.type")} placeholder="Diamond / Emerald" />
        </div>
        <div className="form-field">
          <label className="form-label">Stone Weight (ct)</label>
          <input className="form-input" type="number" value={form["stones.weight"]} onChange={sf("stones.weight")} placeholder="0.45" />
        </div>
      </div>

      {/* Pricing */}
      <p className="wd-form-section">Pricing</p>
      <div className="form-grid three">
        <div className="form-field">
          <label className="form-label">Current Price (₹) *</label>
          <input className="form-input" type="number" value={form["price.current"]} onChange={sf("price.current")} placeholder="524000" />
        </div>
        <div className="form-field">
          <label className="form-label">Original Price (₹)</label>
          <input className="form-input" type="number" value={form["price.original"]} onChange={sf("price.original")} placeholder="578000" />
        </div>
        <div className="form-field">
          <label className="form-label">Making Charges (₹)</label>
          <input className="form-input" type="number" value={form.makingCharges} onChange={sf("makingCharges")} placeholder="14200" />
        </div>
      </div>

      {/* Images */}
      <p className="wd-form-section"><Image size={13} /> Images</p>
      <div className="form-field">
        <label className="form-label">Thumbnail URL *</label>
        <input className="form-input" value={form.thumbnail} onChange={sf("thumbnail")} placeholder="https://..." />
      </div>
      <div className="form-field" style={{ marginTop:10 }}>
        <label className="form-label">Gallery Images</label>
        <div className="wd-img-list">
          {(form.images || []).map((img, i) => (
            <div key={i} style={{ position:"relative" }}>
              <img src={img} alt="" className="wd-img-thumb" />
              <button type="button" onClick={() => removeImage(i)}
                style={{ position:"absolute", top:-5, right:-5, width:16, height:16, border:"none", borderRadius:"50%", background:"var(--red)", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9 }}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="wd-img-add-row">
          <input className="form-input" value={imgUrl} onChange={e => setImgUrl(e.target.value)}
            placeholder="Paste image URL and click Add" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())} />
          <button type="button" className="btn btn-outline btn-sm" onClick={addImage}><Plus size={13} /></button>
        </div>
      </div>

      {/* Inventory & Flags */}
      <p className="wd-form-section">Inventory & Display</p>
      <div className="form-grid three">
        <div className="form-field">
          <label className="form-label">Stock Qty</label>
          <input className="form-input" type="number" value={form["inventory.quantity"]} onChange={sf("inventory.quantity")} />
        </div>
        <div className="form-field">
          <label className="form-label">Badge</label>
          <select className="form-select" value={form.badge || ""} onChange={sf("badge")}>
            <option value="">No Badge</option>
            {BADGES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Pieces in Set</label>
          <input className="form-input" type="number" value={form.pieces} onChange={sf("pieces")} min={1} />
        </div>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:8 }}>
        <Toggle value={form.isWedding}    onChange={sb("isWedding")}    label="Bridal / Wedding" />
        <Toggle value={form.isBestSeller} onChange={sb("isBestSeller")} label="Bestseller" />
        <Toggle value={form.isNewArrival} onChange={sb("isNewArrival")} label="New Arrival" />
        <Toggle value={form.isFeatured}   onChange={sb("isFeatured")}   label="Featured" />
        <Toggle value={form["inventory.inStock"]} onChange={sb("inventory.inStock")} label="In Stock" />
        <Toggle value={form.isActive}     onChange={sb("isActive")}     label="Active / Visible" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function WeddingAdminPage() {
  const [products,    setProducts]    = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [occFilter,   setOccFilter]   = useState("all");
  const [search,      setSearch]      = useState("");
  const [modal,       setModal]       = useState(null); 
  const [editProduct, setEditProduct] = useState(null);
  const [form,        setForm]        = useState(emptyForm());
  const [formErr,     setFormErr]     = useState("");
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const LIMIT = 20;

  /* ── Stats ── */
  const totalBridal   = products.filter(p => p.isWedding).length;
  const totalActive   = products.filter(p => p.isActive).length;
  const totalFeatured = products.filter(p => p.isFeatured).length;
  const avgRating     = products.length
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1)
    : "—";

 

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Load ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { isWedding: true, limit: LIMIT, page };
      if (search) params.search = search;
      if (occFilter !== "all") params.occasion = occFilter;
      const { products: p, total: t } = await api.products.getAll(params);
      setProducts(p || []);
      setTotal(t || 0);
    } catch { } finally { setLoading(false); }
  }, [page, search, occFilter]);

  useEffect(() => { load(); }, [load]);

  /* ── Occasion counts ── */
  const countOcc = occ => occ === "all" ? total : products.filter(p => (p.occasion || []).includes(occ)).length;

  /* ── Open add modal ── */
  const openAdd = () => {
    setForm(emptyForm());
    setEditProduct(null);
    setFormErr("");
    setModal("add");
  };

  /* ── Open edit modal ── */
  const openEdit = (prod) => {
    const flat = { ...emptyForm() };
    Object.entries(prod).forEach(([k, v]) => {
      if (v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
        Object.entries(v).forEach(([kk, vv]) => { flat[`${k}.${kk}`] = vv ?? ""; });
      } else {
        flat[k] = v ?? "";
      }
    });
    flat.images   = prod.images || [];
    flat.occasion = prod.occasion || [];
    setForm(flat);
    setEditProduct(prod);
    setFormErr("");
    setModal("edit");
  };

  /* ── Save ── */
  const save = async () => {
    if (!form.name?.trim()) { setFormErr("Product name is required"); return; }
    if (!form["price.current"]) { setFormErr("Current price is required"); return; }
    if (!form.thumbnail?.trim()) { setFormErr("Thumbnail URL is required"); return; }
    if ((form.occasion || []).length === 0) { setFormErr("Select at least one occasion"); return; }

    setSaving(true); setFormErr("");
    try {
      const body = nestForm(form);
      /* ensure isWedding is always true for this page */
      body.isWedding = true;
      /* auto-generate slug from name */
      if (!body.slug && body.name) {
        body.slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }

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
    } finally { setSaving(false); }
  };

  /* ── Delete ── */
  const remove = async (prod) => {
    if (!confirm(`Delete "${prod.name}"? This cannot be undone.`)) return;
    try {
      await api.products.remove(prod._id);
      showToast(`"${prod.name}" deleted`);
      load();
    } catch (e) { showToast(e.message, "error"); }
  };

  /* ── Toggle visibility (active) ── */
  const toggleActive = async (prod) => {
    try {
      await api.products.update(prod._id, { isActive: !prod.isActive });
      showToast(prod.isActive ? "Hidden from store" : "Visible in store");
      load();
    } catch (e) { showToast(e.message, "error"); }
  };

  return (
    <>
      <style>{S}</style>
      {toast && (
        <div className={`wd-toast ${toast.type}`}>
          {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="wd-stats">
        {[
          { label:"Total Bridal",   val: totalBridal,   color:"var(--gold)",  bg:"var(--gold-pale)",  icon:"💍" },
          { label:"Active",         val: totalActive,   color:"var(--green)", bg:"var(--green-bg)",   icon:"✓"  },
          { label:"Featured",       val: totalFeatured, color:"var(--blue)",  bg:"var(--blue-bg)",    icon:"★"  },
          { label:"Avg. Rating",    val: avgRating,     color:"var(--amber)", bg:"var(--amber-bg)",   icon:"⭐" },
        ].map((s,i) => (
          <div key={i} style={{ background:"var(--white)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"18px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.color }} />
            <p style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text3)", marginBottom:8 }}>{s.label}</p>
            <p style={{ fontFamily:"var(--font-serif)", fontSize:32, color:"var(--dark)" }}>{s.val}</p>
            <div style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:"50%", background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Occasion filter tabs ── */}
      <div className="wd-occ-tabs">
        {["all", ...OCCASIONS].map(occ => (
          <button key={occ} className={`wd-occ-tab${occFilter === occ ? " active" : ""}`}
            onClick={() => { setOccFilter(occ); setPage(1); }}>
            {occ === "all" ? "All Bridal" : OCCASION_LABELS[occ]}
            <span className="wd-occ-count">{countOcc(occ)}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="filter-bar">
          <div className="filter-search" style={{ flex:2 }}>
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

      {/* ── Product grid ── */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:60, color:"var(--text3)" }}>
          <Loader2 size={24} className="wd-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="wd-empty">
          <div className="wd-empty-icon">💍</div>
          <p className="wd-empty-title">No bridal products found</p>
          <p style={{ fontSize:13, color:"var(--text3)", marginBottom:20 }}>
            {search ? `No results for "${search}"` : "Add your first bridal product to get started"}
          </p>
          <button className="btn btn-primary btn-md" onClick={openAdd}>
            <Plus size={14} /> Add First Product
          </button>
        </div>
      ) : (
        <>
          <div className="wd-grid">
            {products.map(prod => (
              <div key={prod._id} className={`wd-card${!prod.isActive ? " hidden-prod" : ""}`}>
                <div style={{ position:"relative" }}>
                  <img
                    src={prod.thumbnail || "https://picsum.photos/400/500?random=1"}
                    alt={prod.name}
                    className="wd-card-img"
                  />
                  {prod.badge && <span className="wd-card-badge">{prod.badge}</span>}
                  <div className="wd-card-occ">
                    {(prod.occasion || []).slice(0,2).map(o => (
                      <span key={o} className="wd-card-occ-pill">{OCCASION_LABELS[o] || o}</span>
                    ))}
                  </div>
                </div>

                <div className="wd-card-body">
                  <p className="wd-card-tag">{prod.metal?.purity} {prod.metal?.type} · {prod.category}</p>
                  <p className="wd-card-name">{prod.name}</p>
                  <p className="wd-card-meta">
                    {prod.metal?.weight ? `${prod.metal.weight}g` : ""}{prod.pieces > 1 ? ` · ${prod.pieces} pcs` : ""}
                  </p>

                  <div className="wd-card-rating">
                    <Star size={11} fill="#B8862A" color="#B8862A" />
                    <span>{prod.rating || "—"}</span>
                    <span style={{ color:"var(--text3)" }}>({prod.reviewCount || 0})</span>
                    {!prod.isActive && <Badge variant="gray">Hidden</Badge>}
                    {prod.isFeatured && <Badge variant="blue">Featured</Badge>}
                  </div>

                  <p className="wd-card-price">
                    {fmt(prod.price?.current)}
                    {prod.price?.original > prod.price?.current && (
                      <span className="wd-card-orig">{fmt(prod.price.original)}</span>
                    )}
                  </p>

                  <div className="wd-card-actions">
                    <button className="wd-card-btn" onClick={() => openEdit(prod)}>
                      <Edit2 size={11} /> Edit
                    </button>
                    <button className="wd-card-btn" onClick={() => toggleActive(prod)} title={prod.isActive ? "Hide" : "Show"}>
                      {prod.isActive ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button className="wd-card-btn danger" onClick={() => remove(prod)}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20 }}>
            <Pagination page={page} pages={Math.ceil(total/LIMIT)} total={total} limit={LIMIT} onPage={setPage} />
          </div>
        </>
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
                ? <><Loader2 size={13} className="wd-spin" /> Saving…</>
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