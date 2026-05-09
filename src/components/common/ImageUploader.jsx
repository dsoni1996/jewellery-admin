"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, Image } from "lucide-react";

export default function ImageUploader({ value = [], onChange, max = 5, label = "Images" }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const upload = async (files) => {
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/single`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
          }
        );
        const data = await res.json();
        if (data.success) uploaded.push(data.url);
      } catch {}
    }
    onChange([...value, ...uploaded].slice(0, max));
    setUploading(false);
  };

  return (
    <div>
      <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"#9E8875", marginBottom:8 }}>
        {label}
      </p>

      {/* Preview grid */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
        {value.map((url, i) => (
          <div key={i} style={{ position:"relative", width:80, height:80 }}>
            <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:4, border:"1px solid #E8DDD0" }}/>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:"#993C1D", color:"#fff", border:"none", cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
              ✕
            </button>
          </div>
        ))}

        {/* Upload button */}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ width:80, height:80, border:"1.5px dashed #D4C4B0", borderRadius:4, background:"#FBF6EE", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, color:"#B8862A" }}>
            {uploading
              ? <Loader2 size={18} style={{ animation:"spin .8s linear infinite" }}/>
              : <><Upload size={18}/><span style={{ fontSize:9, letterSpacing:1 }}>UPLOAD</span></>
            }
          </button>
        )}
      </div>

      <input
        ref={inputRef} type="file" multiple accept="image/*"
        style={{ display:"none" }}
        onChange={e => upload(e.target.files)}
      />
      <p style={{ fontSize:11, color:"#9E8875" }}>
        {value.length}/{max} images · Max 5MB each · Auto-converted to WebP
      </p>
    </div>
  );
}