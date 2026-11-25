
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  MdArrowBack,
  MdArrowForward,
  MdContentCopy,
  MdCheck,
  MdAccountBalance,
  MdPayments,
  MdSecurity,
  MdInfoOutline,
} from "react-icons/md";

const BANK = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || "",
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "",
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "",
};

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export default function BankDetails({
  total,
  onNext,
  onBack,
}: {
  total: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const bankConfigured =
    Boolean(BANK.bankName && BANK.accountNumber && BANK.accountName);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const details = [
    { label: "Bank name", value: BANK.bankName, key: "bank" },
    { label: "Account number", value: BANK.accountNumber, key: "account" },
    { label: "Account name", value: BANK.accountName, key: "name" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[#39284D] bg-[#17121F] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#76549C]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-[#A98AD8]/10 blur-[90px]" />

      {/* Header */}
      <div className="relative border-b border-white/[0.07] px-6 py-7 md:px-9 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[#76549C]/40 bg-[#76549C]/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C4A6F2]" />
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#C4A6F2]">
              Step 02
            </span>
          </div>

          <span className="text-[11px] font-medium tracking-wide text-white/35">
            PAYMENT
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A783D1]/30 bg-gradient-to-br from-[#76549C]/30 to-[#352344] text-[#D2B8F4]">
            <MdPayments size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-[30px]">
              Complete your
              <span className="text-[#B99AEF]"> payment.</span>
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
              Use the bank details below to make your transfer and secure your
              Zeva order.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-7 flex items-center gap-2">
          <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#B99AEF] to-[#8060B5]" />
          <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-[#B99AEF] to-[#8060B5]" />
          <div className="h-1 flex-1 rounded-full bg-white/10" />
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider">
          <span className="text-white/35">Delivery</span>
          <span className="text-[#C4A6F2]">Payment</span>
          <span className="text-white/25">Confirmation</span>
        </div>
      </div>

      <div className="relative space-y-6 px-6 py-7 md:px-9 md:py-9">

        {/* Amount */}
        <div className="relative overflow-hidden rounded-2xl border border-[#76549C]/40 bg-gradient-to-br from-[#352344] via-[#24192F] to-[#17121F] p-6 md:p-7">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#B99AEF]/15 blur-[65px]" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#C4A6F2]/70">
                Amount to transfer
              </p>

              <p className="mt-3 text-3xl font-black tracking-tight text-white md:text-[38px]">
                {fmt(total)}
              </p>

              <p className="mt-2 text-xs text-white/45">
                Please transfer the exact amount shown.
              </p>
            </div>

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#D2B8F4] sm:flex">
              <MdPayments size={27} />
            </div>
          </div>
        </div>

        {/* Bank details */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">
              Bank transfer details
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Transfer to this Zeva Collection account.
            </p>
          </div>

          {bankConfigured ? (
            <div className="overflow-hidden rounded-2xl border border-[#49345F] bg-[#100D16]">
              {details.map((item, index) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between gap-3 px-4 py-4 md:px-5 ${
                    index !== details.length - 1
                      ? "border-b border-white/[0.07]"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-white/35">
                      {item.label}
                    </p>

                    <p className="break-words text-sm font-bold text-white md:text-[15px]">
                      {item.value}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.value, item.key)}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#76549C]/30 bg-[#76549C]/10 px-3 py-2 text-xs font-semibold text-[#C4A6F2] transition-all hover:border-[#B99AEF]/60 hover:bg-[#76549C]/20"
                  >
                    {copied === item.key ? (
                      <>
                        <MdCheck size={15} />
                        Copied
                      </>
                    ) : (
                      <>
                        <MdContentCopy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
              <div className="flex items-start gap-3">
                <MdInfoOutline className="mt-0.5 shrink-0 text-amber-400" size={20} />
                <div>
                  <p className="text-sm font-semibold text-amber-300">
                    Bank details unavailable
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-200/60">
                    Bank transfer details have not been configured for Zeva
                    Collection yet. Please contact the store before making
                    payment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-[#76549C]/25 bg-[#76549C]/[0.08] p-5">
          <div className="mb-4 flex items-center gap-2">
            <MdInfoOutline size={19} className="text-[#C4A6F2]" />
            <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#C4A6F2]">
              Before you continue
            </h3>
          </div>

          <div className="space-y-3">
            {[
              "Transfer the exact amount displayed above.",
              "Take a screenshot of your successful transfer confirmation.",
              "Click the button below to upload your payment proof.",
              "Delivery fee will be communicated after order confirmation if it has not been calculated.",
            ].map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#76549C]/30 text-[10px] font-bold text-[#D2B8F4]">
                  {index + 1}
                </span>

                <p className="text-xs leading-5 text-white/60">
                  {instruction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
          <MdSecurity size={19} className="shrink-0 text-[#B99AEF]" />

          <p className="text-[11px] leading-5 text-white/40">
            Your order will be reviewed after you submit your payment
            confirmation.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="h-[52px] flex-1 gap-2 rounded-xl border-[#49345F] bg-transparent text-sm font-semibold text-white/65 transition-all hover:border-[#A98AD8]/60 hover:bg-[#76549C]/10 hover:text-white"
          >
            <MdArrowBack size={18} />
            Back
          </Button>

          <Button
            type="button"
            onClick={onNext}
            disabled={!bankConfigured}
            className="group h-[52px] flex-1 gap-2 rounded-xl border border-[#C5A5F0]/30 bg-gradient-to-r from-[#76549C] via-[#906CBD] to-[#B294DC] text-sm font-bold text-white shadow-[0_8px_30px_rgba(118,84,156,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_35px_rgba(118,84,156,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            I've Made Payment
            <MdArrowForward
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
