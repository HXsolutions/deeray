"use client"

import { useState, useEffect } from "react"

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", image: "", author: "", published: false })
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => fetch("/api/admin/blog").then((r) => r.json()).then((d) => setPosts(d.posts))

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const handleSave = async () => {
    await fetch("/api/admin/blog", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...form, id: editing } : form),
    })
    setForm({ title: "", slug: "", excerpt: "", content: "", image: "", author: "", published: false })
    setEditing(null)
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" })
    await load()
  }

  if (loading) return <div className="text-[#73777d]">Loading...</div>

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#062437] mb-8">Blog</h1>

      <div className="bg-white border border-[#e3e2e4] p-6 mb-8">
        <h3 className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-widest text-[#42474c] mb-4">
          {editing ? "Edit Post" : "New Post"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="col-span-2 border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
          <input type="text" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
          <input type="text" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
          <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="col-span-2 border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437]" />
          <textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="col-span-2 border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] h-20" />
          <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="col-span-2 border border-[#e3e2e4] px-4 py-3 text-sm focus:outline-none focus:border-[#062437] h-40" />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#062437]" />
            Published
          </label>
        </div>
        <button onClick={handleSave}
          className="mt-4 bg-[#062437] text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#1f3a4d]">
          {editing ? "Update" : "Create"}
        </button>
        {editing && (
          <button onClick={() => { setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", image: "", author: "", published: false }) }}
            className="mt-4 ml-3 px-6 py-3 border border-[#e3e2e4] text-xs uppercase tracking-widest hover:bg-[#f4f3f5]">
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white border border-[#e3e2e4]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e3e2e4]">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Title</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Author</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Date</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-[#73777d]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-[#e3e2e4] hover:bg-[#f4f3f5]">
                <td className="px-6 py-5 text-sm text-[#062437]">{p.title}</td>
                <td className="px-6 py-5 text-sm text-[#42474c]">{p.author || "—"}</td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${p.published ? "bg-[#d8e5e2] text-[#121e1c]" : "bg-[#e3e2e4] text-[#42474c]"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-[#73777d]">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  <button onClick={() => { setEditing(p.id); setForm(p) }} className="text-[#062437] text-xs uppercase tracking-widest hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-[#ba1a1a] text-xs uppercase tracking-widest hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
