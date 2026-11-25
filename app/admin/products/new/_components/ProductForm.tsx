"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { MdArrowBack, MdAddPhotoAlternate, MdClose } from "react-icons/md"
import { display } from "@/lib/fonts"

const box =
  "w-full rounded-xl border border-[#1e1e1e] bg-white/[0.03] px-4 text-white placeholder:text-white/45 outline-none transition-colors focus:border-[#B9A5E8]/50 [color-scheme:dark]"
const pill = (on: boolean) =>
  `h-10 px-5 rounded-full border text-sm transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50 ${
    on
      ? "border-[#B9A5E8]/30 bg-[#B9A5E8]/[0.12] text-[#B9A5E8]"
      : "border-[#1e1e1e] text-white/65 hover:text-white hover:border-white/20"
  }`

async function upload(file: File) {
  const body = new FormData()
  body.append("file", file)
  const res = await fetch("/api/admin/product-upload", { method: "POST", body })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Could not upload ${file.name}`)
  return { _type: "image", asset: { _type: "reference", _ref: data._id } }
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm text-white/70">{label}</span>
    {children}
  </label>
)

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className={`${display.className} text-[28px] font-normal text-white`}>{children}</h2>
)

export default function ProductForm() {
  const router = useRouter()
  const [f, setF] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "1",
    inStock: true,
    featured: false,
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { title: string }[]) => setCategories(items.map((i) => i.title)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const next = photos.map((file) => URL.createObjectURL(file))
    setUrls(next)
    return () => next.forEach((u) => URL.revokeObjectURL(u))
  }, [photos])

  const add = (list: FileList | null) => {
    const images = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"))
    if (images.length) setPhotos((p) => [...p, ...images])
  }

  const price = Number(f.price)
  const stock = Number(f.stock)
  const valid =
    photos.length > 0 &&
    !!f.name.trim() &&
    categories.includes(f.category) &&
    f.price.trim() !== "" &&
    price >= 0 &&
    f.stock.trim() !== "" &&
    Number.isInteger(stock) &&
    stock >= 0

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setBusy(true)
    setError("")
    try {
      const [image, ...images] = await Promise.all(photos.map(upload))
      const slug = f.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          category: f.category,
          price,
          description: f.description.trim(),
          stock,
          inStock: f.inStock && stock > 0,
          featured: f.featured,
          slug: { _type: "slug", current: slug },
          image,
          images,
        }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Product creation failed.")
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-10 max-w-3xl">
      <header>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 h-10 -ml-2 px-2 text-sm text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} /> Back
        </button>
        <p className="mt-3 text-sm text-white/60">New product</p>
        <h1
          className={`${display.className} mt-1.5 text-[44px] md:text-[56px] font-light leading-[1.05] tracking-[-0.01em] text-white`}
        >
          Add product
        </h1>
      </header>

      <section className="flex flex-col gap-5">
        <Heading>Photos</Heading>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {urls.length === photos.length &&
            urls.map((src, i) => (
              <div key={src} className="relative aspect-square rounded-2xl overflow-hidden border border-[#2a2342] bg-[#1d1830]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                {i > 0 && (
                  <button
                    type="button"
                    aria-label="Make main photo"
                    onClick={() => setPhotos((p) => [p[i], ...p.filter((_, j) => j !== i)])}
                    className="absolute inset-0 cursor-pointer"
                  />
                )}
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 h-6 px-2.5 inline-flex items-center rounded-full bg-black/70 text-[11px] text-white">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white cursor-pointer"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          <label className="aspect-square rounded-2xl border border-dashed border-[#B9A5E8]/40 text-[#B9A5E8] hover:border-[#B9A5E8] transition-colors flex flex-col items-center justify-center gap-1 text-[13px] cursor-pointer">
            <MdAddPhotoAlternate size={26} />
            Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => {
                add(e.target.files)
                e.target.value = ""
              }}
            />
          </label>
        </div>
        <p className="text-[13px] text-white/60">
          The first photo is the main image. Tap another photo to make it the main one.
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <Heading>Details</Heading>
        <Field label="Product name">
          <input required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Premium oversized t-shirt" className={`${box} h-12`} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <select required value={f.category} onChange={(e) => set("category", e.target.value)} className={`${box} h-12`}>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <span className="text-[13px] text-amber-300">No categories yet. Create one first.</span>
            )}
          </Field>
          <Field label="Price">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/60">₦</span>
              <input required type="number" min="0" inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="0" className={`${box} h-12 pl-9`} />
            </div>
          </Field>
        </div>
        <Field label="Available quantity">
          <input required type="number" min="0" step="1" inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} className={`${box} h-12 sm:max-w-[200px]`} />
        </Field>
        <Field label="Description (optional)">
          <textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe this product" className={`${box} py-3 resize-none`} />
        </Field>
      </section>

      <section className="flex flex-col gap-5">
        <Heading>Status</Heading>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={f.inStock} onClick={() => set("inStock", !f.inStock)} className={pill(f.inStock)}>
            {f.inStock ? "In stock" : "Out of stock"}
          </button>
          <button type="button" aria-pressed={f.featured} onClick={() => set("featured", !f.featured)} className={pill(f.featured)}>
            {f.featured ? "Featured" : "Not featured"}
          </button>
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-5 px-5 md:mx-0 md:px-0 py-4 flex items-center gap-3 border-t border-[#1e1e1e] bg-[#060606]/90 backdrop-blur">
        {!valid && (
          <p className="mr-auto hidden sm:block text-[13px] text-white/60">
            Add a photo, name, category, price and quantity.
          </p>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="h-12 px-6 rounded-full border border-[#2a2342] text-sm text-white/85 hover:border-[#B9A5E8]/50 hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || !valid}
          className="h-12 flex-1 sm:flex-none sm:px-8 rounded-full bg-[#B9A5E8] text-[#1a1226] text-sm font-medium transition-colors hover:bg-[#D8C9F5] disabled:opacity-40 disabled:hover:bg-[#B9A5E8] cursor-pointer"
        >
          {busy ? "Creating..." : "Create product"}
        </button>
      </div>
    </form>
  )
}