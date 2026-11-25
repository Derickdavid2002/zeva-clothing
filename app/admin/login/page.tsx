
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md"

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await signIn("credentials", {
        username: form.username.trim(),
        password: form.password,
        redirect: false,
      })

      console.log("ZEVA LOGIN RESULT:", result)

      if (!result) {
        setError("No response from the authentication server.")
        return
      }

      if (result.ok && !result.error) {
        setSuccess(true)
        setError("Login successful! Redirecting to dashboard...")

        window.location.assign("/admin/dashboard")
        return
      }

      const code = result.code || result.error || ""

      switch (code) {
        case "incorrect_username":
          setError("Incorrect username. Please check your username.")
          break

        case "incorrect_password":
          setError("Incorrect password. Please try again.")
          break

        case "admin_credentials_not_configured":
          setError(
            "Server configuration error: Admin credentials are missing in Vercel."
          )
          break

        case "CredentialsSignin":
          setError(
            "Login failed. The credentials were rejected. Check your username and password."
          )
          break

        default:
          setError(
            `Authentication error: ${code || "Unknown error"}. Check the browser console.`
          )
      }
    } catch (err) {
      console.error("ZEVA LOGIN EXCEPTION:", err)

      setError(
        err instanceof Error
          ? `Server error: ${err.message}`
          : "An unexpected authentication error occurred."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#060606" }}
    >
      {/* Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(185,165,232,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-black text-[22px] text-[#B9A5E8] tracking-[3px] uppercase mb-1"
            style={{
              fontFamily: "'Arial Black', sans-serif",
              textShadow: "0 0 20px rgba(185,165,232,0.5)",
            }}
          >
            ZEVA COLLECTION
          </h1>

          <p
            className="text-[#D8C9F5] text-[12px] tracking-widest opacity-90 mb-2"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
          />

          <p className="text-white/30 text-[11px] uppercase tracking-[3px]">
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#111111",
            border: "1px solid #1e1e1e",
            boxShadow: "0 0 40px rgba(185,165,232,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(185,165,232,0.1)",
                border: "1px solid rgba(185,165,232,0.2)",
              }}
            >
              <MdLock size={18} className="text-[#B9A5E8]" />
            </div>

            <div>
              <h2 className="text-white font-bold text-[15px]">
                Sign In
              </h2>
              <p className="text-white/30 text-[11px]">
                Access your admin panel
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Username
              </label>

              <div className="relative">
                <MdPerson
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />

                <Input
                  type="text"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => {
                    setForm({ ...form, username: e.target.value })
                    setError("")
                    setSuccess(false)
                  }}
                  required
                  className="pl-9 bg-white/5 border-[#1e1e1e] text-white placeholder:text-white/15 focus:border-[#B9A5E8]/40 rounded-xl h-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                Password
              </label>

              <div className="relative">
                <MdLock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value })
                    setError("")
                    setSuccess(false)
                  }}
                  required
                  className="pl-9 pr-10 bg-white/5 border-[#1e1e1e] text-white placeholder:text-white/15 focus:border-[#B9A5E8]/40 rounded-xl h-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <MdVisibilityOff size={16} />
                  ) : (
                    <MdVisibility size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Login feedback */}
            {error && (
              <div
                role="alert"
                className="rounded-xl px-4 py-3"
                style={{
                  background: success
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  border: success
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <p
                  className={`text-[12px] font-semibold ${
                    success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-[#B9A5E8] to-[#8063B5] hover:opacity-90 text-white font-bold tracking-[1.5px] uppercase text-sm border-none shadow-[0_0_30px_rgba(185,165,232,0.35)] disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <MdLock size={16} />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/15 text-[11px] mt-6">
          © 2026 Zeva Collection
        </p>
      </div>
    </div>
  )
}
