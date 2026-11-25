"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { MdAddPhotoAlternate } from "react-icons/md"
import { display } from "@/lib/fonts"
import ConfirmModal from "@/app/admin/_components/ConfirmModal"

type Category = {
  _id: string
  title: string
  description?: string
  order?: number
  image?: any
  imageUrl?: string
}

const box =
  "w-full rounded-xl border border-[#1e1e1e] bg-white/[0.03] px-4 text-white placeholder:text-white/45 outline-none transition-colors focus:border-[#B9A5E8]/50 [color-scheme:dark]"

export default function CategoriesClient() {
  const [items, setItems] = useState<Category[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState("0")
  const [editing, setEditing] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [target, setTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const load = async () => {
    try {
      const r = await fetch("/api/admin/categories", { cache: "no-store" })
      if (!r.ok) throw new Error()
      setItems(await r.json())
    } catch {
      setError("Could not load categories. Check the Zeva Sanity configuration.")
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const reset = () => {
    setTitle("")
    setDescription("")
    setOrder("0")
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    try {
      let image: any = undefined
      if (imageFile) {
        const upload = new FormData()
        upload.append("file", imageFile)
        const uploaded = await fetch("/api/admin/product-upload", { method: "POST", body: upload })
        const asset = await uploaded.json()
        if (!uploaded.ok) throw new Error(asset.error || "Category image upload failed")
        image = { _type: "image", asset: { _type: "reference", _ref: asset._id } }
      }
      const r = await fetch(editing ? `/api/admin/categories/${editing}` : "/api/admin/categories", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description, order: Number(order), ...(image ? { image } : {}) }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || "Save failed")
      reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setBusy(false)
    }
  }

  const edit = (c: Category) => {
    setEditing(c._id)
    setTitle(c.title)
    setDescription(c.description || "")
    setOrder(String(c.order || 0))
    setImageFile(null)
    setImagePreview(null)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0)
  }

  const remove = async () => {
    if (!target) return
    setDeleting(true)
    setError("")
    try {
      const r = await fetch(`/api/admin/categories/${target._id}`, { method: "DELETE" })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) setError(data.error || "Delete failed")
      else await load()
    } catch {
      setError("Delete failed")
    }
    setDeleting(false)
    setTarget(null)
  }

  const preview = imagePreview || items.find((c) => c._id === editing)?.imageUrl

  return (
    <div className="flex flex-col gap-12 max-w-3xl">
      <ConfirmModal
        isOpen={!!target}
        title="Delete category"
        message={`Are you sure you want to delete "${target?.title}"? This can't be undone.`}
        confirmLabel="Yes, delete"
        cancelLabel="Keep it"
        variant="danger"
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setTarget(null)}
      />

      <header>
        <p className="text-sm text-white/60 mb-1.5">
          {items.length} {items.length === 1 ? "category" : "categories"}
        </p>
        <h1 className={`${display.className} text-[52px] md:text-[68px] font-light leading-none tracking-[-0.01em] text-white`}>
          Categories
        </h1>
        <p className="mt-3 text-sm text-white/60">Create, edit and add storefront images to your categories.</p>
      </header>

      <form ref={formRef} onSubmit={save} className="flex flex-col gap-5 scroll-mt-20">
        <h2 className={`${display.className} text-[28px] font-normal text-white`}>
          {editing ? "Edit category" : "Add category"}
        </h2>

        <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Category name</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Zeva Wears" className={`${box} h-12`} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Display order</span>
            <input type="number" inputMode="numeric" value={order} onChange={(e) => setOrder(e.target.value)} className={`${box} h-12`} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-white/70">Description (optional)</span>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short line about this category" className={`${box} py-3 resize-none`} />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-white/70">Category image (optional)</span>
          <label className="relative w-full sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden border border-dashed border-[#B9A5E8]/40 hover:border-[#B9A5E8] transition-colors bg-[#1d1830] flex items-center justify-center cursor-pointer">
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Category preview" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 h-6 px-2.5 inline-flex items-center rounded-full bg-black/70 text-[11px] text-white">
                  Change image
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center gap-1 text-[13px] text-[#B9A5E8]">
                <MdAddPhotoAlternate size={26} />
                Add image
              </span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setImageFile(file)
                  setImagePreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
          <p className="text-[13px] text-white/60">Choose a new image to replace the current one. Leave it empty to keep the existing image.</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="h-12 px-8 rounded-full bg-[#B9A5E8] text-[#1a1226] text-sm font-medium transition-colors hover:bg-[#D8C9F5] disabled:opacity-50 cursor-pointer"
          >
            {busy ? "Saving..." : editing ? "Save changes" : "Create category"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="h-12 px-6 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section>
        <h2 className={`${display.className} text-[28px] font-normal text-white mb-4`}>All categories</h2>
        {items.length === 0 ? (
          <div className="rounded-[20px] border border-[#1e1e1e] bg-white/[0.02] px-6 py-12 text-center">
            <p className={`${display.className} text-[26px] text-white`}>No categories yet</p>
            <p className="mt-2 text-sm text-white/60">Add your first category above.</p>
          </div>
        ) : (
          <ul className="border-t border-[#1e1e1e]">
            {items.map((c) => (
              <li key={c._id} className="flex flex-col gap-4 py-5 border-b border-[#1e1e1e] sm:flex-row sm:items-center sm:gap-5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#1d1830] border border-[#2a2342]">
                    {c.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.imageUrl} alt={`${c.title} category`} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`${display.className} text-2xl leading-tight text-white truncate`}>{c.title}</p>
                    <p className="text-[13px] text-white/60 truncate">
                      {[c.description, `Order ${c.order || 0}`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => edit(c)}
                    className="h-10 px-5 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setTarget(c)}
                    className="h-10 px-4 rounded-full text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}