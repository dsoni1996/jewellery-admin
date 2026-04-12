"use client";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const S = `
/* ── Stat Card ── */
.stat-card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius); padding:20px 22px; position:relative; overflow:hidden; }
.stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--accent-color,var(--gold)); }
.stat-card-label { font-size:10px; font-weight:500; letter-spacing:2px; text-transform:uppercase; color:var(--text3); margin-bottom:10px; }
.stat-card-value { font-family:var(--font-serif); font-size:32px; font-weight:400; color:var(--dark); margin-bottom:4px; line-height:1; }
.stat-card-sub { font-size:11.5px; color:var(--text2); display:flex; align-items:center; gap:5px; }
.stat-card-icon { position:absolute; top:18px; right:18px; width:38px; height:38px; border-radius:50%; background:var(--accent-bg,var(--gold-pale)); display:flex; align-items:center; justify-content:center; color:var(--accent-color,var(--gold)); }
.stat-card-trend-up { color:var(--green); font-weight:500; }
.stat-card-trend-down { color:var(--red); font-weight:500; }

/* ── Badge ── */
.badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:2px; font-size:10.5px; font-weight:500; letter-spacing:0.3px; white-space:nowrap; }
.badge-green   { background:var(--green-bg);  color:var(--green); }
.badge-red     { background:var(--red-bg);    color:var(--red); }
.badge-amber   { background:var(--amber-bg);  color:var(--amber); }
.badge-blue    { background:var(--blue-bg);   color:var(--blue); }
.badge-gray    { background:#F0E8DC;          color:var(--brown); }
.badge-dark    { background:var(--dark);      color:var(--gold-light); }

/* ── Table ── */
.tbl-wrap { overflow-x:auto; }
.tbl { width:100%; border-collapse:collapse; font-size:13px; }
.tbl thead tr { border-bottom:2px solid var(--border); }
.tbl th { padding:11px 14px; text-align:left; font-size:10px; font-weight:600; letter-spacing:1.8px; text-transform:uppercase; color:var(--text3); white-space:nowrap; }
.tbl td { padding:13px 14px; border-bottom:1px solid #F5EDE3; color:var(--text); vertical-align:middle; }
.tbl tbody tr:last-child td { border-bottom:none; }
.tbl tbody tr:hover td { background:#FBF9F5; }
.tbl-img { width:44px; height:44px; object-fit:cover; border-radius:3px; background:var(--bg); display:block; }
.tbl-name { font-weight:500; color:var(--dark); }
.tbl-sub  { font-size:11.5px; color:var(--text3); margin-top:1px; }

/* ── Pagination ── */
.pg { display:flex; align-items:center; justify-content:space-between; padding:14px 0 4px; }
.pg-info { font-size:12px; color:var(--text3); }
.pg-btns { display:flex; gap:6px; }
.pg-btn { background:var(--white); border:1px solid var(--border); border-radius:var(--radius); width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; color:var(--text2); transition:all 0.15s; }
.pg-btn:hover:not(:disabled) { border-color:var(--gold); color:var(--gold); }
.pg-btn:disabled { opacity:0.4; cursor:not-allowed; }
.pg-btn.active { background:var(--dark); border-color:var(--dark); color:var(--gold-light); }

/* ── Modal ── */
.modal-overlay { position:fixed; inset:0; background:rgba(20,10,5,0.55); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(3px); animation:modal-fade 0.2s ease; }
@keyframes modal-fade { from{opacity:0} to{opacity:1} }
.modal { background:var(--white); border-radius:var(--radius); width:100%; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(20,10,5,0.25); animation:modal-up 0.25s ease; }
@keyframes modal-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.modal-head { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--white); z-index:1; }
.modal-title { font-family:var(--font-serif); font-size:22px; font-weight:400; color:var(--dark); }
.modal-title em { font-style:italic; color:var(--gold); }
.modal-close { background:none; border:none; cursor:pointer; color:var(--text3); transition:color 0.2s; padding:4px; display:flex; }
.modal-close:hover { color:var(--dark); }
.modal-body { padding:22px 24px; }
.modal-foot { padding:14px 24px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }

/* ── Form elements ── */
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.form-grid.full { grid-template-columns:1fr; }
.form-grid.three { grid-template-columns:1fr 1fr 1fr; }
.form-field { display:flex; flex-direction:column; gap:5px; }
.form-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--text3); }
.form-input, .form-select, .form-textarea { border:1px solid var(--border); padding:9px 12px; font-size:13px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); transition:border-color 0.2s; background:var(--white); width:100%; }
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color:var(--gold); }
.form-textarea { resize:vertical; min-height:80px; }
.form-toggle { display:flex; align-items:center; gap:10px; cursor:pointer; }
.form-toggle-track { width:38px; height:20px; background:var(--border); border-radius:10px; position:relative; transition:background 0.2s; flex-shrink:0; }
.form-toggle-track.on { background:var(--gold); }
.form-toggle-thumb { width:14px; height:14px; background:var(--white); border-radius:50%; position:absolute; top:3px; left:3px; transition:left 0.2s; }
.form-toggle-track.on .form-toggle-thumb { left:21px; }
.form-toggle-label { font-size:12.5px; color:var(--text2); }

/* ── Buttons ── */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; border:none; cursor:pointer; font-family:var(--font-sans); font-weight:500; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; border-radius:var(--radius); transition:all 0.2s; white-space:nowrap; }
.btn-sm { padding:7px 14px; }
.btn-md { padding:10px 20px; }
.btn-lg { padding:13px 28px; }
.btn-primary { background:var(--dark); color:var(--gold-light); }
.btn-primary:hover { background:var(--brown); }
.btn-gold { background:var(--gold); color:var(--white); }
.btn-gold:hover { background:var(--gold-light); color:var(--dark); }
.btn-outline { background:transparent; border:1px solid var(--border); color:var(--text2); }
.btn-outline:hover { border-color:var(--gold); color:var(--gold); }
.btn-danger { background:var(--red-bg); color:var(--red); border:1px solid rgba(153,60,29,0.2); }
.btn-danger:hover { background:var(--red); color:var(--white); }
.btn:disabled { opacity:0.5; cursor:not-allowed; }

/* ── Card ── */
.card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius); }
.card-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); flex-wrap:wrap; gap:10px; }
.card-title { font-family:var(--font-serif); font-size:18px; font-weight:400; color:var(--dark); }
.card-title em { font-style:italic; color:var(--gold); }
.card-body { padding:20px; }

/* ── Loader ── */
.loader-spin { animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* ── Filter bar ── */
.filter-bar { display:flex; align-items:center; gap:10px; padding:14px 20px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
.filter-search { display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--border); padding:7px 12px; border-radius:var(--radius); flex:1; min-width:180px; }
.filter-search input { border:none; background:transparent; outline:none; font-size:12.5px; color:var(--text); font-family:var(--font-sans); width:100%; }
.filter-select { border:1px solid var(--border); padding:7px 12px; font-size:12.5px; color:var(--text); font-family:var(--font-sans); outline:none; border-radius:var(--radius); background:var(--white); cursor:pointer; }
.filter-select:focus { border-color:var(--gold); }
`;

