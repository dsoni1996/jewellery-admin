"use client";
import { useState } from "react";
import { Plus, Tag, Edit2, Trash2, Loader2 } from "lucide-react";
import { Badge, Modal, Toggle } from "../../../components/common";

const initCoupons = [
  { id:1, code:"MANAS5",   desc:"5% off on all orders",         type:"percent", value:5,    min:10000, max:5000,  used:34, limit:null,  until:"2026-12-31", active:true  },
  { id:2, code:"BRIDAL10", desc:"10% off bridal orders",        type:"percent", value:10,   min:100000,max:20000, used:12, limit:50,    until:"2026-12-31", active:true  },
  { id:3, code:"FLAT2000", desc:"Flat ₹2000 off",               type:"flat",    value:2000, min:25000, max:null,  used:8,  limit:100,   until:"2026-12-31", active:true  },
  { id:4, code:"NEWYEAR",  desc:"New year 15% off",             type:"percent", value:15,   min:50000, max:10000, used:67, limit:200,   until:"2025-01-31", active:false },
];

const emptyForm = () => ({ code:"", desc:"", type:"percent", value:"", min:"", max:"", limit:"", until:"", active:true });

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(initCoupons);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(emptyForm());

  const set  = k => e => setForm(p => ({ ...p, [k]: e.target?.value ?? e }));
  const setB = k => v => setForm(p => ({ ...p, [k]: v }));

  const openAdd  = () => { setForm(emptyForm()); setEditing(null); setModal(true); };
  const openEdit = c  => { setForm({ ...c, value: String(c.value), min: String(c.min), max: c.max ? String(c.max) : "", limit: c.limit ? String(c.limit) : "" }); setEditing(c); setModal(true); };
  const remove   = id => { if (confirm("Delete this coupon?")) setCoupons(p => p.filter(c => c.id !== id)); };

  const save = () => {
    const entry = { ...form, id: editing?.id || Date.now(), value: Number(form.value), min: Number(form.min), max: form.max ? Number(form.max) : null, limit: form.limit ? Number(form.limit) : null, used: editing?.used || 0 };
    setCoupons(p => editing ? p.map(c => c.id === editing.id ? entry : c) : [...p, entry]);
    setModal(false);
  };

  const fmt = n => n ? "₹ " + Number(n).toLocaleString("en-IN") : "—";
  const isExpired = d => new Date(d) < new Date();

  return (
    <>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button className="btn btn-primary btn-md" onClick={openAdd}><Plus size={14} /> Create Coupon</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>Code</th><th>Description</th><th>Discount</th>
              <th>Min. Order</th><th>Usage</th><th>Valid Until</th>
              <th>Status</th><th></th>
            </tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Tag size={13} style={{ color:"var(--gold)" }} />
                      <span style={{ fontFamily:"monospace", fontWeight:600, fontSize:13 }}>{c.code}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:13, color:"var(--text2)" }}>{c.desc}</td>
                  <td style={{ fontWeight:500, fontSize:13 }}>
                    {c.type === "percent" ? `${c.value}%` : fmt(c.value)}
                    {c.max && <span style={{ fontSize:11, color:"var(--text3)", display:"block" }}>max {fmt(c.max)}</span>}
                  </td>
                  <td style={{ fontSize:13 }}>{fmt(c.min)}</td>
                  <td style={{ fontSize:13 }}>
                    {c.used}{c.limit ? ` / ${c.limit}` : ""}
                    {c.limit && <div style={{ marginTop:4, height:4, background:"var(--bg)", borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${(c.used/c.limit)*100}%`, background:"var(--gold)", borderRadius:2 }} /></div>}
                  </td>
                  <td>
                    <span style={{ fontSize:12, color: isExpired(c.until) ? "var(--red)" : "var(--text3)" }}>
                      {new Date(c.until).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                    </span>
                  </td>
                  <td>
                    <Badge variant={c.active && !isExpired(c.until) ? "green" : "gray"}>
                      {isExpired(c.until) ? "Expired" : c.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}><Edit2 size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit <em>Coupon</em>" : "Create <em>Coupon</em>"} width={520}
        footer={<>
          <button className="btn btn-outline btn-md" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-md" onClick={save}>Save Coupon</button>
        </>}
      >
        <div className="form-grid">
          <div className="form-field"><label className="form-label">Coupon Code *</label>
            <input className="form-input" value={form.code} onChange={set("code")} placeholder="MANAS10" style={{ textTransform:"uppercase" }} /></div>
          <div className="form-field"><label className="form-label">Discount Type</label>
            <select className="form-select" value={form.type} onChange={set("type")}>
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select></div>
        </div>
        <div className="form-grid full">
          <div className="form-field"><label className="form-label">Description</label>
            <input className="form-input" value={form.desc} onChange={set("desc")} placeholder="5% off on all orders" /></div>
        </div>
        <div className="form-grid three">
          <div className="form-field"><label className="form-label">Discount Value *</label>
            <input className="form-input" type="number" value={form.value} onChange={set("value")} placeholder={form.type === "percent" ? "10" : "2000"} /></div>
          <div className="form-field"><label className="form-label">Min. Order (₹)</label>
            <input className="form-input" type="number" value={form.min} onChange={set("min")} placeholder="10000" /></div>
          <div className="form-field"><label className="form-label">Max Discount (₹)</label>
            <input className="form-input" type="number" value={form.max} onChange={set("max")} placeholder="5000 (optional)" /></div>
        </div>
        <div className="form-grid">
          <div className="form-field"><label className="form-label">Usage Limit</label>
            <input className="form-input" type="number" value={form.limit} onChange={set("limit")} placeholder="100 (leave blank = unlimited)" /></div>
          <div className="form-field"><label className="form-label">Valid Until *</label>
            <input className="form-input" type="date" value={form.until} onChange={set("until")} /></div>
        </div>
        <Toggle value={form.active} onChange={setB("active")} label="Coupon is active" />
      </Modal>
    </>
  );
}
