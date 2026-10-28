"use client";

import { useState, useEffect, type FormEvent } from "react";
import { apiAdmin } from "@/lib/apiAdmin";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast, Toast } from "@/components/admin/Toast";

interface Skill {
  id: number;
  name: string;
  iconName: string;
  colorHex: string;
  category: string;
}

const empty: Skill = { id: 0, name: "", iconName: "", colorHex: "", category: "" };

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Skill>(empty);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => { fetch(); }, []);
  const fetch = () => apiAdmin<{ data: Skill[] }>("admin/skills").then(r => { setItems(r.data); setLoading(false); });

  const openCreate = () => { setEditing(empty); setModal(true); };
  const openEdit = (s: Skill) => { setEditing(s); setModal(true); };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const body = {
        name: editing.name,
        icon_name: editing.iconName,
        color_hex: editing.colorHex || null,
        category: editing.category,
      };
      if (editing.id) {
        await apiAdmin(`admin/skills/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
        showToast("Skill updated!");
      } else {
        await apiAdmin("admin/skills", { method: "POST", body: JSON.stringify(body) });
        showToast("Skill created!");
      }
      setModal(false);
      fetch();
    } catch {
      showToast("Failed to save skill", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiAdmin(`admin/skills/${deleteId}`, { method: "DELETE" });
      showToast("Skill deleted!");
      setDeleteId(null);
      fetch();
    } catch {
      showToast("Failed to delete skill", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = activeCategory === "All" ? items : items.filter(s => s.category === activeCategory);
  const searched = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="space-y-3">{Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Skills</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-[0.97]">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", ...new Set(items.map((s) => s.category))].sort().map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97] ${
              activeCategory === cat ? "bg-zinc-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat} <span className="opacity-60">({cat === "All" ? items.length : items.filter(s => s.category === cat).length})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search skills..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 pl-10" />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      <div className="bg-white rounded-xl border shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Icon</th>
              <th className="px-4 py-3 font-medium">Color</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searched.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No skills yet.</td></tr>
            )}
            {searched.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.iconName}</td>
                <td className="px-4 py-3">{s.colorHex ? <span className="inline-block w-5 h-5 rounded border" style={{ background: s.colorHex }} /> : "—"}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">{s.category}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-all active:scale-[0.92]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all active:scale-[0.92]"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="font-heading text-lg font-semibold">{editing.id ? "Edit Skill" : "New Skill"}</h2>
              <button type="button" onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 active:scale-[0.92]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Name" value={editing.name} onChange={v => setEditing(p => ({ ...p, name: v }))} required />
              <Input label="Icon Name" value={editing.iconName} onChange={v => setEditing(p => ({ ...p, iconName: v }))} required placeholder="e.g. SiPython, SiLaravel, SiSpringboot" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Color Hex" value={editing.colorHex} onChange={v => setEditing(p => ({ ...p, colorHex: v }))} placeholder="e.g. #3776AB" />
                <Input label="Category" value={editing.category} onChange={v => setEditing(p => ({ ...p, category: v }))} required placeholder="Backend, Data Analytics, DevOps" />
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

      <ConfirmDialog open={deleteId !== null} loading={isDeleting} title="Delete Skill" message="Are you sure you want to delete this skill?" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

function Input({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input type="text" required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10" />
    </div>
  );
}
