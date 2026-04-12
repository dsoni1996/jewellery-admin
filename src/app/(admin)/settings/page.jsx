"use client";
import { useState } from "react";
import { Save, Loader2, Bell, Shield, Store, Mail } from "lucide-react";
import { Toggle } from "../../../components/common";

const tabs = ["Store", "Notifications", "Security", "Email"];
const tabIcons = { Store, Notifications: Bell, Security: Shield, Email: Mail };

const S = `
.settings-wrap { display:grid; grid-template-columns:200px 1fr; gap:24px; }
@media(max-width:768px){ .settings-wrap { grid-template-columns:1fr; } }
.settings-nav { display:flex; flex-direction:column; gap:4px; }
.settings-nav-btn { display:flex; align-items:center; gap:10px; padding:10px 14px; background:none; border:none; cursor:pointer; font-family:var(--font-sans); font-size:13px; color:var(--text2); border-radius:var(--radius); transition:all .15s; text-align:left; }
.settings-nav-btn:hover { background:var(--bg); color:var(--dark); }
.settings-nav-btn.active { background:var(--gold-pale); color:var(--gold); }
.settings-section { margin-bottom:24px; }
.settings-section-title { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text3); margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border); }
.settings-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #F5EDE3; }
.settings-row:last-child { border-bottom:none; }
.settings-row-label { font-size:13px; font-weight:500; color:var(--dark); }
.settings-row-desc { font-size:12px; color:var(--text3); margin-top:1px; }
.save-bar { display:flex; justify-content:flex-end; padding-top:16px; border-top:1px solid var(--border); }
`;

export default function SettingsPage() {
  const [tab, setTab]     = useState("Store");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  /* Store settings */
  const [store, setStore] = useState({
    name: "MANAS Jewellers",
    tagline: "Crafting timeless jewellery since 1985",
    phone: "+91 98765 43210",
    email: "admin@manasjewellery.com",
    address: "42, MG Road, Mumbai – 400001",
    gst: "27AABCT3518Q1ZV",
    freeShippingMin: "50000",
    taxRate: "3",
  });

  /* Notification settings */
  const [notifs, setNotifs] = useState({
    newOrder: true, lowStock: true, newReview: false,
    orderDelivered: true, newCustomer: false, dailyReport: true,
  });

  /* Security */
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setS = k => e => setStore(p => ({ ...p, [k]: e.target.value }));
  const setN = k => v => setNotifs(p => ({ ...p, [k]: v }));

  return (
    <>
      <style>{S}</style>
      <div className="settings-wrap">
        {/* Nav */}
        <div className="card" style={{ padding: 12, height: "fit-content" }}>
          <div className="settings-nav">
            {tabs.map(t => {
              const Icon = tabIcons[t];
              return (
                <button key={t} className={`settings-nav-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                  <Icon size={14} /> {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="card">
          <div className="card-head"><span className="card-title">{tab} <em>Settings</em></span></div>
          <div className="card-body">

            {tab === "Store" && (
              <>
                <div className="settings-section">
                  <p className="settings-section-title">Brand Information</p>
                  <div className="form-grid">
                    <div className="form-field"><label className="form-label">Store Name</label>
                      <input className="form-input" value={store.name} onChange={setS("name")} /></div>
                    <div className="form-field"><label className="form-label">Phone</label>
                      <input className="form-input" value={store.phone} onChange={setS("phone")} /></div>
                  </div>
                  <div className="form-grid full">
                    <div className="form-field"><label className="form-label">Tagline</label>
                      <input className="form-input" value={store.tagline} onChange={setS("tagline")} /></div>
                  </div>
                  <div className="form-grid full">
                    <div className="form-field"><label className="form-label">Address</label>
                      <input className="form-input" value={store.address} onChange={setS("address")} /></div>
                  </div>
                </div>
                <div className="settings-section">
                  <p className="settings-section-title">Commerce Settings</p>
                  <div className="form-grid three">
                    <div className="form-field"><label className="form-label">GST Number</label>
                      <input className="form-input" value={store.gst} onChange={setS("gst")} /></div>
                    <div className="form-field"><label className="form-label">Free Shipping Min (₹)</label>
                      <input className="form-input" type="number" value={store.freeShippingMin} onChange={setS("freeShippingMin")} /></div>
                    <div className="form-field"><label className="form-label">GST Rate (%)</label>
                      <input className="form-input" type="number" value={store.taxRate} onChange={setS("taxRate")} /></div>
                  </div>
                </div>
              </>
            )}

            {tab === "Notifications" && (
              <div className="settings-section">
                <p className="settings-section-title">Email Alerts</p>
                {[
                  { key:"newOrder",       label:"New Order",         desc:"Get notified when a new order is placed" },
                  { key:"lowStock",       label:"Low Stock Alert",   desc:"Alert when product qty drops below 5" },
                  { key:"newReview",      label:"New Review",        desc:"Alert for every new product review" },
                  { key:"orderDelivered", label:"Order Delivered",   desc:"Confirmation when order is delivered" },
                  { key:"newCustomer",    label:"New Customer",      desc:"Alert when a new customer registers" },
                  { key:"dailyReport",    label:"Daily Report",      desc:"Daily summary of orders and revenue" },
                ].map(item => (
                  <div key={item.key} className="settings-row">
                    <div>
                      <p className="settings-row-label">{item.label}</p>
                      <p className="settings-row-desc">{item.desc}</p>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={setN(item.key)} />
                  </div>
                ))}
              </div>
            )}

            {tab === "Security" && (
              <div className="settings-section">
                <p className="settings-section-title">Change Password</p>
                <div className="form-grid full">
                  <div className="form-field"><label className="form-label">Current Password</label>
                    <input className="form-input" type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} /></div>
                </div>
                <div className="form-grid">
                  <div className="form-field"><label className="form-label">New Password</label>
                    <input className="form-input" type="password" value={pwd.newPwd} onChange={e => setPwd(p => ({ ...p, newPwd: e.target.value }))} /></div>
                  <div className="form-field"><label className="form-label">Confirm Password</label>
                    <input className="form-input" type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} /></div>
                </div>
                <p style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>Password must be at least 8 characters with a number and special character.</p>
              </div>
            )}

            {tab === "Email" && (
              <div className="settings-section">
                <p className="settings-section-title">SMTP Configuration</p>
                <div className="form-grid">
                  <div className="form-field"><label className="form-label">SMTP Host</label>
                    <input className="form-input" defaultValue="smtp.gmail.com" /></div>
                  <div className="form-field"><label className="form-label">SMTP Port</label>
                    <input className="form-input" type="number" defaultValue="587" /></div>
                </div>
                <div className="form-grid">
                  <div className="form-field"><label className="form-label">From Email</label>
                    <input className="form-input" defaultValue="noreply@manasjewellery.com" /></div>
                  <div className="form-field"><label className="form-label">From Name</label>
                    <input className="form-input" defaultValue="MANAS Jewellers" /></div>
                </div>
                <div className="form-grid full">
                  <div className="form-field"><label className="form-label">App Password</label>
                    <input className="form-input" type="password" defaultValue="••••••••••••" /></div>
                </div>
              </div>
            )}

            <div className="save-bar">
              <button className="btn btn-primary btn-md" onClick={save} disabled={saving}>
                {saving ? <><Loader2 size={13} className="loader-spin" /> Saving…</>
                 : saved ? "✓ Saved!"
                 : <><Save size={13} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
