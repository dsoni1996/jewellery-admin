"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, Image, Plus  } from "lucide-react";


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

export const ImageUploader = ({ value, onChange, aspect = "16/7", placeholder = "No image" }) => {
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
    <>
    
    
    <style>{S}</style>
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
    </>
  );
}