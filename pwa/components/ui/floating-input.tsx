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
                            ? "border-danger focus-within:ring-2 focus-within:ring-danger/20"
                            : "border-neutral-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
                    )}
                >
                    {/* Input — must come BEFORE label for peer-selectors to work */}
                    <input
                        ref={ref}
                        id={id}
                        placeholder=" "
                        className={cn(
                            "peer w-full h-[56px] pt-5 pb-1 px-4 rounded-xl",
                            "bg-transparent border-0 border-none",
                            "text-[16px] text-neutral-900",
                            "outline-none focus:outline-none focus:ring-0 focus:shadow-none",
                            "caret-primary",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            trailingSlot ? "pe-12" : "",
                            className,
                        )}
                        {...props}
                    />

                    {/* Floating label — peer selectors drive the animation */}
                    <label
                        htmlFor={id}
                        className={cn(
                            "absolute start-4 pointer-events-none select-none transition-all duration-200 ease-out",
                            // Resting: centred vertically, full size
                            "top-1/2 -translate-y-1/2 text-[16px] text-neutral-500",
                            // Floated on focus
                            "peer-focus:top-[8px] peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-primary",
                            // Floated when field has a value (placeholder=" " trick)
                            "peer-[:not(:placeholder-shown)]:top-[8px] peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-neutral-500",
                        )}
                    >
                        {label}
                    </label>

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
