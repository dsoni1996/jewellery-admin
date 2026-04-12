"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, X, Eye, ChevronDown, Loader2, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge, Modal, Pagination } from "../../../components/common";
import { api } from "../../../lib/api";

const STATUS_OPTIONS = ["all","confirmed","processing","packed","shipped","out_for_delivery","delivered","cancelled"];
const STATUS_VARIANT = { confirmed:"amber", processing:"blue", packed:"blue", shipped:"blue", out_for_delivery:"blue", delivered:"green", cancelled:"red", returned:"red" };
const STATUS_ICONS   = { confirmed: Clock, processing: Package, packed: Package, shipped: Truck, delivered: CheckCircle, cancelled: XCircle };

const S = `
.ord-summary { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:20px; }
@media(max-width:900px){ .ord-summary { grid-template-columns:repeat(3,1fr); } }
.ord-sum-card { background:var(--white); border:1px solid var(--border); border-radius:var(--radius); padding:14px 16px; text-align:center; cursor:pointer; transition:border-color .2s; }
.ord-sum-card:hover,.ord-sum-card.active { border-color:var(--gold); }
.ord-sum-card.active { background:var(--gold-pale); }
.ord-sum-num { font-family:var(--font-serif); font-size:28px; font-weight:400; color:var(--dark); }
.ord-sum-label { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--text3); margin-top:2px; }
.order-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.order-detail-box { background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); padding:14px 16px; }
.order-detail-box-title { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text3); margin-bottom:10px; }
.order-detail-row { display:flex; justify-content:space-between; font-size:13px; color:var(--text2); padding:4px 0; }
.order-detail-row strong { color:var(--dark); font-weight:500; }
.order-item-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #F5EDE3; }
.order-item-row:last-child { border-bottom:none; }
.order-tracking { display:flex; flex-direction:column; gap:0; }
.track-row { display:flex; gap:14px; align-items:flex-start; }
.track-dot-wrap { display:flex; flex-direction:column; align-items:center; }
.track-dot { width:12px; height:12px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:3px; }
.track-dot.done { background:var(--gold); }
.track-dot.pending { background:var(--border); }
.track-line { width:1px; height:24px; background:var(--border); }
.track-info { padding-bottom:20px; }
.track-status { font-size:12.5px; font-weight:500; color:var(--dark); text-transform:capitalize; }
.track-msg { font-size:11.5px; color:var(--text3); margin-top:1px; }
.track-time { font-size:10.5px; color:var(--text3); margin-top:1px; }
.status-form { display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; margin-top:16px; }
`;

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatus] = useState("all");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [updating, setUpdating] = useState(false);
  const LIMIT = 15;

  const summaryData = [
    { label: "Confirmed",  status: "confirmed",  num: 12 },
    { label: "Processing", status: "processing", num: 8  },
    { label: "Shipped",    status: "shipped",    num: 15 },
    { label: "Delivered",  status: "delivered",  num: 142},
    { label: "Cancelled",  status: "cancelled",  num: 10 },
  ];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (statusFilter !== "all") params.status = statusFilter;
      const { orders: o, total: t } = await api.orders.getAll(params);
      setOrders(o); setTotal(t);
    } catch { } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async () => {
    if (!newStatus || !selected) return;
    setUpdating(true);
    try {
      await api.orders.updateStatus(selected._id, { status: newStatus, message: statusMsg });
      setSelected(null); load();
    } catch (e) { alert(e.message); } finally { setUpdating(false); }
  };

  const fmt = n => "₹ " + n.toLocaleString("en-IN");
  const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <style>{S}</style>

      {/* Summary cards */}
      <div className="ord-summary">
        {summaryData.map(s => (
          <div key={s.status} className={`ord-sum-card${statusFilter === s.status ? " active" : ""}`}
            onClick={() => { setStatus(s.status); setPage(1); }}>
            <p className="ord-sum-num">{s.num}</p>
            <p className="ord-sum-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="filter-bar">
          <div className="filter-search" style={{ flex: 2 }}>
            <Search size={13} style={{ color: "var(--text3)", flexShrink: 0 }} />
            <input placeholder="Search order number or customer…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><X size={13} /></button>}
          </div>
          <select className="filter-select" value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60, color: "var(--text3)" }}>
            <Loader2 size={22} className="loader-spin" />
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>Order #</th><th>Customer</th><th>Date</th>
                <th>Items</th><th>Amount</th><th>Payment</th>
                <th>Status</th><th></th>
              </tr></thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>No orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o._id}>
                    <td><span className="tbl-name" style={{ fontSize: 12, fontFamily: "monospace" }}>{o.orderNumber}</span></td>
                    <td>
                      <p className="tbl-name">{o.user?.firstName} {o.user?.lastName}</p>
                      <p className="tbl-sub">{o.user?.phone}</p>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{fmtDate(o.createdAt)}</td>
                    <td style={{ fontSize: 13 }}>{o.items?.length} item{o.items?.length !== 1 ? "s" : ""}</td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{fmt(o.pricing?.total)}</td>
                    <td><Badge variant={o.payment?.status === "paid" ? "green" : "amber"}>{o.payment?.method}</Badge></td>
                    <td><Badge variant={STATUS_VARIANT[o.status] || "gray"}>{o.status}</Badge></td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(o); setNewStatus(o.status); setStatusMsg(""); }}>
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: "0 16px" }}>
          <Pagination page={page} pages={Math.ceil(total / LIMIT)} total={total} limit={LIMIT} onPage={setPage} />
        </div>
      </div>

      {/* Order detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}
        title={`Order <em>${selected?.orderNumber}</em>`} width={680}
        footer={<>
          <button className="btn btn-outline btn-md" onClick={() => setSelected(null)}>Close</button>
          <button className="btn btn-primary btn-md" onClick={updateStatus} disabled={updating || !newStatus}>
            {updating ? <><Loader2 size={13} className="loader-spin" /> Updating…</> : "Update Status"}
          </button>
        </>}
      >
        {selected && (
          <>
            {/* Info grid */}
            <div className="order-detail-grid">
              <div className="order-detail-box">
                <p className="order-detail-box-title">Customer</p>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>{selected.user?.firstName} {selected.user?.lastName}</p>
                <p style={{ fontSize: 12, color: "var(--text3)" }}>{selected.user?.phone}</p>
              </div>
              <div className="order-detail-box">
                <p className="order-detail-box-title">Delivery Address</p>
                <p style={{ fontSize: 12.5, color: "var(--text2)", lineHeight: 1.6 }}>
                  {selected.shippingAddress?.fullName}<br />
                  {selected.shippingAddress?.line1}, {selected.shippingAddress?.city}<br />
                  {selected.shippingAddress?.state} – {selected.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="order-detail-box" style={{ marginBottom: 16 }}>
              <p className="order-detail-box-title">Items Ordered</p>
              {selected.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 3, background: "var(--bg)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ fontSize: 11.5, color: "var(--text3)" }}>
                      Qty: {item.qty} {item.size ? `· Size: ${item.size}` : ""}
                    </p>
                  </div>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>₹ {(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="order-detail-grid">
              <div className="order-detail-box">
                <p className="order-detail-box-title">Price Breakdown</p>
                {[
                  ["Subtotal", `₹ ${selected.pricing?.subtotal?.toLocaleString("en-IN")}`],
                  ["Discount", selected.pricing?.discount ? `−₹ ${selected.pricing.discount.toLocaleString("en-IN")}` : "—"],
                  ["GST (3%)", `₹ ${selected.pricing?.gst?.toLocaleString("en-IN")}`],
                  ["Total", `₹ ${selected.pricing?.total?.toLocaleString("en-IN")}`],
                ].map(([l, v]) => (
                  <div key={l} className="order-detail-row">
                    <span>{l}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div className="order-detail-box">
                <p className="order-detail-box-title">Tracking</p>
                <div className="order-tracking">
                  {selected.tracking?.slice().reverse().slice(0, 3).map((t, i) => (
                    <div key={i} className="track-row">
                      <div className="track-dot-wrap">
                        <div className={`track-dot ${i === 0 ? "done" : "pending"}`} />
                        {i < 2 && <div className="track-line" />}
                      </div>
                      <div className="track-info">
                        <p className="track-status">{t.status}</p>
                        <p className="track-msg">{t.message}</p>
                        <p className="track-time">{new Date(t.timestamp).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Update status */}
            <div style={{ background: "var(--bg)", borderRadius: "var(--radius)", padding: "16px", marginTop: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "var(--text3)", marginBottom: 10 }}>Update Status</p>
              <div className="status-form">
                <div className="form-field" style={{ flex: 1 }}>
                  <label className="form-label">New Status</label>
                  <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    {STATUS_OPTIONS.filter(s => s !== "all").map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field" style={{ flex: 2 }}>
                  <label className="form-label">Message (optional)</label>
                  <input className="form-input" value={statusMsg} onChange={e => setStatusMsg(e.target.value)} placeholder="Order dispatched via Blue Dart" />
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
