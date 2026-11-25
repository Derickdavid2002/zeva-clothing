
"use client"

import { useState, useEffect } from "react"
import { useCartStore, CartItem } from "../../store/cartStore"
import { useRouter } from "next/navigation"
import CheckoutForm from "./_components/CheckoutForm"
import BankDetails from "./_components/BankDetails"
import OrderSummary from "./_components/OrderSummary"
import ProofUpload from "./_components/ProofUpload"
import { getDeliveryFee } from "@/lib/deliveryFee"
import { MdCheckCircle, MdStorefront } from "react-icons/md"
import { Button } from "@/components/ui/button"

export type CheckoutStep = "details" | "bank" | "proof" | "success"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()

  const [step, setStep] = useState<CheckoutStep>("details")
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const [draftOrder, setDraftOrder] = useState<{
    sessionId: string
    uploadToken: string
    subtotal: number
    deliveryFee: number
    total: number
    pricedItems: CartItem[]
  } | null>(null)

  const [creatingOrder, setCreatingOrder] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0 && step !== "success") {
      router.push("/shop")
    }
  }, [mounted, items.length, step, router])

  if (!mounted) return null
  if (items.length === 0 && step !== "success") return null

  const localSubtotal = items.reduce(
    (a, i) => a + i.price * i.qty,
    0
  )

  const localDeliveryFee = formData.state
    ? getDeliveryFee(formData.state)
    : 0

  const localTotal = localSubtotal + localDeliveryFee

  const summaryItems = draftOrder?.pricedItems || items
  const subtotal = draftOrder?.subtotal ?? localSubtotal
  const deliveryFee = draftOrder?.deliveryFee ?? localDeliveryFee
  const total = draftOrder?.total ?? localTotal

  // Prepare checkout without creating an order in Sanity
  const handleContinueToPayment = async () => {
    if (draftOrder) {
      setStep("bank")
      return
    }

    setCreatingOrder(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          delivery: {
            address: formData.address,
            state: formData.state,
          },
          items: items.map((item) => ({
            productId: item._id,
            qty: item.qty,
          
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || "Could not prepare your checkout"
        )
      }

      setDraftOrder({
        sessionId: data.sessionId,
        uploadToken: data.uploadToken,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        pricedItems: data.pricedItems,
      })

      setStep("bank")
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not prepare checkout. Please try again."
      )
    } finally {
      setCreatingOrder(false)
    }
  }

  // Upload proof and create the actual order
  const handleProofSubmit = async (proofFile: File) => {
    setLoading(true)

    try {
      if (!draftOrder) {
        throw new Error(
          "Your checkout session has expired. Please continue from delivery details again."
        )
      }

      const proofData = new FormData()
      proofData.append("file", proofFile)

      const proofRes = await fetch(
        `/api/orders/${draftOrder.sessionId}/proof`,
        {
          method: "POST",
          headers: {
            "x-order-upload-token": draftOrder.uploadToken,
          },
          body: proofData,
        }
      )

      const proofResult = await proofRes.json()

      if (!proofRes.ok) {
        throw new Error(
          proofResult.error || "Payment proof upload failed"
        )
      }

      setOrderNumber(proofResult.orderNumber)
      clearCart()
      setDraftOrder(null)
      setStep("success")
    } catch (err) {
      console.error("Checkout failed:", err)

      throw err instanceof Error
        ? err
        : new Error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const STEPS = [
    { key: "details", label: "Details" },
    { key: "bank", label: "Payment" },
    { key: "proof", label: "Upload Proof" },
  ]

  return (
    <div className="min-h-screen bg-[#060606] pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[4px] text-[#B9A5E8] mb-2 font-semibold">
            Secure Checkout
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Complete Your Order
          </h1>
        </div>

        {/* Steps indicator */}
        {step !== "success" && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((s, i) => {
              const stepKeys = STEPS.map((s) => s.key)
              const currentIndex = stepKeys.indexOf(step)
              const isDone = i < currentIndex
              const isActive = s.key === step

              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[#B9A5E8] text-white shadow-[0_0_20px_rgba(185,165,232,0.4)]"
                            : "bg-white/5 border border-[#1e1e1e] text-white/30"
                      }`}
                    >
                      {isDone ? <MdCheckCircle size={16} /> : i + 1}
                    </div>

                    <span
                      className={`text-[12px] font-semibold hidden sm:block ${
                        isActive
                          ? "text-[#B9A5E8]"
                          : isDone
                            ? "text-green-400"
                            : "text-white/30"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-8 h-px ${
                        isDone ? "bg-green-500" : "bg-[#1e1e1e]"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Order summary */}
          {step !== "success" && (
            <div className="lg:col-span-1 lg:order-2">
              <OrderSummary
                items={summaryItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                state={formData.state}
              />
            </div>
          )}

          {/* Main content */}
          <div className="lg:col-span-2 lg:order-1">

            {step === "details" && (
              <CheckoutForm
                formData={formData}
                setFormData={(data) => {
                  setDraftOrder(null)
                  setFormData(data)
                }}
                onNext={handleContinueToPayment}
                loading={creatingOrder}
              />
            )}

            {step === "bank" && (
              <BankDetails
                total={total}
                onNext={() => setStep("proof")}
                onBack={() => setStep("details")}
              />
            )}

            {step === "proof" && (
              <ProofUpload
                loading={loading}
                onSubmit={handleProofSubmit}
                onBack={() => setStep("bank")}
              />
            )}

            {step === "success" && (
              <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5">

                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(185,165,232,0.1)",
                    border: "1px solid rgba(185,165,232,0.3)",
                    boxShadow: "0 0 40px rgba(185,165,232,0.2)",
                  }}
                >
                  <MdCheckCircle size={40} className="text-[#B9A5E8]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Order Placed Successfully!
                  </h2>

                  <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
                    Thank you! We've received your order and proof of payment.
                    A confirmation has been sent to your email.
                  </p>
                </div>

                <div
                  className="w-full max-w-xs rounded-2xl p-5 text-center"
                  style={{
                    background: "rgba(185,165,232,0.05)",
                    border: "1px solid rgba(185,165,232,0.2)",
                  }}
                >
                  <p className="text-[11px] text-white/30 uppercase tracking-[3px] mb-2">
                    Your Order Number
                  </p>

                  <p
                    className="text-[#B9A5E8] text-2xl font-black tracking-wider"
                    style={{ textShadow: "0 0 20px rgba(185,165,232,0.4)" }}
                  >
                    #{orderNumber}
                  </p>

                  <p className="text-white/20 text-[11px] mt-2">
                    Save this for reference
                  </p>
                </div>

                <div className="w-full bg-white/3 border border-[#1e1e1e] rounded-xl p-4 text-left">
                  <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-3">
                    What happens next?
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {[
                      "We'll verify your payment within a few hours",
                      "You'll receive an email once payment is confirmed",
                      "We'll notify you again when your order ships",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white"
                          style={{ background: "#B9A5E8" }}
                        >
                          {i + 1}
                        </div>

                        <p className="text-white/40 text-[12px] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/shop")}
                  className="w-full max-w-xs h-12 bg-gradient-to-r from-[#B9A5E8] to-[#8063B5] hover:opacity-90 text-white font-bold tracking-[1.5px] uppercase text-sm border-none shadow-[0_0_30px_rgba(185,165,232,0.4)] flex items-center gap-2"
                >
                  <MdStorefront size={18} />
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