/* ── StatCard ── */
export function StatCard({ label, value, sub, trend, icon: Icon, color = "var(--gold)", colorBg = "var(--gold-pale)" }) {
  const isUp = trend > 0;
  return (
    <>
      <style>{S}</style>
      <div className="stat-card" style={{ "--accent-color": color, "--accent-bg": colorBg }}>
        {Icon && <div className="stat-card-icon"><Icon size={16} /></div>}
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {sub !== undefined && (
          <p className="stat-card-sub">
            {trend !== undefined && (
              <span className={isUp ? "stat-card-trend-up" : "stat-card-trend-down"}>
                {isUp ? "▲" : "▼"} {Math.abs(trend)}%
              </span>
            )}
            {sub}
          </p>
        )}
      </div>
    </>
  );
}

/* ── Badge ── */
export function Badge({ children, variant = "gray" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, footer, width = 560 }) {
  if (!open) return null;
  return (
    <>
      <style>{S}</style>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ maxWidth: width }}>
          <div className="modal-head">
            <span className="modal-title" dangerouslySetInnerHTML={{ __html: title }} />
            <button className="modal-close" onClick={onClose}><X size={18} /></button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-foot">{footer}</div>}
        </div>
      </div>
    </>
  );
}

/* ── Pagination ── */
export function Pagination({ page, pages, total, limit, onPage }) {
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);
  return (
    <>
      <style>{S}</style>
      <div className="pg">
        <span className="pg-info">Showing {from}–{to} of {total}</span>
        <div className="pg-btns">
          <button className="pg-btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
            const p = page <= 3 ? i + 1 : page - 2 + i;
            if (p < 1 || p > pages) return null;
            return (
              <button key={p} className={`pg-btn${p === page ? " active" : ""}`} onClick={() => onPage(p)}>{p}</button>
            );
          })}
          <button className="pg-btn" onClick={() => onPage(page + 1)} disabled={page >= pages}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Toggle ── */
export function Toggle({ value, onChange, label }) {
  return (
    <>
      <style>{S}</style>
      <label className="form-toggle">
        <div className={`form-toggle-track${value ? " on" : ""}`} onClick={() => onChange(!value)}>
          <div className="form-toggle-thumb" />
        </div>
        {label && <span className="form-toggle-label">{label}</span>}
      </label>
    </>
  );
}

export { S as commonStyles };
