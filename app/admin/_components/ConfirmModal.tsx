"use client"

import { useEffect } from "react"
import { MdClose } from "react-icons/md"
import { display } from "@/lib/fonts"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const CONFIRM_STYLES = {
  danger: "bg-red-600 text-white hover:bg-red-500",
  warning: "bg-amber-400 text-[#1a1000] hover:bg-amber-300",
  info: "bg-[#B9A5E8] text-[#1a1226] hover:bg-[#D8C9F5]",
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, loading, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-3xl p-7 bg-[#0d0d0e] border border-[#2a2342]"
      >
        <button
          onClick={onCancel}
          disabled={loading}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50"
        >
          <MdClose size={18} />
        </button>

        <h3
          id="confirm-modal-title"
          className={`${display.className} text-[30px] font-normal leading-tight text-white pr-10`}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65">{message}</p>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-12 rounded-full border border-[#2a2342] text-sm text-white/85 transition-colors hover:border-[#B9A5E8]/50 hover:text-white cursor-pointer disabled:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-[#B9A5E8]/50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-12 rounded-full text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${CONFIRM_STYLES[variant]}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}