"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, X, Upload, Image } from "lucide-react";
import { Badge, Modal, Pagination, Toggle } from "../../../components/common";
import { api } from "../../../lib/api";

const CATEGORIES = ["Ring","Necklace","Earring","Bangle","Bracelet","Mangalsutra","Pendant","Chain","Other"];
const PURITIES   = ["22KT","18KT","14KT","24KT"];
const METAL_TYPES= ["Yellow Gold","White Gold","Rose Gold"];
const BASE       = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const S = `
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
.prod-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:box-shadow .2s,transform .2s;}
.prod-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
.prod-card-img{width:100%;aspect-ratio:1;object-fit:cover;background:var(--bg);display:block;}
.prod-card-body{padding:12px 14px;}
.prod-card-tag{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:4px;}
.prod-card-name{font-size:14px;font-weight:500;color:var(--dark);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.prod-card-price{font-size:15px;font-weight:600;color:var(--dark);margin-bottom:8px;}
.prod-card-actions{display:flex;gap:6px;}
.prod-card-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;background:var(--bg);border:1px solid var(--border);padding:6px;font-size:11px;cursor:pointer;border-radius:var(--radius);color:var(--text2);transition:all .15s;font-family:var(--font-sans);letter-spacing:.5px;}
.prod-card-btn:hover{border-color:var(--gold);color:var(--gold);}
.prod-card-btn.danger:hover{border-color:var(--red);color:var(--red);background:var(--red-bg);}
.stock-dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:4px;}
.stock-in{background:var(--green);}.stock-out{background:var(--red);}
.view-toggle{display:flex;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.view-btn{background:none;border:none;padding:7px 12px;cursor:pointer;color:var(--text3);transition:all .15s;display:flex;align-items:center;}
.view-btn.active{background:var(--dark);color:var(--gold-light);}

/* ── Image uploader ── */
.img-upload-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;}
.img-thumb-wrap{position:relative;width:72px;height:72px;flex-shrink:0;}
.img-thumb{width:100%;height:100%;object-fit:cover;border-radius:var(--radius);border:1px solid var(--border);display:block;background:var(--bg);}
.img-thumb-del{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--red);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;transition:transform .15s;}
.img-thumb-del:hover{transform:scale(1.15);}
.img-thumb-primary{position:absolute;bottom:2px;left:2px;background:rgba(44,26,14,.75);color:#D4AF6A;font-size:8px;letter-spacing:.5px;padding:1px 5px;border-radius:2px;}
.img-upload-btn{width:72px;height:72px;border:1.5px dashed var(--border);border-radius:var(--radius);background:var(--bg);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:var(--gold);transition:all .2s;flex-shrink:0;}
.img-upload-btn:hover{border-color:var(--gold);background:var(--gold-pale);}
.img-upload-btn:disabled{opacity:.5;cursor:not-allowed;}
.img-upload-btn span{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--text3);}
.img-url-row{display:flex;gap:8px;margin-top:4px;}
.img-sep{display:flex;align-items:center;gap:10px;margin:10px 0;font-size:11px;color:var(--text3);}
.img-sep::before,.img-sep::after{content:'';flex:1;height:1px;background:var(--border);}
.img-upload-progress{height:2px;background:var(--gold-pale);border-radius:1px;overflow:hidden;margin-top:4px;}
.img-upload-progress-bar{height:100%;background:var(--gold);transition:width .3s ease;}
`;

