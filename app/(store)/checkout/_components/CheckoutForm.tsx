
"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { NIGERIAN_STATES } from "../../../../lib/deliveryFee";

import {
  MdArrowForward,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
}

export default function CheckoutForm({
  formData,
  setFormData,
  onNext,
  loading = false,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  loading?: boolean;
}) {
  const cleanPhone = formData.phone.replace(/[\s()-]/g, "");

  const isValidPhone =
    /^(?:\+234|234|0)[789][01]\d{8}$/.test(cleanPhone);

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const isValid =
    formData.name.trim().length >= 2 &&
    isValidEmail &&
    isValidPhone &&
    formData.address.trim().length >= 5 &&
    Boolean(formData.state);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || loading) return;

    setFormData({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      state: formData.state,
    });

    onNext();
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const inputClass =
    "h-[50px] rounded-xl border border-[#30243F] bg-[#100D16] pl-11 text-[14px] text-white shadow-none transition-all placeholder:text-white/25 hover:border-[#71549A] focus-visible:border-[#B99AEF] focus-visible:ring-2 focus-visible:ring-[#B99AEF]/20";

  const labelClass =
    "mb-2 block text-[13px] font-medium text-white/75";

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#39284D] bg-[#17121F] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#7545A5]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-[#A98AD8]/10 blur-[90px]" />

      {/* Header */}
      <div className="relative border-b border-white/[0.07] px-6 py-7 md:px-9 md:py-9">

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[#76549C]/40 bg-[#76549C]/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C4A6F2]" />
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#C4A6F2]">
              Step 01
            </span>
          </div>

          <span className="text-[11px] font-medium tracking-wide text-white/35">
            DELIVERY INFORMATION
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A783D1]/30 bg-gradient-to-br from-[#76549C]/30 to-[#352344] text-[#D2B8F4]">
            <MdLocalShipping size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-[30px]">
              Where should we
              <span className="text-[#B99AEF]"> deliver?</span>
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
              Just a few details and your Zeva favourites will be one step
              closer to your doorstep.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-7 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#B99AEF]">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-[#B99AEF] to-[#8060B5]" />
          </div>
          <div className="h-1 flex-1 rounded-full bg-white/10" />
          <div className="h-1 flex-1 rounded-full bg-white/10" />
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider">
          <span className="text-[#C4A6F2]">Delivery</span>
          <span className="text-white/25">Payment</span>
          <span className="text-white/25">Confirmation</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative space-y-6 px-6 py-7 md:px-9 md:py-9"
      >
        <div>
          <h3 className="text-sm font-semibold text-white">
            Personal information
          </h3>
          <p className="mt-1 text-xs text-white/35">
            Your contact details for this order.
          </p>
        </div>

        {/* Name and email */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full name</label>
            <div className="relative">
              <MdPerson
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98AD8]"
              />
              <Input
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                minLength={2}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email address</label>
            <div className="relative">
              <MdEmail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98AD8]"
              />
              <Input
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <p className="mt-2 text-[11px] text-white/35">
              Order updates will be sent to this email.
            </p>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone number</label>
          <div className="relative">
            <MdPhone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A98AD8]"
            />
            <Input
              type="tel"
              autoComplete="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {formData.phone && !isValidPhone && (
            <p className="mt-2 text-xs text-red-400">
              Enter a valid Nigerian phone number.
            </p>
          )}
        </div>

        <div className="border-t border-white/[0.07] pt-6">
          <h3 className="text-sm font-semibold text-white">
            Delivery destination
          </h3>
          <p className="mt-1 text-xs text-white/35">
            Where would you like us to send your order?
          </p>
        </div>

        {/* State */}
        <div>
          <label className={labelClass}>State</label>

          <Select
            value={formData.state}
            onValueChange={(value) => updateField("state", value)}
          >
            <SelectTrigger className="h-[50px] rounded-xl border border-[#30243F] bg-[#100D16] px-4 text-sm text-white shadow-none transition-all hover:border-[#71549A] focus:ring-2 focus:ring-[#B99AEF]/20 data-[placeholder]:text-white/30">
              <SelectValue placeholder="Choose your delivery state" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              className="max-h-[240px] border border-[#49345F] bg-[#1B1425] text-white shadow-2xl"
            >
              {NIGERIAN_STATES.map((state) => (
                <SelectItem
                  key={state}
                  value={state}
                  className="cursor-pointer text-sm text-white focus:bg-[#76549C]/30 focus:text-white"
                >
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Full delivery address</label>

          <div className="relative">
            <MdLocationOn
              size={19}
              className="absolute left-4 top-4 text-[#A98AD8]"
            />

            <textarea
              placeholder="House number, street, area and nearby landmark..."
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              required
              minLength={5}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#30243F] bg-[#100D16] py-3.5 pl-11 pr-4 text-sm leading-6 text-white outline-none transition-all placeholder:text-white/25 hover:border-[#71549A] focus:border-[#B99AEF] focus:ring-2 focus:ring-[#B99AEF]/20"
            />
          </div>
          <p className="mt-2 text-[11px] text-white/35">
            Include a nearby landmark to help our delivery team locate you.
          </p>
        </div>

        {/* Delivery note */}
        <div className="flex items-start gap-3 rounded-xl border border-[#76549C]/25 bg-[#76549C]/10 p-4">
          <MdCheckCircle
            size={19}
            className="mt-0.5 shrink-0 text-[#B99AEF]"
          />
          <p className="text-xs leading-5 text-white/55">
            Please double-check your delivery details before continuing.
            Accurate information helps us get your order to you smoothly.
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          className="group flex h-[54px] w-full items-center justify-center gap-3 rounded-xl border border-[#C5A5F0]/30 bg-gradient-to-r from-[#76549C] via-[#906CBD] to-[#B294DC] text-sm font-bold text-white shadow-[0_8px_30px_rgba(118,84,156,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_35px_rgba(118,84,156,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {loading ? "Preparing your order..." : "Continue to payment"}
          <MdArrowForward
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </Button>

        <p className="text-center text-[11px] text-white/30">
          Your information is used only to process and deliver your order.
        </p>
      </form>
    </div>
  );
}
