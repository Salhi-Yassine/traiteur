"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// FloatingInput
//
// Airbnb-style input where the label lives inside the box and rises to the
// top-left corner when the field is focused or has a value.
//
// Design rules (matches globals.css tokens):
//   • Resting border  : #B0B0B0  (neutral-400)
//   • Focus border    : #E8472A  (terracotta primary)
//   • Focus ring      : #E8472A / 10 %
//   • Error border    : #C13030
//   • Error ring      : #C13030 / 20 %
//   • Text cursor     : #E8472A
//   • The wrapper owns the border — the raw <input> has none.
// ─────────────────────────────────────────────────────────────────────────────

export interface FloatingInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Visible label that floats on focus / when the field has a value */
    label: string;
    /** Validation error message shown below the input */
    error?: string;
    /** Optional icon / button rendered on the trailing edge (e.g. eye toggle) */
    trailingSlot?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ id, label, error, trailingSlot, className, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {/* Wrapper owns the border + focus ring */}
                <div
                    className={cn(
                        "relative rounded-xl border bg-white transition-all duration-150",
                        error
                            ? "border-[#C13030] focus-within:ring-2 focus-within:ring-[#C13030]/20"
                            : "border-[#B0B0B0] focus-within:border-[#E8472A] focus-within:ring-2 focus-within:ring-[#E8472A]/10",
                    )}
                >
                    {/* Floating label — peer selectors drive the animation */}
                    <label
                        htmlFor={id}
                        className={cn(
                            "absolute start-4 pointer-events-none select-none transition-all duration-150 ease-out",
                            // Resting: centred vertically, full size
                            "top-1/2 -translate-y-1/2 text-[16px] text-[#717171]",
                            // Floated on focus
                            "peer-focus:top-[10px] peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[#E8472A]",
                            // Floated when field has a value (placeholder=" " trick)
                            "peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-[#717171]",
                        )}
                    >
                        {label}
                    </label>

                    {/* Input — no border of its own; wrapper handles it */}
                    <input
                        ref={ref}
                        id={id}
                        // A single space makes :placeholder-shown work correctly
                        // even before the user types (so the label stays floated
                        // when the field is pre-filled by formik).
                        placeholder=" "
                        className={cn(
                            "peer w-full h-[56px] pt-5 pb-1 px-4 rounded-xl",
                            "bg-transparent border-0 border-none",
                            "text-[16px] text-[#1A1A1A]",
                            "outline-none focus:outline-none focus:ring-0 focus:shadow-none",
                            "caret-[#E8472A]",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            trailingSlot ? "pe-12" : "",
                            className,
                        )}
                        {...props}
                    />

                    {/* Trailing slot (e.g. show/hide password button) */}
                    {trailingSlot && (
                        <div className="absolute end-3 top-1/2 -translate-y-1/2">
                            {trailingSlot}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-[13px] text-[#C13030] ps-1" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
