"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const EXPIRY_HOURS = 12
const EXPIRY_MS = EXPIRY_HOURS * 60 * 60 * 1000

export interface CartItem {
  _id: string
  name: string
  price: number
  image: any
  slug: string
  qty: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  expiresAt: number | null

  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  addItem: (item: Omit<CartItem, "qty">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  checkExpiry: () => void

  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      expiresAt: null,

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      toggleCart: () =>
        set((state) => ({ isOpen: !state.isOpen })),

      // Add a product while respecting its available stock.
      addItem: (item, quantity = 1) => {
        const stock = Math.max(0, Number(item.stock) || 0)

        if (stock <= 0 || quantity < 1) return

        const expiresAt = Date.now() + EXPIRY_MS

        set((state) => {
          const existingItem = state.items.find(
            (i) => i._id === item._id
          )

          if (existingItem) {
            const newQty = Math.min(
              existingItem.qty + quantity,
              stock
            )

            return {
              expiresAt,
              items: state.items.map((i) =>
                i._id === item._id
                  ? {
                      ...i,
                      stock,
                      qty: newQty,
                    }
                  : i
              ),
            }
          }

          return {
            expiresAt,
            items: [
              ...state.items,
              {
                ...item,
                stock,
                qty: Math.min(quantity, stock),
              },
            ],
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        })),

      // Never allow quantity to exceed available stock.
      updateQty: (id, qty) => {
        if (qty < 1) {
          get().removeItem(id)
          return
        }

        const item = get().items.find((i) => i._id === id)

        if (!item) return

        const stock = Math.max(0, Number(item.stock) || 0)

        // Remove products that no longer have available stock.
        if (stock <= 0) {
          get().removeItem(id)
          return
        }

        const safeQty = Math.min(qty, stock)

        set((state) => ({
          items: state.items.map((i) =>
            i._id === id
              ? { ...i, qty: safeQty }
              : i
          ),
        }))
      },

      clearCart: () =>
        set({
          items: [],
          expiresAt: null,
        }),

      checkExpiry: () => {
        const { expiresAt, clearCart } = get()

        if (expiresAt && Date.now() > expiresAt) {
          clearCart()
        }
      },

      totalItems: () =>
        get().items.reduce(
          (total, item) => total + item.qty,
          0
        ),

      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.qty,
          0
        ),
    }),
    {
      name: "zeva-collection-cart",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)