/* ── Image Uploader Component ── */
function ImageUploader({ thumbnail, images = [], onThumbChange, onImagesChange }) {
  const fileRef    = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [urlInput,  setUrlInput]  = useState("");
  const [urlErr,    setUrlErr]    = useState("");

  const uploadFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true); setProgress(0);
    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) { alert(`${file.name} is over 5MB`); continue; }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${BASE}/upload/single`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) uploaded.push(data.url);
      } catch (e) {
        console.error("Upload failed:", e);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (uploaded.length) {
      const allImgs = [...images, ...uploaded];
      onImagesChange(allImgs);
      if (!thumbnail) onThumbChange(allImgs[0]);
    }
    setUploading(false); setProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    setUrlErr("");
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http")) { setUrlErr("Enter a valid URL starting with http"); return; }
    const allImgs = [...images, url];
    onImagesChange(allImgs);
    if (!thumbnail) onThumbChange(url);
    setUrlInput("");
  };

  const removeImg = (idx) => {
    const next = images.filter((_, i) => i !== idx);
    onImagesChange(next);
    if (thumbnail === images[idx]) onThumbChange(next[0] || "");
  };

  const setAsThumbnail = (url) => onThumbChange(url);

  return (
    <div>
      {/* Image thumbs */}
      <div className="img-upload-grid">
        {images.map((url, i) => (
          <div key={i} className="img-thumb-wrap" title="Click to set as thumbnail">
            <img src={url} alt="" className="img-thumb" onClick={() => setAsThumbnail(url)} style={{ cursor:"pointer" }} />
            {thumbnail === url && <span className="img-thumb-primary">Main</span>}
            <button className="img-thumb-del" onClick={() => removeImg(i)} type="button">✕</button>
          </div>
        ))}

        {/* Upload button */}
        {images.length < 6 && (
          <button
            type="button"
            className="img-upload-btn"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading
              ? <Loader2 size={18} style={{ animation:"spin .8s linear infinite" }} />
              : <Upload size={18} />
            }
            <span>{uploading ? "Uploading" : "Upload"}</span>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="img-upload-progress">
          <div className="img-upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display:"none" }}
        onChange={e => uploadFiles(e.target.files)}
      />

      {/* OR paste URL */}
      <div className="img-sep">or paste URL</div>
      <div className="img-url-row">
        <input
          className="form-input"
          style={{ fontSize:12 }}
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); setUrlErr(""); }}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={addUrl}>
          <Plus size={13} />
        </button>
      </div>
      {urlErr && <p style={{ fontSize:11, color:"var(--red)", marginTop:4 }}>{urlErr}</p>}

      <p style={{ fontSize:11, color:"var(--text3)", marginTop:6 }}>
        {images.length}/6 images · Click image to set as main thumbnail · Max 5MB each
      </p>
    </div>
  );
}

/* ── Form helpers ── */
const emptyForm = () => ({
  sku:"", name:"", slug:"", description:"",
  category:"Ring", subCategory:"",
  "price.current":"", "price.original":"", "price.discountPercent":0,
  thumbnail:"", images:[],
  "metal.type":"Yellow Gold", "metal.purity":"22KT", "metal.weight":"",
  "stones.type":"", "stones.weight":"",
  "inventory.quantity":10, "inventory.inStock":true,
  isBestSeller:false, isNewArrival:false, isFeatured:false, isWedding:false,
  makingCharges:"", certification:"BIS Hallmarked",
});

function nestForm(flat) {
  const out = {};
  Object.entries(flat).forEach(([k, v]) => {
    const parts = k.split(".");
    if (parts.length === 2) {
      if (!out[parts[0]]) out[parts[0]] = {};
      out[parts[0]][parts[1]] = v;
    } else { out[k] = v; }
  });
  return out;
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("grid");
  const [search,   setSearch]   = useState("");
  const [catFilter,setCat]      = useState("");
  const [modal,    setModal]    = useState(null);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyForm());
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState("");
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search)    params.search   = search;
      if (catFilter) params.category = catFilter;
      const { products: p, total: t } = await api.products.getAll(params);
      setProducts(p); setTotal(t);
    } catch { } finally { setLoading(false); }
  }, [page, search, catFilter]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(emptyForm()); setEditing(null); setErr(""); setModal("add"); };

  const openEdit = prod => {
    const flat = { ...emptyForm() };
    Object.entries(prod).forEach(([k, v]) => {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        Object.entries(v).forEach(([kk, vv]) => { flat[`${k}.${kk}`] = vv ?? ""; });
      } else { flat[k] = v ?? ""; }
    });
    flat.images = prod.images || [];
    setForm(flat); setEditing(prod); setErr(""); setModal("edit");
  };

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target?.value ?? e }));
  const setB = k => v => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name?.trim()) { setErr("Product name is required"); return; }
    setSaving(true); setErr("");
    try {
      const body = nestForm(form);
      if (!body.slug && body.name)
        body.slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      /* images array already nested in form */
      body.images = form.images || [];

      if (editing) {
        await api.products.update(editing._id, body);
      } else {
        await api.products.create(body);
      }
      setModal(null); load();
    } catch (e) { setErr(e.message); } finally { setSaving(false); }
  };

  const remove = async prod => {
    if (!confirm(`Delete "${prod.name}"?`)) return;
    await api.products.remove(prod._id);
    load();
  };

  const fmt = n => n ? "₹ " + Number(n).toLocaleString("en-IN") : "—";

  return (
    <>
      <style>{S}</style>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="filter-bar">
          <div className="filter-search" style={{ flex:2 }}>
            <Search size={13} style={{ color:"var(--text3)", flexShrink:0 }} />
            <input placeholder="Search products…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)", display:"flex" }}>
                <X size={13} />
              </button>
            )}
          </div>
          <select className="filter-select" value={catFilter} onChange={e => { setCat(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="view-toggle">
            <button className={`view-btn${view==="grid"?" active":""}`} onClick={() => setView("grid")}>⊞</button>
            <button className={`view-btn${view==="table"?" active":""}`} onClick={() => setView("table")}>☰</button>
          </div>
          <button className="btn btn-primary btn-md" onClick={openAdd}>
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:60, color:"var(--text3)" }}>
          <Loader2 size={24} className="loader-spin" />
        </div>
      ) : view === "grid" ? (
        <>
          <div className="prod-grid">
            {products.map(p => (
              <div key={p._id} className="prod-card">
                <img src={p.thumbnail || "https://picsum.photos/400/400?random=99"} alt={p.name} className="prod-card-img" />
                <div className="prod-card-body">
                  <p className="prod-card-tag">{p.metal?.purity} {p.category}</p>
                  <p className="prod-card-name">{p.name}</p>
                  <p className="prod-card-price">{fmt(p.price?.current)}</p>
                  <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                    {p.isBestSeller && <Badge variant="amber">Bestseller</Badge>}
                    {p.isNewArrival && <Badge variant="green">New</Badge>}
                    <span style={{ fontSize:11, color:p.inventory?.inStock?"var(--green)":"var(--red)" }}>
                      <span className={`stock-dot ${p.inventory?.inStock?"stock-in":"stock-out"}`}/>
                      {p.inventory?.inStock ? `${p.inventory?.quantity} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <div className="prod-card-actions">
                    <button className="prod-card-btn" onClick={() => openEdit(p)}><Edit2 size={12}/> Edit</button>
                    <button className="prod-card-btn danger" onClick={() => remove(p)}><Trash2 size={12}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20 }}>
            <Pagination page={page} pages={Math.ceil(total/LIMIT)} total={total} limit={LIMIT} onPage={setPage} />
          </div>
        </>
      ) : (
        <div className="card">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>Product</th><th>SKU</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Flags</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <img src={p.thumbnail} alt="" className="tbl-img" />
                        <div>
                          <p className="tbl-name">{p.name}</p>
                          <p className="tbl-sub">{p.metal?.purity} {p.metal?.type}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily:"monospace", fontSize:12 }}>{p.sku}</td>
                    <td><Badge variant="gray">{p.category}</Badge></td>
                    <td style={{ fontWeight:500 }}>{fmt(p.price?.current)}</td>
                    <td>
                      <span style={{ fontSize:12, color:p.inventory?.inStock?"var(--green)":"var(--red)" }}>
                        <span className={`stock-dot ${p.inventory?.inStock?"stock-in":"stock-out"}`}/>
                        {p.inventory?.quantity}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:4 }}>
                        {p.isBestSeller && <Badge variant="amber">BS</Badge>}
                        {p.isNewArrival && <Badge variant="green">New</Badge>}
                        {p.isFeatured   && <Badge variant="blue">Feat</Badge>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit2 size={12}/></button>
                        <button className="btn btn-danger btn-sm"  onClick={() => remove(p)}><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"0 16px" }}>
            <Pagination page={page} pages={Math.ceil(total/LIMIT)} total={total} limit={LIMIT} onPage={setPage} />
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modal==="add"||modal==="edit"}
        onClose={() => setModal(null)}
        title={modal==="add" ? "Add <em>Product</em>" : "Edit <em>Product</em>"}
        width={700}
        footer={<>
          <button className="btn btn-outline btn-md" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-primary btn-md" onClick={save} disabled={saving}>
            {saving ? <><Loader2 size={13} className="loader-spin"/> Saving…</> : "Save Product"}
          </button>
        </>}
      >
        {err && (
          <div style={{ background:"var(--red-bg)", color:"var(--red)", padding:"10px 14px", borderRadius:"var(--radius)", marginBottom:16, fontSize:12.5 }}>
            ⚠ {err}
          </div>
        )}

        {/* Basic Info */}
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={setF("name")} placeholder="Timeless Gold Ring" />
          </div>
          <div className="form-field">
            <label className="form-label">SKU</label>
            <input className="form-input" value={form.sku} onChange={setF("sku")} placeholder="MAN-RNG-001" />
          </div>
        </div>

        <div className="form-grid full">
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={setF("description")} rows={3} />
          </div>
        </div>

        {/* Images */}
        <div className="form-field" style={{ marginBottom:16 }}>
          <label className="form-label" style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <Image size={12} /> Product Images
          </label>
          <ImageUploader
            thumbnail={form.thumbnail}
            images={form.images || []}
            onThumbChange={url => setForm(p => ({ ...p, thumbnail: url }))}
            onImagesChange={imgs => setForm(p => ({ ...p, images: imgs }))}
          />
        </div>

        {/* Category & Metal */}
        <div className="form-grid three">
          <div className="form-field">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={setF("category")}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Metal Type</label>
            <select className="form-select" value={form["metal.type"]} onChange={setF("metal.type")}>
              {METAL_TYPES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Purity</label>
            <select className="form-select" value={form["metal.purity"]} onChange={setF("metal.purity")}>
              {PURITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-grid three">
          <div className="form-field">
            <label className="form-label">Current Price (₹) *</label>
            <input className="form-input" type="number" value={form["price.current"]} onChange={setF("price.current")} placeholder="52697" />
          </div>
          <div className="form-field">
            <label className="form-label">Original Price (₹)</label>
            <input className="form-input" type="number" value={form["price.original"]} onChange={setF("price.original")} placeholder="58000" />
          </div>
          <div className="form-field">
            <label className="form-label">Metal Weight (g)</label>
            <input className="form-input" type="number" value={form["metal.weight"]} onChange={setF("metal.weight")} placeholder="5.2" />
          </div>
        </div>

        {/* Inventory */}
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Stock Quantity</label>
            <input className="form-input" type="number" value={form["inventory.quantity"]} onChange={setF("inventory.quantity")} />
          </div>
          <div className="form-field">
            <label className="form-label">Making Charges (₹)</label>
            <input className="form-input" type="number" value={form.makingCharges} onChange={setF("makingCharges")} placeholder="2500" />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:4 }}>
          <Toggle value={form.isBestSeller}          onChange={setB("isBestSeller")}          label="Bestseller"    />
          <Toggle value={form.isNewArrival}          onChange={setB("isNewArrival")}          label="New Arrival"   />
          <Toggle value={form.isFeatured}            onChange={setB("isFeatured")}            label="Featured"      />
          <Toggle value={form.isWedding}             onChange={setB("isWedding")}             label="Bridal/Wedding"/>
          <Toggle value={form["inventory.inStock"]}  onChange={setB("inventory.inStock")}     label="In Stock"      />
        </div>
      </Modal>
    </>
  );
}