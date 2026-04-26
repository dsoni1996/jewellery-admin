"use client";
import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  HelpCircle,
  MapPin,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { Badge, Modal } from "../../../components/common";
import { api } from "../../../lib/api"; // Aapke api.js ke hisaab se

const S = `
/* Tabs */
.admin-tabs { display:flex; gap:32px; border-bottom:1px solid var(--border); margin-bottom:24px; padding:0 8px; }
.admin-tab { padding:12px 4px; font-size:13px; font-weight:500; color:var(--text3); border-bottom:2px solid transparent; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all .2s; }
.admin-tab:hover { color:var(--dark); }
.admin-tab.active { color:var(--gold); border-bottom-color:var(--gold); }

/* Alert Strip Reused */
.alert-strip { background:linear-gradient(90deg,var(--dark) 0%,#3A2818 100%); border-radius:var(--radius); padding:16px 22px; display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.alert-strip p { color:var(--gold-light, #E8D3A2); font-size:13px; }
.alert-strip span { color:rgba(255,255,255,.45); font-size:12px; }

/* Filter & Action Bar */
.filter-bar { display:flex; align-items:center; justify-content:space-between; padding:16px; background:var(--white); border-bottom:1px solid var(--border); gap:16px; flex-wrap:wrap; }
.search-box { display:flex; align-items:center; gap:8px; background:var(--bg); border:1px solid var(--border); padding:8px 12px; border-radius:var(--radius); flex:1; min-width:250px; max-width:400px; }
.search-box input { border:none; background:transparent; font-size:13px; outline:none; width:100%; color:var(--dark); }

/* Enq Detail Modal */
.enq-detail-box { background:var(--bg); padding:16px; border-radius:var(--radius); margin-bottom:16px; border:1px solid var(--border); }
.enq-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:var(--text3); margin-bottom:4px; }
.enq-value { font-size:14px; color:var(--dark); margin-bottom:16px; line-height:1.5; }
.enq-value:last-child { margin-bottom:0; }

/* Form Fields for Modal */
.frm-grid { display:grid; gap:16px; }
.frm-field { display:flex; flex-direction:column; gap:6px; }
.frm-input, .frm-textarea { padding:10px 12px; border:1px solid var(--border); border-radius:var(--radius); font-size:13px; outline:none; font-family:inherit; }
.frm-input:focus, .frm-textarea:focus { border-color:var(--gold); }
.frm-textarea { min-height:100px; resize:vertical; }

/* ===== TABLE SAME AS ORDERS ===== */
.tbl-wrap { overflow-x: auto; }

.tbl {
  width: 100%;
  border-collapse: collapse;
}

.tbl thead th {
  text-align: left;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text3);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.tbl tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #F5EDE3;
  font-size: 13px;
  color: var(--dark);
  vertical-align: middle;
}

.tbl tbody tr:hover {
  background: var(--bg);
}

.tbl-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--dark);
  margin-bottom: 2px;
}

.tbl-sub {
  font-size: 11.5px;
  color: var(--text3);
}

/* Button fix (same as orders) */
.btn-sm {
  padding: 6px 10px;
  font-size: 12px;
}

/* Badge alignment */
.tbl td .badge {
  font-size: 11px;
  padding: 4px 8px;
}
`;

