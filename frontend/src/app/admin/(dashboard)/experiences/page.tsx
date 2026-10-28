"use client";

import { useState, useEffect, type FormEvent } from "react";
import { apiAdmin, getToken } from "@/lib/apiAdmin";
import { uploadFiles } from "@/lib/uploadthing";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast, Toast } from "@/components/admin/Toast";

interface Experience {
  id: number;
  role: string;
  company: string;
  type: string;
  periodStart: string;
  periodEnd: string | null;
  points: string[];
  imageUrls: (string | File)[];
  companyLogoUrl: string | File | null;
}

const empty: Experience = {
  id: 0,
  role: "",
  company: "",
  type: "",
  periodStart: "",
  periodEnd: "",
  points: [],
  imageUrls: [],
  companyLogoUrl: null,
};

export default function AdminExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Experience>(empty);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [originalLogoUrl, setOriginalLogoUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => { fetchData(); }, []);
  const fetchData = () =>
    apiAdmin<{ data: Experience[] }>("admin/experiences").then((r) => {
      setItems(r.data);
      setLoading(false);
    });

  const openCreate = () => {
    setEditing(empty);
    setOriginalImageUrls([]);
    setOriginalLogoUrl(null);
    setModal(true);
  };
  const openEdit = (e: Experience) => {
    setEditing(e);
    setOriginalImageUrls(e.imageUrls.filter((u): u is string => typeof u === "string"));
    setOriginalLogoUrl(typeof e.companyLogoUrl === "string" ? e.companyLogoUrl : null);
    setModal(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const token = getToken();
    let finalImageUrls: string[] = [];
    let finalLogoUrl = typeof editing.companyLogoUrl === "string" ? editing.companyLogoUrl : null;

    try {
      for (const img of editing.imageUrls) {
        if (img instanceof File) {
          const res = await uploadFiles("imageUploader", {
            files: [img],
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res?.[0]) finalImageUrls.push(res[0].ufsUrl ?? res[0].url);
        } else {
          finalImageUrls.push(img);
        }
      }

      // Upload logo company jika ada File baru
      if (editing.companyLogoUrl instanceof File) {
        const res = await uploadFiles("imageUploader", {
          files: [editing.companyLogoUrl],
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res?.[0]) finalLogoUrl = res[0].ufsUrl ?? res[0].url;
      }

      const body = {
        role: editing.role,
        company: editing.company,
        type: editing.type,
        period_start: editing.periodStart,
        period_end: editing.periodEnd || null,
        points: editing.points,
        image_urls: finalImageUrls,
        company_logo_url: finalLogoUrl,
      };

      if (editing.id) {
        await apiAdmin(`admin/experiences/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
        showToast("Experience updated!", "success");
      } else {
        await apiAdmin("admin/experiences", { method: "POST", body: JSON.stringify(body) });
        showToast("Experience created!", "success");
      }

      // Hapus gambar lama dari UploadThing yang tidak dipakai lagi
      for (const oldUrl of originalImageUrls) {
        if (oldUrl && !finalImageUrls.includes(oldUrl)) {
          await apiAdmin("uploadthing/delete", {
            method: "POST",
            body: JSON.stringify({ url: oldUrl }),
          }).catch((err) => console.error("Failed to delete old image:", err));
        }
      }
      if (originalLogoUrl && originalLogoUrl !== finalLogoUrl) {
        await apiAdmin("uploadthing/delete", {
          method: "POST",
          body: JSON.stringify({ url: originalLogoUrl }),
        }).catch((err) => console.error("Failed to delete old logo:", err));
      }

      setModal(false);
      fetchData();
    } catch {
      showToast("Failed to save experience", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiAdmin(`admin/experiences/${deleteId}`, { method: "DELETE" });
      showToast("Experience deleted!", "success");
      setDeleteId(null);
      fetchData();
    } catch {
      showToast("Failed to delete experience", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Experiences</h1>
        <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium w-14">Logo</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: j === 5 ? 64 : j === 3 ? 48 : undefined }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const types = ["All", ...new Set(items.map((e) => e.type))];
  const filtered = activeType === "All" ? items : items.filter(e => e.type === activeType);
  const searched = filtered.filter(e =>
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Experiences</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-[0.97]">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97] ${
              activeType === type ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type} <span className="opacity-60">({type === "All" ? items.length : items.filter(e => e.type === type).length})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search experiences..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 pl-10" />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium w-14">Logo</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searched.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No experiences yet.</td></tr>
            )}
            {searched.map((e) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {e.companyLogoUrl && typeof e.companyLogoUrl === "string" ? (
                    <img src={e.companyLogoUrl} alt={e.company} className="w-10 h-10 rounded-lg object-contain border bg-white p-1" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-xs font-bold">
                      {e.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{e.role}</td>
                <td className="px-4 py-3 text-gray-500">{e.company}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">{e.type}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{e.periodStart} — {e.periodEnd || "Present"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-all active:scale-[0.92]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all active:scale-[0.92]"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <form onSubmit={save} className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold">{editing.id ? "Edit Experience" : "New Experience"}</h2>
              <button type="button" onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 active:scale-[0.92]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Role" value={editing.role} onChange={v => setEditing(p => ({ ...p, role: v }))} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company" value={editing.company} onChange={v => setEditing(p => ({ ...p, company: v }))} required />
                <Input label="Type" value={editing.type} onChange={v => setEditing(p => ({ ...p, type: v }))} required placeholder="Full-time, Internship, etc" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Period Start" type="month" value={editing.periodStart} onChange={v => setEditing(p => ({ ...p, periodStart: v }))} required />
                <Input label="Period End" type="month" value={editing.periodEnd || ""} onChange={v => setEditing(p => ({ ...p, periodEnd: v }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Points (one per line)</label>
                <textarea value={editing.points.join("\n")} onChange={e => setEditing(p => ({ ...p, points: e.target.value.split("\n").filter(Boolean) }))} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" placeholder="Describe responsibilities, one per line" />
              </div>

              {/* Documentation Photo 1 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Documentation 1
                  <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <ImageUpload
                  value={editing.imageUrls[0] || ""}
                  onChange={v => {
                    const arr = [...editing.imageUrls];
                    if (v === null) {
                      arr.splice(0, 1);
                    } else {
                      arr[0] = v;
                    }
                    setEditing(p => ({ ...p, imageUrls: arr }));
                  }}
                />
              </div>

              {/* Documentation Photo 2 */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Documentation 2
                  <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <ImageUpload
                  value={editing.imageUrls[1] || ""}
                  onChange={v => {
                    const arr = [...editing.imageUrls];
                    if (v === null) {
                      arr.splice(1, 1);
                    } else {
                      arr[1] = v;
                    }
                    setEditing(p => ({ ...p, imageUrls: arr }));
                  }}
                />
              </div>

              {/* Logo Company */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Logo Company
                  <span className="text-xs text-gray-400 font-normal ml-1">(tampil sebagai badge kecil)</span>
                </label>
                <ImageUpload
                  value={editing.companyLogoUrl || ""}
                  onChange={v => setEditing(p => ({ ...p, companyLogoUrl: v }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button type="button" onClick={() => setModal(false)} disabled={isSaving} className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.97] disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-[0.97] disabled:opacity-70">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} loading={isDeleting} title="Delete Experience" message="Are you sure you want to delete this experience?" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

function Input({ label, value, onChange, required, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input type={type || "text"} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
    </div>
  );
}