export default function ContactManagementPage() {
  const [tab, setTab] = useState("enquiries"); // 'enquiries' | 'faqs' | 'stores'
  const [loading, setLoading] = useState(true);

  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stores, setStores] = useState([]);

  // Modals state
  const [viewEnq, setViewEnq] = useState(null);
  const [editFaq, setEditFaq] = useState(null); // null = closed, {} = new, {...} = edit
  const [editStore, setEditStore] = useState(null);

  // Load Data based on Active Tab
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "enquiries") {
        const res = await api.contactApi.getAll();
        setEnquiries(res.data || []); // Adjust based on actual API response structure
      } else if (tab === "faqs") {
        const res = await api.contactApi.getFaqs();
        setFaqs(res.faqs || []);
      } else if (tab === "stores") {
        const res = await api.contactApi.getStores();
        setStores(res.stores || []);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── API Actions ── */
  const handleUpdateEnqStatus = async (id, status) => {
    try {
      await api.contactApi.updateStatus(id, status);
      setViewEnq(null);
      loadData();
    } catch (e) {
      alert("Error updating status");
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editFaq._id) await api.contactApi.updateFaq(editFaq._id, editFaq);
      else await api.contactApi.createFaq(editFaq);
      setEditFaq(null);
      loadData();
    } catch (err) {
      alert("Error saving FAQ");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await api.contactApi.deleteFaq(id);
      loadData();
    } catch (err) {
      alert("Error deleting FAQ");
    }
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    try {
      if (editStore._id)
        await api.contactApi.updateStore(editStore._id, editStore);
      else await api.contactApi.createStore(editStore);
      setEditStore(null);
      loadData();
    } catch (err) {
      alert("Error saving Store");
    }
  };

  const handleDeleteStore = async (id) => {
    if (!confirm("Are you sure you want to delete this Store?")) return;
    try {
      await api.contactApi.deleteStore(id);
      loadData();
    } catch (err) {
      alert("Error deleting Store");
    }
  };

  return (
    <>
      <style>{S}</style>

      <div className="alert-strip">
        <div>
          <p>
            Support & Contact <strong>Management</strong>
          </p>
          <span>
            Manage user enquiries, FAQs, and physical store locations here.
          </span>
        </div>
        <MessageSquare size={24} style={{ color: "rgba(212,175,106,.35)" }} />
      </div>

      <div className="admin-tabs">
        <div
          className={`admin-tab ${tab === "enquiries" ? "active" : ""}`}
          onClick={() => setTab("enquiries")}
        >
          <MessageSquare size={16} /> Submissions
        </div>
        <div
          className={`admin-tab ${tab === "faqs" ? "active" : ""}`}
          onClick={() => setTab("faqs")}
        >
          <HelpCircle size={16} /> Manage FAQs
        </div>
        <div
          className={`admin-tab ${tab === "stores" ? "active" : ""}`}
          onClick={() => setTab("stores")}
        >
          <MapPin size={16} /> Manage Stores
        </div>
      </div>

      <div className="card">
        {/* ── Dynamic Toolbar ── */}
        <div className="filter-bar">
          <div className="search-box">
            <Search size={14} color="var(--text3)" />
            <input placeholder={`Search ${tab}...`} />
          </div>
          {tab === "faqs" && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setEditFaq({ question: "", answer: "" })}
            >
              <Plus size={14} /> Add FAQ
            </button>
          )}
          {tab === "stores" && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setEditStore({
                  city: "",
                  address: "",
                  phone: "",
                  hours: "",
                  mapEmbedUrl: "",
                })
              }
            >
              <Plus size={14} /> Add Store
            </button>
          )}
        </div>

        {/* ── Content Area ── */}
        <div className="tbl-wrap">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 60,
                color: "var(--text3)",
              }}
            >
              <Loader2 size={24} className="loader-spin" />
            </div>
          ) : tab === "enquiries" ? (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th width="80"></th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>
                      {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <p className="tbl-name">{enq.name}</p>
                      <p className="tbl-sub">
                        {enq.email} • {enq.phone}
                      </p>
                    </td>
                    <td style={{ fontSize: 13 }}>{enq.subject}</td>
                    <td>
                      <Badge
                        variant={
                          enq.status === "resolved"
                            ? "green"
                            : enq.status === "in_progress"
                              ? "amber"
                              : "gray"
                        }
                      >
                        {enq.status || "New"}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setViewEnq(enq)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "var(--text3)",
                      }}
                    >
                      No enquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : tab === "faqs" ? (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th width="100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq._id}>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>
                      {faq.question}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>
                      {faq.answer.substring(0, 80)}...
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditFaq(faq)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{
                            color: "var(--red)",
                            borderColor: "#fce8e8",
                          }}
                          onClick={() => handleDeleteFaq(faq._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Store City</th>
                  <th>Address & Contact</th>
                  <th>Timing</th>
                  <th width="100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store._id}>
                    <td className="tbl-name">MANAS {store.city}</td>
                    <td>
                      <p style={{ fontSize: 12, color: "var(--text2)" }}>
                        {store.address}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--text3)",
                          marginTop: 4,
                        }}
                      >
                        {store.phone}
                      </p>
                    </td>
                    <td style={{ fontSize: 12 }}>{store.hours}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setEditStore(store)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{
                            color: "var(--red)",
                            borderColor: "#fce8e8",
                          }}
                          onClick={() => handleDeleteStore(store._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal: View Enquiry ── */}
      <Modal
        open={!!viewEnq}
        onClose={() => setViewEnq(null)}
        title="Enquiry Details"
        width={550}
      >
        {viewEnq && (
          <div>
            <div className="enq-detail-box">
              <p className="enq-label">Customer Details</p>
              <p className="enq-value" style={{ fontWeight: 500 }}>
                {viewEnq.name} <br />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text3)",
                    fontWeight: 400,
                  }}
                >
                  {viewEnq.email} | {viewEnq.phone}
                </span>
              </p>

              <p className="enq-label">Subject</p>
              <p className="enq-value">{viewEnq.subject}</p>

              <p className="enq-label">Message</p>
              <p
                className="enq-value"
                style={{
                  fontFamily: "serif",
                  fontStyle: "italic",
                  color: "var(--text2)",
                }}
              >
                "{viewEnq.message}"
              </p>
            </div>

            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                className="btn btn-outline btn-md"
                onClick={() =>
                  handleUpdateEnqStatus(viewEnq._id, "in_progress")
                }
              >
                <Clock size={14} /> Mark In-Progress
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => handleUpdateEnqStatus(viewEnq._id, "resolved")}
              >
                <CheckCircle size={14} /> Mark Resolved
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Modal: Edit/Add FAQ ── */}
      <Modal
        open={!!editFaq}
        onClose={() => setEditFaq(null)}
        title={editFaq?._id ? "Edit FAQ" : "Add FAQ"}
        width={500}
      >
        {editFaq && (
          <form onSubmit={handleSaveFaq} className="frm-grid">
            <div className="frm-field">
              <label className="enq-label">Question</label>
              <input
                required
                className="frm-input"
                value={editFaq.question}
                onChange={(e) =>
                  setEditFaq({ ...editFaq, question: e.target.value })
                }
                placeholder="e.g. Do you ship internationally?"
              />
            </div>
            <div className="frm-field">
              <label className="enq-label">Answer</label>
              <textarea
                required
                className="frm-textarea"
                value={editFaq.answer}
                onChange={(e) =>
                  setEditFaq({ ...editFaq, answer: e.target.value })
                }
                placeholder="Type the answer here..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
            >
              <Save size={14} /> Save FAQ
            </button>
          </form>
        )}
      </Modal>

      {/* ── Modal: Edit/Add Store ── */}
      <Modal
        open={!!editStore}
        onClose={() => setEditStore(null)}
        title={editStore?._id ? "Edit Store" : "Add Store"}
        width={600}
      >
        {editStore && (
          <form onSubmit={handleSaveStore} className="frm-grid">
            <div
              className="frm-grid"
              style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
              <div className="frm-field">
                <label className="enq-label">City / Branch Name</label>
                <input
                  required
                  className="frm-input"
                  value={editStore.city}
                  onChange={(e) =>
                    setEditStore({ ...editStore, city: e.target.value })
                  }
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div className="frm-field">
                <label className="enq-label">Phone Number</label>
                <input
                  required
                  className="frm-input"
                  value={editStore.phone}
                  onChange={(e) =>
                    setEditStore({ ...editStore, phone: e.target.value })
                  }
                  placeholder="+91..."
                />
              </div>
            </div>
            <div className="frm-field">
              <label className="enq-label">Complete Address</label>
              <textarea
                required
                className="frm-textarea"
                style={{ minHeight: 60 }}
                value={editStore.address}
                onChange={(e) =>
                  setEditStore({ ...editStore, address: e.target.value })
                }
                placeholder="Shop 4, Gold Souk..."
              />
            </div>
            <div className="frm-field">
              <label className="enq-label">Working Hours</label>
              <input
                required
                className="frm-input"
                value={editStore.hours}
                onChange={(e) =>
                  setEditStore({ ...editStore, hours: e.target.value })
                }
                placeholder="Mon - Sun: 10 AM - 9 PM"
              />
            </div>
            <div className="frm-field">
              <label className="enq-label">
                Google Maps Embed URL (Optional)
              </label>
              <input
                className="frm-input"
                value={editStore.mapEmbedUrl}
                onChange={(e) =>
                  setEditStore({ ...editStore, mapEmbedUrl: e.target.value })
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-md"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
            >
              <Save size={14} /> Save Store Details
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
